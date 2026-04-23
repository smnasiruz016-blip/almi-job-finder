import { beforeEach, describe, expect, it, vi } from "vitest";
import type { JobSearchInput } from "@/types";

const mocks = vi.hoisted(() => ({
  fetchFromAdapters: vi.fn(),
  rankJobs: vi.fn(),
  prisma: {
    jobSearch: {
      create: vi.fn()
    },
    searchHistory: {
      create: vi.fn()
    },
    jobResultCache: {
      upsert: vi.fn()
    }
  }
}));

vi.mock("@/server/adapters/provider-registry", () => ({
  fetchFromAdapters: mocks.fetchFromAdapters
}));

vi.mock("@/server/services/ranking", () => ({
  rankJobs: mocks.rankJobs
}));

vi.mock("@/lib/prisma", () => ({
  prisma: mocks.prisma
}));

describe("runJobSearch", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("still returns results when search persistence fails", async () => {
    const input: JobSearchInput = {
      desiredTitle: "Sales",
      country: "Pakistan",
      state: "Punjab",
      city: "Lahore"
    };

    const rankedResults = [
      {
        externalJobId: "job_1",
        source: "Remotive",
        sourceType: "live" as const,
        title: "Sales Manager",
        company: "Example Co",
        location: "Lahore, Punjab, Pakistan",
        descriptionSnippet: "Lead regional sales operations.",
        applyUrl: "https://example.com/jobs/1",
        keywords: ["sales", "lahore"],
        matchScore: 88,
        matchReasons: ["Strong title match"],
        missingKeywords: []
      }
    ];

    mocks.fetchFromAdapters.mockResolvedValue({
      jobs: rankedResults,
      usedFallback: false,
      sources: ["Remotive"],
      providerStatuses: [
        {
          source: "Remotive",
          sourceType: "live",
          status: "success",
          results: 1
        }
      ]
    });
    mocks.rankJobs.mockReturnValue(rankedResults);
    mocks.prisma.jobSearch.create.mockRejectedValue(new Error("DB temporarily unavailable"));

    const { runJobSearch } = await import("@/server/services/job-search");
    const result = await runJobSearch("user_1", input, null);

    expect(result.searchId).toBeNull();
    expect(result.results).toEqual(rankedResults);
    expect(result.meta).toEqual(
      expect.objectContaining({
        usedFallback: false,
        sources: ["Remotive"]
      })
    );
    expect(mocks.prisma.searchHistory.create).not.toHaveBeenCalled();
  });
});
