import type { CoverLetterData, ResumeData } from "@/types/documents";

function createId(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

export function createDefaultResumeData(): ResumeData {
  return {
    basics: {
      fullName: "",
      professionalTitle: "",
      email: "",
      phone: "",
      location: "",
      website: "",
      linkedIn: "",
      photoUrl: ""
    },
    summary: "",
    experience: [
      {
        id: createId("exp"),
        role: "",
        company: "",
        location: "",
        startDate: "",
        endDate: "",
        bullets: [""]
      }
    ],
    education: [
      {
        id: createId("edu"),
        degree: "",
        school: "",
        location: "",
        startDate: "",
        endDate: "",
        details: ""
      }
    ],
    skills: [],
    projects: [],
    certifications: [],
    links: []
  };
}

export function createDefaultCoverLetterData(): CoverLetterData {
  return {
    jobTitle: "",
    company: "",
    hiringManager: "",
    intro: "",
    body: "",
    closing: ""
  };
}

export function normalizeStringList(input: string) {
  return input
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);
}
