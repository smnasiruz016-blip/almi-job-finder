import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { COUNTRY_OPTIONS } from "@/lib/location-data";
import { log } from "@/lib/logger";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { getLatestParsedResume } from "@/server/services/resume-service";
import { getEmployerInventoryOverview } from "@/server/services/company-vacancies";
import { executeJobSearch } from "@/server/services/job-search";
import { getSearchUsageForUser } from "@/server/services/usage";
import type { RankedJob } from "@/types";

async function getDetectedCountry() {
  const requestHeaders = await headers();
  const countryCode = requestHeaders.get("x-vercel-ip-country")?.trim().toUpperCase();

  if (!countryCode) {
    return "Worldwide";
  }

  try {
    const displayName = new Intl.DisplayNames(["en"], { type: "region" }).of(countryCode);
    return displayName && COUNTRY_OPTIONS.includes(displayName) ? displayName : "Worldwide";
  } catch {
    return "Worldwide";
  }
}

export default async function DashboardPage() {
  const user = await requireUser();
  const detectedCountry = await getDetectedCountry();
  let resume = null;
  let savedJobs: Awaited<ReturnType<typeof prisma.savedJob.findMany>> = [];
  let savedSearches: Awaited<ReturnType<typeof prisma.savedSearch.findMany>> = [];
  let history: Awaited<ReturnType<typeof prisma.jobSearch.findMany>> = [];
  let employerInventory = await getEmployerInventoryOverview();
  let initialResults: RankedJob[] = [];
  const usage = await getSearchUsageForUser(user.id);

  try {
    [resume, savedJobs, savedSearches, history, employerInventory] = await Promise.all([
      getLatestParsedResume(user.id),
      prisma.savedJob.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
        take: 5
      }),
      prisma.savedSearch.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
        take: 5
      }),
      prisma.jobSearch.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
        take: 5
      }),
      getEmployerInventoryOverview()
    ]);

    try {
      const seededTitle = history[0]?.desiredTitle || resume?.preferredRoles?.[0] || "";
      let initialSearch = await executeJobSearch(
        {
          desiredTitle: seededTitle,
          country: detectedCountry
        },
        resume
      );

      if (initialSearch.results.length === 0 && detectedCountry !== "Worldwide") {
        initialSearch = await executeJobSearch(
          {
            desiredTitle: seededTitle,
            country: "Worldwide"
          },
          resume
        );
      }

      initialResults = initialSearch.results.slice(0, 12);
    } catch (error) {
      log("warn", "Dashboard initial job preload failed", {
        userId: user.id,
        country: detectedCountry,
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  } catch (error) {
    log("error", "Dashboard data fallback activated", {
      userId: user.id,
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }

  return (
    <DashboardShell
      user={user}
      resume={resume}
      usage={usage}
      employerInventory={employerInventory}
      initialResults={initialResults}
      initialSavedJobs={savedJobs}
      initialSavedSearches={savedSearches.map((search) => ({
        id: search.id,
        name: search.name,
        alertsEnabled: search.alertsEnabled,
        alertFrequency: search.alertFrequency,
        lastAlertedAt: search.lastAlertedAt?.toISOString() ?? null
      }))}
      initialHistory={history.map((entry) => ({
        id: entry.id,
        createdAt: entry.createdAt.toISOString(),
        resultsCount: Array.isArray(entry.latestResults) ? entry.latestResults.length : 0,
        desiredTitle: entry.desiredTitle,
        keyword: entry.keyword ?? "",
        country: entry.country,
        snapshot: {
          desiredTitle: entry.desiredTitle,
          keyword: entry.keyword ?? null,
          company: entry.company ?? null,
          country: entry.country,
          state: entry.state ?? null,
          city: entry.city ?? null,
          remoteMode: entry.remoteMode ?? null,
          employmentType: entry.employmentType ?? null,
          postedWithinDays: entry.postedWithinDays ?? null,
          salaryMin: entry.salaryMin ?? null,
          salaryMax: entry.salaryMax ?? null
        }
      }))}
    />
  );
}
