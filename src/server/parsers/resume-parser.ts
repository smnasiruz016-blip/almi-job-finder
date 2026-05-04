import { KNOWN_SKILLS, ROLE_KEYWORDS, SECTION_HEADERS } from "@/lib/constants";
import { dedupe } from "@/lib/utils";
import type { ParsedResume } from "@/types";

/**
 * International, multi-industry resume parser.
 *
 * Supports:
 *  - Unicode names and content (Icelandic, Arabic, Chinese, accented Latin, etc.)
 *  - International phone formats (+354, +92, +966, +1, etc.)
 *  - Multilingual section headers (Skills/Habilidades/Compétences/STYRKLEIKAR/خبرة, etc.)
 *  - Tech AND non-tech professions (healthcare, hospitality, finance, education, retail...)
 *  - Multi-column PDFs that extract in unusual line order
 *
 * Never throws on valid extracted text. If little is recognized, still returns
 * a usable ParsedResume with rawText so the user gets value from their upload.
 */

const CANONICAL_SKILL_NAMES = new Map(
  KNOWN_SKILLS.map((skill) => [
    skill,
    skill
      .split(" ")
      .map((part) => {
        if (part === "typescript") return "TypeScript";
        if (part === "javascript") return "JavaScript";
        if (part === "next.js") return "Next.js";
        if (part === "node.js") return "Node.js";
        if (part === "postgresql") return "PostgreSQL";
        if (part === "sql") return "SQL";
        if (part === "aws") return "AWS";
        if (part === "graphql") return "GraphQL";
        if (part === "ux") return "UX";
        if (part === "ui") return "UI";
        if (part === "hr") return "HR";
        if (part === "crm") return "CRM";
        if (part === "erp") return "ERP";
        if (part === "seo") return "SEO";
        if (part === "ppc") return "PPC";
        if (part === "b2b") return "B2B";
        if (part === "b2c") return "B2C";
        return part.replace(/\b\p{L}/gu, (c) => c.toUpperCase());
      })
      .join(" ")
  ])
);

// All section header strings as a flat lowercase set, used to reject
// header text from being recognized as a "skill" or "keyword".
const ALL_SECTION_HEADERS_LOWER = new Set(
  Object.values(SECTION_HEADERS)
    .flat()
    .map((s) => s.toLowerCase())
);

function extractFirstMatch(pattern: RegExp, input: string): string | undefined {
  return input.match(pattern)?.[0];
}

/**
 * Word-boundary aware keyword matching. Uses Unicode-aware boundaries so
 * "powerpoint" doesn't falsely match "erp" inside it.
 */
function collectKeywordMatches(input: string, terms: string[]): string[] {
  const normalized = input.toLowerCase();

  return dedupe(
    terms
      .filter((term) => {
        const escaped = term.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        // Use Unicode-aware "boundary" - non-letter on either side (or string edge)
        const pattern = new RegExp(`(^|[^\\p{L}\\p{N}])${escaped}($|[^\\p{L}\\p{N}])`, "u");
        return pattern.test(normalized);
      })
      .map(
        (term) =>
          CANONICAL_SKILL_NAMES.get(term.toLowerCase()) ??
          term.replace(/\b\p{L}/gu, (c) => c.toUpperCase())
      )
  );
}

/**
 * Junk filter: drops lines that are purely separators, bullet markers,
 * dot-rating glyphs, section headers, or obvious non-keywords.
 */
function isJunkLine(value: string): boolean {
  if (value.length < 2 || value.length > 60) return true;

  // Pure separators / underscores / dashes
  if (/^[\s_\-–—=*]+$/.test(value)) return true;

  // Pure bullet/rating glyphs (●○•·◦▪▫)
  if (/^[\s●○•·◦▪▫⬤◯]+$/u.test(value)) return true;

  // Mostly punctuation / no letters at all
  if (!/\p{L}/u.test(value)) return true;

  // Contains URL or email
  if (/[@]|https?:\/\//.test(value)) return true;

  // Is itself a section header (don't include "STYRKLEIKAR" as a skill)
  if (ALL_SECTION_HEADERS_LOWER.has(value.toLowerCase().trim())) return true;

  // Too many words to be a single keyword
  if (value.split(/\s+/).length > 6) return true;

  return false;
}

/**
 * Finds a section in the resume by trying multiple language variants of
 * the section name, then collects keywords from the following ~260 chars.
 */
function collectSectionKeywords(input: string, sectionVariants: string[]): string[] {
  for (const variant of sectionVariants) {
    const escaped = variant.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const pattern = new RegExp(`${escaped}:?([\\s\\S]{0,260})`, "i");
    const section = input.match(pattern)?.[1];

    if (!section) continue;

    const keywords = dedupe(
      section
        .split(/[\n,|•·●○◯⬤▪▫]/u)
        .map((value) => value.trim())
        // Strip leading bullets/dots/numbers/dashes
        .map((value) => value.replace(/^[\s\d.)\-–—•·●○◯⬤▪▫]+/u, "").trim())
        // Strip trailing bullets/separators
        .map((value) => value.replace(/[\s•·●○◯⬤▪▫_\-–—]+$/u, "").trim())
        .filter((value) => !isJunkLine(value))
        .map((value) => value.replace(/\b\p{L}/gu, (char) => char.toUpperCase()))
    ).slice(0, 12);

    if (keywords.length > 0) return keywords;
  }

  return [];
}

