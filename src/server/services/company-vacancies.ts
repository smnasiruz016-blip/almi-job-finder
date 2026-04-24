import { prisma } from "@/lib/prisma";
import { log } from "@/lib/logger";
import type { EmployerInventoryOverview, HiringCompanyPreview } from "@/types";

const FALLBACK_COMPANY_OVERVIEW: EmployerInventoryOverview = {
  totalHiringCompanies: 0,
  totalOpenVacancies: 0,
  featuredCompanies: [],
  source: "fallback"
};

type FeaturedCompanyRow = {
  id: string;
  name: string;
  slug: string;
  website: string | null;
  country: string;
  city: string | null;
  verified: boolean;
  openRoles: number;
  roleTitles: string[] | null;
};

function toPreview(row: FeaturedCompanyRow): HiringCompanyPreview {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    website: row.website,
    country: row.country,
    city: row.city,
    verified: row.verified,
    openRoles: Number(row.openRoles ?? 0),
    roleTitles: (row.roleTitles ?? []).filter(Boolean).slice(0, 3)
  };
}

export async function getEmployerInventoryOverview(): Promise<EmployerInventoryOverview> {
  try {
    const [{ exists } = { exists: false }] = await prisma.$queryRawUnsafe<Array<{ exists: boolean }>>(
      `SELECT EXISTS (
        SELECT 1
        FROM information_schema.tables
        WHERE table_schema = 'public' AND table_name = 'Company'
      ) AS "exists"`
    );

    if (!exists) {
      return FALLBACK_COMPANY_OVERVIEW;
    }

    const [countRow] = await prisma.$queryRawUnsafe<Array<{ totalHiringCompanies: number; totalOpenVacancies: number }>>(
      `SELECT
        COUNT(DISTINCT c.id)::int AS "totalHiringCompanies",
        COUNT(v.id)::int AS "totalOpenVacancies"
      FROM "Company" c
      LEFT JOIN "Vacancy" v
        ON v."companyId" = c.id
       AND v.status = 'ACTIVE'`
    );

    const featured = await prisma.$queryRawUnsafe<FeaturedCompanyRow[]>(
      `SELECT
        c.id,
        c.name,
        c.slug,
        c.website,
        c.country,
        c.city,
        c.verified,
        COUNT(v.id)::int AS "openRoles",
        COALESCE(ARRAY_REMOVE(ARRAY_AGG(DISTINCT v.title), NULL), ARRAY[]::text[]) AS "roleTitles"
      FROM "Company" c
      LEFT JOIN "Vacancy" v
        ON v."companyId" = c.id
       AND v.status = 'ACTIVE'
      GROUP BY c.id, c.name, c.slug, c.website, c.country, c.city, c.verified
      HAVING COUNT(v.id) > 0
      ORDER BY c.verified DESC, COUNT(v.id) DESC, c.name ASC
      LIMIT 6`
    );

    return {
      totalHiringCompanies: Number(countRow?.totalHiringCompanies ?? 0),
      totalOpenVacancies: Number(countRow?.totalOpenVacancies ?? 0),
      featuredCompanies: featured.map(toPreview),
      source: "database"
    };
  } catch (error) {
    log("warn", "Employer inventory overview fallback activated", {
      error: error instanceof Error ? error.message : "Unknown error"
    });

    return {
      ...FALLBACK_COMPANY_OVERVIEW,
      source: "unavailable"
    };
  }
}
