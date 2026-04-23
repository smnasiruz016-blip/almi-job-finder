import { z } from "zod";

const requiredTrimmed = z.string().trim().min(1);
const optionalTrimmed = z.string().trim().optional().default("");

export const resumeBasicsSchema = z.object({
  fullName: optionalTrimmed,
  professionalTitle: optionalTrimmed,
  email: optionalTrimmed,
  phone: optionalTrimmed,
  location: optionalTrimmed,
  website: optionalTrimmed,
  linkedIn: optionalTrimmed,
  photoUrl: optionalTrimmed
});

export const resumeExperienceItemSchema = z.object({
  id: requiredTrimmed,
  role: optionalTrimmed,
  company: optionalTrimmed,
  location: optionalTrimmed,
  startDate: optionalTrimmed,
  endDate: optionalTrimmed,
  bullets: z.array(z.string().trim()).default([])
});

export const resumeEducationItemSchema = z.object({
  id: requiredTrimmed,
  degree: optionalTrimmed,
  school: optionalTrimmed,
  location: optionalTrimmed,
  startDate: optionalTrimmed,
  endDate: optionalTrimmed,
  details: optionalTrimmed
});

export const resumeProjectItemSchema = z.object({
  id: requiredTrimmed,
  name: optionalTrimmed,
  role: optionalTrimmed,
  link: optionalTrimmed,
  bullets: z.array(z.string().trim()).default([])
});

export const resumeCertificationItemSchema = z.object({
  id: requiredTrimmed,
  name: optionalTrimmed,
  issuer: optionalTrimmed,
  year: optionalTrimmed
});

export const resumeLinkItemSchema = z.object({
  id: requiredTrimmed,
  label: optionalTrimmed,
  url: optionalTrimmed
});

export const resumeDataSchema = z.object({
  basics: resumeBasicsSchema,
  summary: optionalTrimmed,
  experience: z.array(resumeExperienceItemSchema).default([]),
  education: z.array(resumeEducationItemSchema).default([]),
  skills: z.array(z.string().trim()).default([]),
  projects: z.array(resumeProjectItemSchema).default([]),
  certifications: z.array(resumeCertificationItemSchema).default([]),
  links: z.array(resumeLinkItemSchema).default([])
});

export const createResumeSchema = z.object({
  templateKey: z.string().trim().min(1).optional().default("minimal-ats")
});

export const updateResumeSchema = z.object({
  title: z.string().trim().min(1).max(80),
  templateKey: z.string().trim().min(1),
  photoEnabled: z.boolean().default(true),
  accentColor: z.string().trim().optional().nullable(),
  sectionOrder: z.array(z.string()).default([]),
  hiddenSections: z.array(z.string()).default([]),
  draftData: resumeDataSchema
});

export const coverLetterDataSchema = z.object({
  jobTitle: optionalTrimmed,
  company: optionalTrimmed,
  hiringManager: optionalTrimmed,
  intro: optionalTrimmed,
  body: optionalTrimmed,
  closing: optionalTrimmed
});

export const createCoverLetterSchema = z.object({
  templateKey: z.string().trim().min(1).optional().default("classic-professional")
});

export const updateCoverLetterSchema = z.object({
  title: z.string().trim().min(1).max(80),
  templateKey: z.string().trim().min(1),
  draftData: coverLetterDataSchema
});