/**
 * Best-effort name extraction. Looks at ALL non-rejected lines for
 * something that looks like a person's name in any script.
 *
 * We don't restrict to "first N lines" because multi-column PDFs often
 * extract the name in the middle of the text stream.
 *
 * Heuristic: 2-4 capitalized Unicode words, no digits, no @, no URL,
 * not a section header, not a sentence (no lowercase verbs in middle).
 */
function extractName(lines: string[]): string | undefined {
  // Multi-word name: 2-4 words, each starting with uppercase letter, Unicode-aware
  const multiWordPattern = /^[\p{Lu}][\p{L}\p{M}'.-]+(?:\s+[\p{Lu}][\p{L}\p{M}'.-]+){1,3}$/u;

  // First pass: look for multi-word capitalized name anywhere in the document
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.length < 4 || trimmed.length > 60) continue;
    if (trimmed.includes("@")) continue;
    if (/\d/.test(trimmed)) continue;
    if (/https?:\/\//.test(trimmed)) continue;
    if (ALL_SECTION_HEADERS_LOWER.has(trimmed.toLowerCase())) continue;
    if (!multiWordPattern.test(trimmed)) continue;

    // Reject obvious non-names: lines with common stop-words anywhere
    const stopWords = /\b(the|and|with|for|of|in|at|to|from|by|street|road|ave|avenue|boulevard|gate)\b/i;
    if (stopWords.test(trimmed)) continue;

    return trimmed;
  }

  // Second pass: single capitalized word in the very top of the document
  // (some resumes have just "AHMED" or similar as a name header)
  for (const line of lines.slice(0, 5)) {
    const trimmed = line.trim();
    if (trimmed.length < 3 || trimmed.length > 30) continue;
    if (trimmed.includes("@")) continue;
    if (/\d/.test(trimmed)) continue;
    if (ALL_SECTION_HEADERS_LOWER.has(trimmed.toLowerCase())) continue;
    if (!/^[\p{Lu}][\p{L}\p{M}'.-]+$/u.test(trimmed)) continue;
    return trimmed;
  }

  return undefined;
}

/**
 * Extracts an international phone number. Matches:
 *  - +354 786-2547 (Iceland)
 *  - +92 300 1234567 (Pakistan)
 *  - +1 (415) 555-1234 (US)
 *  - 07712 345678 (UK national)
 *  - and most other reasonable international formats
 */
function extractPhone(input: string): string | undefined {
  // Try international format first (with +)
  const intlPattern = /\+\d{1,4}[\s.\-]?\(?\d{1,4}\)?[\s.\-]?\d{1,5}[\s.\-]?\d{1,5}[\s.\-]?\d{0,5}/;
  const intlMatch = input.match(intlPattern)?.[0];
  if (intlMatch) {
    const digits = intlMatch.replace(/\D/g, "");
    if (digits.length >= 7 && digits.length <= 15) return intlMatch.trim();
  }

  // Fallback: national format (7+ consecutive digit-ish chars)
  const nationalPattern = /(?:\(?\d{2,5}\)?[\s.\-]?){2,5}\d{2,5}/;
  const nationalMatch = input.match(nationalPattern)?.[0];
  if (nationalMatch) {
    const digits = nationalMatch.replace(/\D/g, "");
    if (digits.length >= 7 && digits.length <= 15) return nationalMatch.trim();
  }

  return undefined;
}

export function parseResumeText(rawText: string): ParsedResume {
  const cleaned = rawText.replace(/\r/g, "").trim();
  const lines = cleaned
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  // Email regex - works for any TLD
  const email = extractFirstMatch(
    /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,24}/i,
    cleaned
  );

  const phone = extractPhone(cleaned);
  const name = extractName(lines);

  const skills = dedupe([
    ...collectKeywordMatches(cleaned, KNOWN_SKILLS),
    ...collectSectionKeywords(cleaned, SECTION_HEADERS.skills)
  ]).slice(0, 25);

  const experienceKeywords = dedupe([
    ...collectSectionKeywords(cleaned, SECTION_HEADERS.experience),
    ...collectKeywordMatches(cleaned, [
      "leadership",
      "analytics",
      "stakeholder management",
      "experimentation",
      "roadmap",
      "design system",
      "accessibility",
      "performance",
      "api integration",
      "customer service",
      "team management",
      "project management",
      "training",
      "sales",
      "negotiation",
      "operations",
      "logistics",
      "compliance",
      "research"
    ])
  ]).slice(0, 25);

  const educationKeywords = dedupe([
    ...collectSectionKeywords(cleaned, SECTION_HEADERS.education),
    ...collectKeywordMatches(cleaned, [
      "bachelor",
      "master",
      "phd",
      "doctorate",
      "diploma",
      "certificate",
      "computer science",
      "bootcamp",
      "mba",
      "certification",
      "engineering",
      "business administration",
      "marketing",
      "finance",
      "nursing",
      "medicine",
      "law",
      "education",
      "psychology"
    ])
  ]).slice(0, 15);

  const preferredRoles = collectKeywordMatches(cleaned, ROLE_KEYWORDS).slice(0, 10);

  return {
    name,
    email,
    phone,
    skills,
    experienceKeywords,
    educationKeywords,
    preferredRoles,
    rawText: cleaned
  };
}
