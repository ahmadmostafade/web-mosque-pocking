import { describe, it, expect, beforeEach } from "vitest";
import { GET } from "./route";
import { resetStore, addDonation } from "@/lib/donation-store";

describe("GET /api/donations", () => {
  beforeEach(() => {
    resetStore();
  });

  it("returns donation progress and totals", async () => {
    addDonation({ amount: 1000, source: "manual", date: "2026-01-01", anonymous: false });

    const res = await GET();
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.progress.currentAmount).toBe(1000);
    expect(data.progress.goalAmount).toBe(60000);
    expect(data.totals.manual).toBe(1000);
    expect(data.totals.stripe).toBe(0);
    expect(data.donations).toHaveLength(1);
  });

  it("returns empty state when no donations", async () => {
    const res = await GET();
    const data = await res.json();

    expect(data.progress.currentAmount).toBe(0);
    expect(data.progress.percentage).toBe(0);
    expect(data.donations).toHaveLength(0);
  });
});
