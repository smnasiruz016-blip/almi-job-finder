import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { log } from "@/lib/logger";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { getLatestParsedResume } from "@/server/services/resume-service";
import { getEmployerInventoryOverview } from "@/server/services/company-vacancies";
import { getSearchUsageForUser } from "@/server/services/usage";

export default async function DashboardPage() {
  const user = await requireUser();
  let resume = null;
  let savedJobs: Awaited<ReturnType<typeof prisma.savedJob.findMany>> = [];
  let savedSearches: Awaited<ReturnType<typeof prisma.savedSearch.findMany>> = [];
  let history: Awaited<ReturnType<typeof prisma.jobSearch.findMany>> = [];
  let employerInventory = await getEmployerInventoryOverview();
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
