import { Prisma, TemplateTier } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { createDefaultCoverLetterData, createDefaultResumeData } from "@/lib/document-defaults";
import type { CoverLetterData, ResumeData } from "@/types/documents";
import { getCoverLetterTemplateByKey, getResumeTemplateByKey } from "@/server/templates/template-registry";

function createSlug(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

function asResumeData(value: unknown): ResumeData {
  return (value as ResumeData | null) ?? createDefaultResumeData();
}

function asCoverLetterData(value: unknown): CoverLetterData {
  return (value as CoverLetterData | null) ?? createDefaultCoverLetterData();
}

function isMissingDocumentSchemaError(error: unknown) {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    (error.code === "P2021" || error.code === "P2022")
  );
}

export async function listDocumentsForDashboard(userId: string) {
  try {
    const [resumes, coverLetters] = await Promise.all([
      prisma.resume.findMany({
        where: { userId },
        orderBy: { updatedAt: "desc" },
        select: {
          id: true,
          title: true,
          templateKey: true,
          templateTier: true,
          updatedAt: true,
          status: true
        }
      }),
      prisma.coverLetter.findMany({
        where: { userId },
        orderBy: { updatedAt: "desc" },
        select: {
          id: true,
          title: true,
          templateKey: true,
          templateTier: true,
          updatedAt: true,
          status: true
        }
      })
    ]);

    return { resumes, coverLetters };
  } catch (error) {
    if (isMissingDocumentSchemaError(error)) {
      return { resumes: [], coverLetters: [] };
    }

    throw error;
  }
}

export async function createResumeForUser(userId: string, templateKey?: string) {
  const template = getResumeTemplateByKey(templateKey ?? "minimal-ats");
  const defaultData = createDefaultResumeData();
  const title = `${template.metadata.name} CV`;

  return prisma.resume.create({
    data: {
      userId,
      title,
      slug: createSlug(title),
      templateKey: template.metadata.key,
      templateFamily: template.family,
      templateTier: template.metadata.tier,
      draftData: defaultData,
      sectionOrder: template.visibleSections,
      hiddenSections: []
    }
  });
}

export async function createCoverLetterForUser(userId: string, templateKey?: string) {
  const template = getCoverLetterTemplateByKey(templateKey ?? "classic-professional");
  const defaultData = createDefaultCoverLetterData();
  const title = `${template.metadata.name} Cover Letter`;

  return prisma.coverLetter.create({
    data: {
      userId,
      title,
      templateKey: template.metadata.key,
      templateFamily: template.family,
      templateTier: template.metadata.tier,
      draftData: defaultData
    }
  });
}

export async function getResumeById(userId: string, resumeId: string) {
  const resume = await prisma.resume.findFirst({
    where: {
      id: resumeId,
      userId
    }
  });

  if (!resume) {
    return null;
  }

  return {
    ...resume,
    draftData: asResumeData(resume.draftData)
  };
}

export async function getCoverLetterById(userId: string, coverLetterId: string) {
  const coverLetter = await prisma.coverLetter.findFirst({
    where: {
      id: coverLetterId,
      userId
    }
  });

  if (!coverLetter) {
    return null;
  }

  return {
    ...coverLetter,
    draftData: asCoverLetterData(coverLetter.draftData)
  };
}

type ResumeUpdateInput = {
  title: string;
  templateKey: string;
  photoEnabled: boolean;
  accentColor?: string | null;
  sectionOrder: string[];
  hiddenSections: string[];
  draftData: ResumeData;
};

export async function updateResumeForUser(userId: string, resumeId: string, input: ResumeUpdateInput) {
  const template = getResumeTemplateByKey(input.templateKey);

  return prisma.resume.update({
    where: { id: resumeId },
    data: {
      userId,
      title: input.title,
      slug: createSlug(input.title),
      templateKey: template.metadata.key,
      templateFamily: template.family,
      templateTier: template.metadata.tier,
      photoEnabled: input.photoEnabled,
      accentColor: input.accentColor,
      sectionOrder: input.sectionOrder,
      hiddenSections: input.hiddenSections,
      draftData: input.draftData
    }
  });
}

type CoverLetterUpdateInput = {
  title: string;
  templateKey: string;
  draftData: CoverLetterData;
};

export async function updateCoverLetterForUser(userId: string, coverLetterId: string, input: CoverLetterUpdateInput) {
  const template = getCoverLetterTemplateByKey(input.templateKey);

  return prisma.coverLetter.update({
    where: { id: coverLetterId },
    data: {
      userId,
      title: input.title,
      templateKey: template.metadata.key,
      templateFamily: template.family,
      templateTier: template.metadata.tier,
      draftData: input.draftData
    }
  });
}

export async function deleteResumeForUser(userId: string, resumeId: string) {
  return prisma.resume.deleteMany({
    where: {
      id: resumeId,
      userId
    }
  });
}

export async function deleteCoverLetterForUser(userId: string, coverLetterId: string) {
  return prisma.coverLetter.deleteMany({
    where: {
      id: coverLetterId,
      userId
    }
  });
}

export async function duplicateResumeForUser(userId: string, resumeId: string) {
  const original = await getResumeById(userId, resumeId);

  if (!original) {
    return null;
  }

  return prisma.resume.create({
    data: {
      userId,
      title: `${original.title} Copy`,
      slug: createSlug(`${original.title}-copy`),
      templateKey: original.templateKey,
      templateFamily: original.templateFamily,
      templateTier: original.templateTier,
      photoEnabled: original.photoEnabled,
      accentColor: original.accentColor,
      sectionOrder: original.sectionOrder,
      hiddenSections: original.hiddenSections,
      draftData: original.draftData
    }
  });
}

export async function duplicateCoverLetterForUser(userId: string, coverLetterId: string) {
  const original = await getCoverLetterById(userId, coverLetterId);

  if (!original) {
    return null;
  }

  return prisma.coverLetter.create({
    data: {
      userId,
      title: `${original.title} Copy`,
      templateKey: original.templateKey,
      templateFamily: original.templateFamily,
      templateTier: original.templateTier,
      draftData: original.draftData
    }
  });
}

export function getTemplateTierLabel(templateTier: TemplateTier) {
  return templateTier === TemplateTier.PREMIUM ? "Premium" : "Free";
}
