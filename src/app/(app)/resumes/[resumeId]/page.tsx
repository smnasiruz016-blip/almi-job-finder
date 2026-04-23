import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { canUseAiWriting, canUsePremiumTemplates } from "@/lib/plans";
import { ResumeBuilder } from "@/components/documents/resume-builder";
import { getResumeById } from "@/server/services/document-service";
import { getResumeTemplates } from "@/server/templates/template-registry";

type ResumeEditorPageProps = {
  params: Promise<{
    resumeId: string;
  }>;
};

export default async function ResumeEditorPage({ params }: ResumeEditorPageProps) {
  const user = await requireUser();
  const { resumeId } = await params;
  const resume = await getResumeById(user.id, resumeId);

  if (!resume) {
    notFound();
  }

  return (
    <ResumeBuilder
      resume={{
        ...resume,
        updatedAt: resume.updatedAt.toISOString()
      }}
      templates={getResumeTemplates()}
      canUsePremiumTemplates={canUsePremiumTemplates(user.subscriptionTier)}
      canUseAiWriting={canUseAiWriting(user.subscriptionTier)}
    />
  );
}
