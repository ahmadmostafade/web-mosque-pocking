import { describe, it, expect, beforeEach } from "vitest";
import {
  getDonations,
  addDonation,
  calculateTotalBySource,
  updateManualAdjustment,
  resetStore,
  getDonationSettings,
} from "./donation-store";

describe("donation-store", () => {
  beforeEach(() => {
    resetStore();
  });

  it("starts with empty donations after reset", () => {
    expect(getDonations()).toHaveLength(0);
  });

  it("adds a manual donation", () => {
    const donation = addDonation({
      amount: 100,
      source: "manual",
      date: "2026-02-15",
      anonymous: false,
      donorName: "Test",
    });

    expect(donation.id).toBeTruthy();
    expect(getDonations()).toHaveLength(1);
    expect(getDonations()[0].amount).toBe(100);
  });

  it("calculates totals by source", () => {
    addDonation({ amount: 500, source: "manual", date: "2026-01-01", anonymous: false });
    addDonation({ amount: 300, source: "stripe", date: "2026-01-02", anonymous: true });
    addDonation({ amount: 200, source: "manual", date: "2026-01-03", anonymous: false });

    const totals = calculateTotalBySource();
    expect(totals.manual).toBe(700);
    expect(totals.stripe).toBe(300);
    expect(totals.total).toBe(1000);
  });

  it("includes manual adjustment in total", () => {
    addDonation({ amount: 500, source: "manual", date: "2026-01-01", anonymous: false });
    updateManualAdjustment(100);

    const totals = calculateTotalBySource();
    expect(totals.adjustment).toBe(100);
    expect(totals.total).toBe(600);
  });

  it("updates lastUpdated on donation add", () => {
    const before = getDonationSettings().lastUpdated;
    addDonation({ amount: 50, source: "manual", date: "2026-02-15", anonymous: true });
    const after = getDonationSettings().lastUpdated;
    expect(new Date(after).getTime()).toBeGreaterThanOrEqual(new Date(before).getTime());
  });
});
