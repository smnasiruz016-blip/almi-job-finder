import type { CoverLetterTemplateConfig, ResumeTemplateConfig } from "@/types/documents";

type TemplatePresentation = {
  familyLabel: string;
  audience: string;
  layoutLabel: string;
  tone: string;
};

const resumePresentationMap: Record<ResumeTemplateConfig["family"], TemplatePresentation> = {
  MINIMAL_ATS: {
    familyLabel: "Minimal ATS",
    audience: "Structured roles, operations, business, and hiring pipelines that value clarity",
    layoutLabel: "Single-column clarity",
    tone: "Clean, safe, and recruiter-friendly"
  },
  MODERN_PROFESSIONAL: {
    familyLabel: "Modern Professional",
    audience: "Consulting, account management, product, people ops, and polished generalist roles",
    layoutLabel: "Balanced two-column",
    tone: "Modern, calm, and versatile"
  },
  BOLD_STARTUP: {
    familyLabel: "Bold Startup",
    audience: "Startup, growth, product marketing, and ambitious fast-moving teams",
    layoutLabel: "High-contrast statement",
    tone: "Confident, energetic, and memorable"
  },
  CREATIVE_PORTFOLIO: {
    familyLabel: "Creative Portfolio",
    audience: "Designers, creators, freelancers, brand strategists, and visual storytellers",
    layoutLabel: "Creative editorial split",
    tone: "Expressive without losing structure"
  },
  COMPACT_ONE_PAGE: {
    familyLabel: "Compact One-Page",
    audience: "Fresh graduates, junior professionals, and concise one-page applications",
    layoutLabel: "Compact one-page",
    tone: "Efficient, focused, and neat"
  },
  ACADEMIC_CLEAN: {
    familyLabel: "Academic Clean",
    audience: "Research, teaching, medical, qualification-heavy, and academic profiles",
    layoutLabel: "Orderly academic stack",
    tone: "Calm, detailed, and trustworthy"
  }
};

const coverLetterPresentationMap: Record<CoverLetterTemplateConfig["family"], TemplatePresentation> = {
  CLASSIC_PROFESSIONAL: {
    familyLabel: "Classic Professional",
    audience: "Formal applications, conservative industries, and traditional business roles",
    layoutLabel: "Formal letter layout",
    tone: "Dependable and polished"
  },
  MODERN_CLEAN: {
    familyLabel: "Modern Clean",
    audience: "General professional applications with a contemporary but safe style",
    layoutLabel: "Modern clean header",
    tone: "Fresh, clear, and confident"
  },
  MINIMAL_ATS: {
    familyLabel: "Minimal ATS",
    audience: "High-volume applications and ATS-sensitive workflows",
    layoutLabel: "Minimal letter structure",
    tone: "Direct and efficient"
  },
  BOLD_CONTEMPORARY: {
    familyLabel: "Bold Contemporary",
    audience: "Creative, startup, or high-personality roles where tone matters",
    layoutLabel: "Contemporary statement",
    tone: "Distinctive and modern"
  }
};

export function getTemplatePresentation(template: ResumeTemplateConfig | CoverLetterTemplateConfig): TemplatePresentation {
  if (template.metadata.kind === "resume") {
    return resumePresentationMap[template.family as ResumeTemplateConfig["family"]];
  }

  return coverLetterPresentationMap[template.family as CoverLetterTemplateConfig["family"]];
}
