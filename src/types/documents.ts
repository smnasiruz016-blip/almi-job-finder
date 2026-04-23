import type {
  CoverLetterTemplateFamily,
  ResumeTemplateFamily,
  SubscriptionTier,
  TemplateTier
} from "@prisma/client";

export type ResumeBasics = {
  fullName: string;
  professionalTitle: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  linkedIn: string;
  photoUrl: string;
};

export type ResumeExperienceItem = {
  id: string;
  role: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  bullets: string[];
};

export type ResumeEducationItem = {
  id: string;
  degree: string;
  school: string;
  location: string;
  startDate: string;
  endDate: string;
  details: string;
};

export type ResumeProjectItem = {
  id: string;
  name: string;
  role: string;
  link: string;
  bullets: string[];
};

export type ResumeCertificationItem = {
  id: string;
  name: string;
  issuer: string;
  year: string;
};

export type ResumeLinkItem = {
  id: string;
  label: string;
  url: string;
};

export type ResumeData = {
  basics: ResumeBasics;
  summary: string;
  experience: ResumeExperienceItem[];
  education: ResumeEducationItem[];
  skills: string[];
  projects: ResumeProjectItem[];
  certifications: ResumeCertificationItem[];
  links: ResumeLinkItem[];
};

export type CoverLetterData = {
  jobTitle: string;
  company: string;
  hiringManager: string;
  intro: string;
  body: string;
  closing: string;
};

export type TemplateKind = "resume" | "coverLetter";
export type LayoutMode = "single-column" | "two-column" | "header-accent";

export type ThemeConfig = {
  accent: string;
  accentSoft: string;
  surface: string;
  text: string;
  muted: string;
};

export type TemplateMetadata = {
  key: string;
  name: string;
  description: string;
  previewLabel: string;
  kind: TemplateKind;
  tier: TemplateTier;
};

export type ResumeTemplateConfig = {
  metadata: TemplateMetadata;
  family: ResumeTemplateFamily;
  layout: {
    mode: LayoutMode;
    density: "compact" | "comfortable";
    showPhoto: boolean;
    sidebarSections: string[];
    mainSections: string[];
  };
  theme: ThemeConfig;
  visibleSections: Array<keyof ResumeData>;
};

export type CoverLetterTemplateConfig = {
  metadata: TemplateMetadata;
  family: CoverLetterTemplateFamily;
  layout: {
    mode: "classic-letter" | "modern-letter";
    showSignatureLine: boolean;
  };
  theme: ThemeConfig;
  visibleSections: Array<keyof CoverLetterData>;
};

export type ResumeBuilderDocument = {
  id: string;
  title: string;
  templateKey: string;
  templateFamily: ResumeTemplateFamily;
  templateTier: TemplateTier;
  status: "DRAFT" | "READY" | "ARCHIVED";
  photoEnabled: boolean;
  sectionOrder: string[];
  hiddenSections: string[];
  draftData: ResumeData;
  updatedAt: string;
};

export type CoverLetterBuilderDocument = {
  id: string;
  title: string;
  templateKey: string;
  templateFamily: CoverLetterTemplateFamily;
  templateTier: TemplateTier;
  status: "DRAFT" | "READY" | "ARCHIVED";
  draftData: CoverLetterData;
  updatedAt: string;
};

export type BuilderPlanFeatures = {
  canUseAiWriting: boolean;
  canUsePremiumTemplates: boolean;
  canExportWithoutBranding: boolean;
};

export type BuilderPlanSnapshot = {
  tier: SubscriptionTier;
  label: string;
  features: BuilderPlanFeatures;
};
