import type { CoverLetterTemplateConfig, ResumeTemplateConfig, TemplateKind } from "@/types/documents";
import resumeAcademicClean from "@/config/templates/resume-academic-clean.json";
import resumeBoldStartup from "@/config/templates/resume-bold-startup.json";
import resumeCompactOnePage from "@/config/templates/resume-compact-one-page.json";
import resumeCreativePortfolio from "@/config/templates/resume-creative-portfolio.json";
import resumeMinimalAts from "@/config/templates/resume-minimal-ats.json";
import resumeModernProfessional from "@/config/templates/resume-modern-professional.json";
import coverLetterBoldContemporary from "@/config/templates/cover-letter-bold-contemporary.json";
import coverLetterClassicProfessional from "@/config/templates/cover-letter-classic-professional.json";
import coverLetterMinimalAts from "@/config/templates/cover-letter-minimal-ats.json";
import coverLetterModernClean from "@/config/templates/cover-letter-modern-clean.json";

const resumeTemplates = [
  resumeMinimalAts,
  resumeModernProfessional,
  resumeBoldStartup,
  resumeCreativePortfolio,
  resumeCompactOnePage,
  resumeAcademicClean
] as ResumeTemplateConfig[];

const coverLetterTemplates = [
  coverLetterClassicProfessional,
  coverLetterModernClean,
  coverLetterMinimalAts,
  coverLetterBoldContemporary
] as CoverLetterTemplateConfig[];

export function getResumeTemplates() {
  return resumeTemplates;
}

export function getResumeTemplateByKey(key: string) {
  return resumeTemplates.find((template) => template.metadata.key === key) ?? resumeTemplates[0];
}

export function getCoverLetterTemplates() {
  return coverLetterTemplates;
}

export function getCoverLetterTemplateByKey(key: string) {
  return coverLetterTemplates.find((template) => template.metadata.key === key) ?? coverLetterTemplates[0];
}

export function getTemplateCount(kind: TemplateKind) {
  return kind === "resume" ? resumeTemplates.length : coverLetterTemplates.length;
}
