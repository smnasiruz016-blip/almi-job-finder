import sourceDirectorySeed from "@/server/data/job-source-directory.json";
import { getTrustedSourcesForCountry as getStaticTrustedSourcesForCountry } from "@/lib/source-directory";
import { prisma } from "@/lib/prisma";
import { log } from "@/lib/logger";
import type { JobSourceLink } from "@/types";

type JobSourceSeedRow = {
  region: string;
  country: string;
  website: string;
  url: string;
  category: string;
  notes: string;
  sourcePriority: number;
  hasApi: boolean;
  isAggregator: boolean;
  isEmployerBoard: boolean;
  isTrusted: boolean;
  active: boolean;
};

function uniqueByName(items: JobSourceLink[]) {
  const seen = new Set<string>();
  return items.filter((item) => {
    const key = item.name.trim().toLowerCase();
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

function mapRowsToLinks(rows: JobSourceSeedRow[]) {
  return rows.map<JobSourceLink>((row) => ({
    name: row.website,
    url: row.url,
    category: row.category,
    note: row.notes,
    region: row.region,
    sourcePriority: row.sourcePriority,
    hasApi: row.hasApi,
    isAggregator: row.isAggregator,
    isEmployerBoard: row.isEmployerBoard,
    isTrusted: row.isTrusted
  }));
}

function getSeedTrustedSourcesForCountry(country?: string) {
  const normalizedCountry = (country ?? "").trim();
  const rows = sourceDirectorySeed as JobSourceSeedRow[];

  if (!normalizedCountry || normalizedCountry === "Worldwide") {
    return mapRowsToLinks(rows.filter((row) => row.country === "Worldwide" && row.active)).slice(0, 6);
  }

  const countryRows = rows.filter((row) => row.country === normalizedCountry && row.active);
  const globalRows = rows.filter((row) => row.country === "Worldwide" && row.active);

  return uniqueByName([...mapRowsToLinks(countryRows), ...mapRowsToLinks(globalRows)]).slice(0, 6);
}

function mergeTrustedSources(country: string | undefined, primary: JobSourceLink[], fallback: JobSourceLink[]) {
  const normalizedCountry = (country ?? "").trim();

  if (!normalizedCountry || normalizedCountry === "Worldwide") {
    return uniqueByName([...primary, ...fallback]).slice(0, 6);
  }

  const fallbackLocal = fallback.filter((item) => item.region !== "Worldwide");
  const fallbackGlobal = fallback.filter((item) => item.region === "Worldwide" || !item.region);
  const primaryLocal = primary.filter((item) => item.region !== "Worldwide");
  const primaryGlobal = primary.filter((item) => item.region === "Worldwide" || !item.region);

  return uniqueByName([...fallbackLocal, ...primaryLocal, ...primaryGlobal, ...fallbackGlobal]).slice(0, 6);
}

export async function isSourceDirectorySchemaReady() {
  try {
    const [table] = await prisma.$queryRawUnsafe<Array<{ exists: boolean }>>(
      `SELECT EXISTS (
        SELECT 1
        FROM information_schema.tables
        WHERE table_schema = 'public' AND table_name = 'JobSourceDirectory'
      ) AS "exists"`
    );

    return Boolean(table?.exists);
  } catch (error) {
    log("warn", "Source directory readiness check failed", {
      error: error instanceof Error ? error.message : "Unknown error"
    });
    return false;
  }
}

export async function getTrustedSourcesForCountry(country?: string): Promise<JobSourceLink[]> {
  const schemaReady = await isSourceDirectorySchemaReady();
  const staticFallback = getStaticTrustedSourcesForCountry(country);

  if (!schemaReady) {
    return mergeTrustedSources(country, getSeedTrustedSourcesForCountry(country), staticFallback);
  }

  try {
    const normalizedCountry = (country ?? "").trim();
    const targetCountry = !normalizedCountry || normalizedCountry === "Worldwide" ? "Worldwide" : normalizedCountry;

    const rows = await prisma.$queryRawUnsafe<JobSourceSeedRow[]>(
      `SELECT
        region,
        country,
        website,
        url,
        category,
        COALESCE(notes, '') AS notes,
        "sourcePriority" AS "sourcePriority",
        "hasApi" AS "hasApi",
        "isAggregator" AS "isAggregator",
        "isEmployerBoard" AS "isEmployerBoard",
        "isTrusted" AS "isTrusted",
        active
      FROM "JobSourceDirectory"
      WHERE active = true
        AND country IN (${targetCountry === "Worldwide" ? "'Worldwide'" : `'${targetCountry.replace(/'/g, "''")}','Worldwide'`})
      ORDER BY "sourcePriority" ASC, "isTrusted" DESC, website ASC
      LIMIT ${targetCountry === "Worldwide" ? 6 : 12}`
    );

    if (rows.length === 0) {
      return mergeTrustedSources(country, getSeedTrustedSourcesForCountry(country), staticFallback);
    }

    return mergeTrustedSources(
      country,
      rows.map((row) => ({
        name: row.website,
        url: row.url,
        category: row.category,
        note: row.notes ?? "Trusted job source for this market.",
        region: row.region,
        sourcePriority: row.sourcePriority,
        hasApi: row.hasApi,
        isAggregator: row.isAggregator,
        isEmployerBoard: row.isEmployerBoard,
        isTrusted: row.isTrusted
      })),
      staticFallback
    );
  } catch (error) {
    log("warn", "Source directory database lookup failed, using fallback", {
      country,
      error: error instanceof Error ? error.message : "Unknown error"
    });

    const seedResults = getSeedTrustedSourcesForCountry(country);
    return mergeTrustedSources(country, seedResults, staticFallback);
  }
}
