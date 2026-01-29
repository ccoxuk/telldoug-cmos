import { beforeEach, afterEach, describe, expect, it, vi } from "vitest";
import superjson from "superjson";
import { getDashboardStats } from "../endpoints/dashboard/stats_GET.schema";

const basePayload = {
  counts: {
    jobs: 0,
    projects: 0,
    skills: 0,
    people: 0,
    institutions: 0,
  },
  staleContacts: [],
  productiveInteractionTypes: [],
  topConnectors: [],
  recentActivity: {
    recentInteractions: [],
    upcomingEvents: [],
  },
  goalsProgress: [],
  skillsGrowth: {
    totalSkills: 0,
    skillsAddedLast12Months: 0,
    byProficiency: [],
    recentSkills: [],
  },
  feedbackThemes: {
    totalFeedbackLast90Days: 0,
    byType: [],
    recentFeedback: [],
  },
  contentActivity: {
    totalContent: 0,
    byType: [],
    recentContent: [],
    thisYearCount: 0,
  },
};

describe("getDashboardStats", () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    globalThis.fetch = vi.fn().mockResolvedValue(
      new Response(superjson.stringify(basePayload), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    ) as typeof fetch;
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it("returns counts keys in the stats payload", async () => {
    const result = await getDashboardStats();

    expect(result.counts).toEqual({
      jobs: 0,
      projects: 0,
      skills: 0,
      people: 0,
      institutions: 0,
    });
  });
});
