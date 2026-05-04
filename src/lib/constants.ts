export const SESSION_COOKIE = "jobmatch_session";
export const SESSION_MAX_AGE_MS = 1000 * 60 * 60 * 24 * 7;
export const MAX_UPLOAD_SIZE_BYTES = 5 * 1024 * 1024;
export const FREE_DAILY_SEARCH_LIMIT = 25;
export const SUPPORTED_UPLOAD_MIME_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
];

/**
 * Multilingual section header variants for resume parsing.
 * Covers major languages: English, Spanish, French, German, Italian,
 * Portuguese, Arabic, Urdu, Hindi, Chinese, Japanese, Russian, and
 * Nordic languages (Icelandic, Danish, Swedish, Norwegian).
 *
 * The parser tries each variant and uses the first one that matches.
 */
export const SECTION_HEADERS = {
  skills: [
    "Skills",
    "Technical Skills",
    "Core Skills",
    "Key Skills",
    "Strengths",
    "Competencies",
    "Habilidades", // Spanish
    "Compétences", // French
    "Fähigkeiten", // German
    "Kenntnisse", // German alt
    "Competenze", // Italian
    "Habilidades", // Portuguese
    "STYRKLEIKAR", // Icelandic
    "Færdigheder", // Danish
    "Kompetenser", // Swedish
    "Ferdigheter", // Norwegian
    "Навыки", // Russian
    "技能", // Chinese
    "スキル", // Japanese
    "기술", // Korean
    "مهارات", // Arabic
    "مہارتیں", // Urdu
    "कौशल", // Hindi
    "TUNGUMÁL", // Icelandic (languages)
    "Languages",
    "Idiomas"
  ],
  experience: [
    "Experience",
    "Work Experience",
    "Professional Experience",
    "Employment History",
    "Career History",
    "Work History",
    "Experiencia", // Spanish
    "Expérience", // French
    "Erfahrung", // German
    "Berufserfahrung", // German full
    "Esperienza", // Italian
    "Experiência", // Portuguese
    "STARFSREYNSLA", // Icelandic
    "Erhverv", // Danish
    "Arbetslivserfarenhet", // Swedish
    "Arbeidserfaring", // Norwegian
    "Опыт работы", // Russian
    "工作经验", // Chinese
    "職歴", // Japanese
    "경력", // Korean
    "خبرة", // Arabic
    "تجربہ", // Urdu
    "अनुभव" // Hindi
  ],
  education: [
    "Education",
    "Academic Background",
    "Qualifications",
    "Educación", // Spanish
    "Formation", // French
    "Éducation", // French alt
    "Ausbildung", // German
    "Bildung", // German alt
    "Istruzione", // Italian
    "Educação", // Portuguese
    "MENNTUN", // Icelandic
    "Uddannelse", // Danish
    "Utbildning", // Swedish
    "Utdanning", // Norwegian
    "Образование", // Russian
    "教育", // Chinese
    "学歴", // Japanese
    "학력", // Korean
    "تعليم", // Arabic
    "تعلیم", // Urdu
    "शिक्षा" // Hindi
  ]
};

/**
 * KNOWN_SKILLS - massively expanded for international, multi-industry coverage.
 *
 * Originally 20 tech-only items. Now covers tech, design, business, marketing,
 * sales, finance, healthcare, education, hospitality, retail, logistics,
 * languages, and common office tools.
 */
