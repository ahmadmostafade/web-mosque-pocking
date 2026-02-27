import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock the db-donations module so tests don't touch a real PostgreSQL DB
vi.mock("./db-donations", () => {
  let donations: Array<{ id: number; amount: number; source: string; anonymous: boolean; donor_name: string | null; created_at: string; updated_by: string | null }> = [];
  let nextId = 1;
  let adjustment = 0;

  return {
    getAllDonations: vi.fn(async () => donations),
    addDonation: vi.fn(async (amount: number, source: string, anonymous: boolean, donorName: string | null) => {
      const id = nextId++;
      donations.push({ id, amount, source, anonymous, donor_name: donorName, created_at: new Date().toISOString(), updated_by: null });
      return id;
    }),
    getDonationTotals: vi.fn(async () => {
      const manual = donations.filter(d => d.source === "manual").reduce((s, d) => s + d.amount, 0);
      const stripe = donations.filter(d => d.source === "stripe").reduce((s, d) => s + d.amount, 0);
      return { manual, stripe, adjustment, total: manual + stripe + adjustment };
    }),
    updateDonationAdjustment: vi.fn(async (amount: number) => { adjustment = amount; }),
    getDonationGoal: vi.fn(async () => 60000),
    getDonationProgress: vi.fn(async () => 0),
    updateDonationProgress: vi.fn(async () => { }),
    __reset: () => { donations = []; nextId = 1; adjustment = 0; },
  };
});

import {
  getDonations,
  addDonation,
  calculateTotalBySource,
  updateManualAdjustment,
  getDonationSettings,
} from "./donation-store";
import * as dbDonations from "./db-donations";

function resetMock() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (dbDonations as any).__reset();
}

describe("donation-store", () => {
  beforeEach(() => {
    resetMock();
  });

  it("starts with empty donations after reset", async () => {
    expect(await getDonations()).toHaveLength(0);
  });

  it("adds a manual donation", async () => {
    const donation = await addDonation({
      amount: 100,
      source: "manual",
      date: "2026-02-15",
      anonymous: false,
      donorName: "Test",
    });

    expect(donation.id).toBeTruthy();
    expect(await getDonations()).toHaveLength(1);
    expect((await getDonations())[0].amount).toBe(100);
  });

  it("calculates totals by source", async () => {
    await addDonation({ amount: 500, source: "manual", date: "2026-01-01", anonymous: false });
    await addDonation({ amount: 300, source: "stripe", date: "2026-01-02", anonymous: true });
    await addDonation({ amount: 200, source: "manual", date: "2026-01-03", anonymous: false });

    const totals = await calculateTotalBySource();
    expect(totals.manual).toBe(700);
    expect(totals.stripe).toBe(300);
    expect(totals.total).toBe(1000);
  });

  it("includes manual adjustment in total", async () => {
    await addDonation({ amount: 500, source: "manual", date: "2026-01-01", anonymous: false });
    await updateManualAdjustment(100);

    const totals = await calculateTotalBySource();
    expect(totals.adjustment).toBe(100);
    expect(totals.total).toBe(600);
  });

  it("updates lastUpdated on donation add", async () => {
    const before = (await getDonationSettings()).lastUpdated;
    await addDonation({ amount: 50, source: "manual", date: "2026-02-15", anonymous: true });
    const after = (await getDonationSettings()).lastUpdated;
    expect(new Date(after).getTime()).toBeGreaterThanOrEqual(new Date(before).getTime());
  });

  it("returns donation goal from settings", async () => {
    const settings = await getDonationSettings();
    expect(settings.goalAmount).toBe(60000);
  });
});
