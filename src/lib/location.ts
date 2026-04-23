import type { JobSearchInput, NormalizedJob } from "@/types";

const WORLDWIDE_FILTERS = new Set(["", "worldwide", "global", "remote"]);

export function normalizeLocationFilter(value?: string) {
  return (value ?? "").trim().toLowerCase();
}

export function isWorldwideFilter(value?: string) {
  return WORLDWIDE_FILTERS.has(normalizeLocationFilter(value));
}

function normalizeSearchableText(value?: string) {
  return (value ?? "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

export function getLocationFilterParts(input: Pick<JobSearchInput, "country" | "state" | "city">) {
  return [input.city, input.state, input.country]
    .map((value) => normalizeLocationFilter(value))
    .filter((value) => value && !isWorldwideFilter(value));
}

export function matchesSearchLocation(
  location: string,
  input: Pick<JobSearchInput, "country" | "state" | "city" | "remoteMode">,
  descriptionSnippet?: string
) {
  const parts = getLocationFilterParts(input);

  if (!parts.length) {
    return true;
  }

  const haystack = normalizeSearchableText(`${location} ${descriptionSnippet ?? ""}`);
  const matchesAllSpecificParts = parts.every((part) => haystack.includes(part));

  if (matchesAllSpecificParts) {
    return true;
  }

  const isWorldwideRemote = /\b(worldwide|global|anywhere)\b/.test(haystack);
  const searchingForCountryOnly = Boolean(normalizeLocationFilter(input.country)) && !normalizeLocationFilter(input.state) && !normalizeLocationFilter(input.city);

  if (input.remoteMode === "REMOTE" && searchingForCountryOnly && isWorldwideRemote) {
    return true;
  }

  return false;
}

export function filterJobsBySearchLocation<T extends NormalizedJob>(jobs: T[], input: Pick<JobSearchInput, "country" | "state" | "city" | "remoteMode">) {
  return jobs.filter((job) => matchesSearchLocation(job.location, input, job.descriptionSnippet));
}

const ADZUNA_COUNTRY_CODES: Record<string, string> = {
  australia: "au",
  austria: "at",
  belgium: "be",
  brazil: "br",
  canada: "ca",
  france: "fr",
  germany: "de",
  india: "in",
  italy: "it",
  mexico: "mx",
  netherlands: "nl",
  newzealand: "nz",
  poland: "pl",
  singapore: "sg",
  southafrica: "za",
  spain: "es",
  unitedkingdom: "gb",
  uk: "gb",
  greatbritain: "gb",
  unitedstates: "us",
  usa: "us"
};

export function mapCountryToAdzunaCode(country?: string) {
  const key = normalizeLocationFilter(country).replace(/[^a-z]/g, "");
  return ADZUNA_COUNTRY_CODES[key];
}