export const KNOWN_SKILLS = [
  // ---- Tech: Languages & runtimes ----
  "typescript",
  "javascript",
  "python",
  "java",
  "c++",
  "c#",
  "php",
  "ruby",
  "go",
  "rust",
  "swift",
  "kotlin",
  "scala",
  "r",

  // ---- Tech: Frontend ----
  "react",
  "next.js",
  "vue",
  "angular",
  "svelte",
  "tailwind",
  "html",
  "css",
  "sass",

  // ---- Tech: Backend ----
  "node.js",
  "express",
  "django",
  "flask",
  "fastapi",
  "spring",
  "laravel",
  "rails",
  ".net",

  // ---- Tech: Data & DB ----
  "sql",
  "postgresql",
  "mysql",
  "mongodb",
  "redis",
  "elasticsearch",
  "snowflake",
  "bigquery",
  "prisma",

  // ---- Tech: Cloud & DevOps ----
  "aws",
  "azure",
  "gcp",
  "google cloud",
  "docker",
  "kubernetes",
  "terraform",
  "jenkins",
  "git",
  "github",
  "gitlab",
  "ci/cd",
  "linux",

  // ---- Tech: AI/ML & Data ----
  "machine learning",
  "deep learning",
  "tensorflow",
  "pytorch",
  "data analysis",
  "data science",
  "tableau",
  "power bi",
  "excel modeling",

  // ---- Design ----
  "figma",
  "sketch",
  "adobe xd",
  "photoshop",
  "illustrator",
  "indesign",
  "after effects",
  "premiere",
  "user research",
  "design systems",
  "product design",
  "ux writing",
  "ux",
  "ui",
  "graphql",
  "wireframing",
  "prototyping",
  "branding",
  "typography",

  // ---- Office tools (universal) ----
  "microsoft word",
  "word",
  "microsoft excel",
  "excel",
  "microsoft powerpoint",
  "powerpoint",
  "microsoft outlook",
  "outlook",
  "google docs",
  "google sheets",
  "google slides",
  "notion",
  "slack",
  "trello",
  "asana",
  "jira",
  "confluence",

  // ---- Business / management ----
  "project management",
  "product management",
  "team leadership",
  "stakeholder management",
  "strategy",
  "operations",
  "agile",
  "scrum",
  "kanban",
  "okrs",
  "kpis",

  // ---- Marketing & sales ----
  "seo",
  "sem",
  "ppc",
  "google ads",
  "facebook ads",
  "social media",
  "content marketing",
  "copywriting",
  "email marketing",
  "crm",
  "salesforce",
  "hubspot",
  "lead generation",
  "b2b",
  "b2c",
  "negotiation",
  "account management",

  // ---- Finance & accounting ----
  "accounting",
  "bookkeeping",
  "financial analysis",
  "financial modeling",
  "budgeting",
  "forecasting",
  "tax",
  "audit",
  "quickbooks",
  "sap",
  "erp",

  // ---- Healthcare ----
  "patient care",
  "nursing",
  "first aid",
  "cpr",
  "phlebotomy",
  "medical records",
  "pharmacy",
  "clinical research",

  // ---- Education ----
  "teaching",
  "curriculum development",
  "lesson planning",
  "classroom management",
  "tutoring",
  "training",
  "e-learning",

  // ---- Hospitality / retail / service ----
  "customer service",
  "customer support",
  "hospitality",
  "food service",
  "barista",
  "bartending",
  "cooking",
  "cashier",
  "inventory management",
  "merchandising",
  "pos systems",
  "housekeeping",

  // ---- Logistics & operations ----
  "supply chain",
  "logistics",
  "warehouse",
  "shipping",
  "procurement",
  "vendor management",
  "quality assurance",
  "quality control",

  // ---- HR ----
  "hr",
  "recruiting",
  "talent acquisition",
  "onboarding",
  "performance management",
  "payroll",

  // ---- Languages (frequently appear as skills) ----
  "english",
  "spanish",
  "french",
  "german",
  "italian",
  "portuguese",
  "arabic",
  "urdu",
  "hindi",
  "mandarin",
  "japanese",
  "korean",
  "russian",
  "icelandic",
  "danish",
  "swedish",
  "norwegian",
  "dutch",

  // ---- Soft skills (commonly listed) ----
  "communication",
  "leadership",
  "teamwork",
  "problem solving",
  "time management",
  "adaptability",
  "critical thinking"
];

/**
 * ROLE_KEYWORDS - expanded from 9 tech-only roles to a global,
 * cross-industry list. Used for inferring "preferredRoles" from CVs.
 */
export const ROLE_KEYWORDS = [
  // ---- Tech / Engineering ----
  "software engineer",
  "software developer",
  "frontend engineer",
  "frontend developer",
  "backend engineer",
  "backend developer",
  "full stack engineer",
  "full stack developer",
  "mobile developer",
  "ios developer",
  "android developer",
  "devops engineer",
  "site reliability engineer",
  "cloud engineer",
  "data engineer",
  "data analyst",
  "data scientist",
  "machine learning engineer",
  "qa engineer",
  "test engineer",
  "security engineer",

  // ---- Product / Design ----
  "product manager",
  "product owner",
  "project manager",
  "program manager",
  "product designer",
  "ux designer",
  "ui designer",
  "graphic designer",
  "visual designer",
  "ux researcher",

  // ---- Business / Operations ----
  "business analyst",
  "operations manager",
  "operations analyst",
  "business development",
  "consultant",
  "general manager",

  // ---- Marketing / Sales ----
  "marketing manager",
  "marketing specialist",
  "digital marketer",
  "content writer",
  "copywriter",
  "social media manager",
  "seo specialist",
  "sales manager",
  "sales representative",
  "account manager",
  "account executive",
  "customer success manager",

  // ---- Finance / Accounting ----
  "accountant",
  "bookkeeper",
  "financial analyst",
  "controller",
  "auditor",
  "tax specialist",
  "investment analyst",

  // ---- HR / Admin ----
  "human resources",
  "hr manager",
  "recruiter",
  "talent acquisition",
  "office manager",
  "administrative assistant",
  "executive assistant",

  // ---- Healthcare ----
  "nurse",
  "doctor",
  "physician",
  "pharmacist",
  "medical assistant",
  "dentist",
  "therapist",
  "caregiver",

  // ---- Education ----
  "teacher",
  "lecturer",
  "professor",
  "tutor",
  "trainer",
  "instructor",

  // ---- Hospitality / Retail / Service ----
  "waiter",
  "waitress",
  "server",
  "bartender",
  "barista",
  "chef",
  "cook",
  "kitchen assistant",
  "cashier",
  "sales associate",
  "store manager",
  "retail manager",
  "receptionist",
  "concierge",
  "housekeeper",
  "hotel manager",
  "restaurant manager",
  "afgreiðsla", // Icelandic - retail/service clerk

  // ---- Logistics / Trades ----
  "driver",
  "delivery driver",
  "warehouse worker",
  "forklift operator",
  "logistics coordinator",
  "supply chain analyst",
  "electrician",
  "plumber",
  "carpenter",
  "mechanic",
  "construction worker",
  "welder",

  // ---- Creative ----
  "writer",
  "editor",
  "journalist",
  "photographer",
  "videographer",
  "translator",
  "interpreter"
];
