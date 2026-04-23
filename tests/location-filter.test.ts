import { describe, expect, it } from "vitest";
import { filterJobsBySearchLocation, matchesSearchLocation } from "@/lib/location";
import type { JobSearchInput, NormalizedJob } from "@/types";

const baseSearch: JobSearchInput = {
  desiredTitle: "sales"
};

const jobs: NormalizedJob[] = [
  {
    externalJobId: "lahore-1",
    source: "TestSource",
    sourceType: "live",
    title: "Sales Lead",
    company: "Local Growth Co",
    location: "Lahore, Punjab, Pakistan",
    descriptionSnippet: "Lead the Lahore commercial team.",
    applyUrl: "https://example.com/lahore-1",
    keywords: ["sales"]
  },
  {
    externalJobId: "us-remote-1",
    source: "TestSource",
    sourceType: "live",
    title: "SVP Sales",
    company: "InMarket",
    location: "Remote (US-Only)",
    descriptionSnippet: "US-only remote leadership role.",
    applyUrl: "https://example.com/us-remote-1",
    keywords: ["sales"],
    remoteStatus: "REMOTE"
  },
  {
    externalJobId: "global-1",
    source: "TestSource",
    sourceType: "live",
    title: "Global Sales Director",
    company: "Everywhere Inc",
    location: "Remote, Worldwide",
    descriptionSnippet: "Global remote sales role.",
    applyUrl: "https://example.com/global-1",
    keywords: ["sales"],
    remoteStatus: "REMOTE"
  }
];

describe("location filtering", () => {
  it("keeps only jobs matching specific city, state, and country filters", () => {
    const filtered = filterJobsBySearchLocation(jobs, {
      ...baseSearch,
      country: "Pakistan",
      state: "Punjab",
      city: "Lahore"
    });

    expect(filtered).toHaveLength(1);
    expect(filtered[0]?.location).toBe("Lahore, Punjab, Pakistan");
  });

  it("allows worldwide remote jobs for remote country-wide searches", () => {
    expect(
      matchesSearchLocation("Remote, Worldwide", {
        ...baseSearch,
        country: "Pakistan",
        remoteMode: "REMOTE"
      })
    ).toBe(true);
  });

  it("rejects country-mismatched remote jobs even when the title matches", () => {
    expect(
      matchesSearchLocation("Remote (US-Only)", {
        ...baseSearch,
        country: "Pakistan",
        remoteMode: "REMOTE"
      })
    ).toBe(false);
  });
});
