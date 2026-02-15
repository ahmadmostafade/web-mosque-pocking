import { describe, it, expect } from "vitest";
import {
  calculateDonationProgress,
  formatCurrency,
} from "./donations";

describe("calculateDonationProgress", () => {
  it("calculates progress correctly with all sources", () => {
    const result = calculateDonationProgress(10000, 5000, 2000);
    expect(result.currentAmount).toBe(17000);
    expect(result.goalAmount).toBe(60000);
    expect(result.percentage).toBe(28);
    expect(result.remaining).toBe(43000);
  });

  it("caps percentage at 100", () => {
    const result = calculateDonationProgress(50000, 15000, 0);
    expect(result.percentage).toBe(100);
    expect(result.remaining).toBe(0);
  });

  it("handles zero donations", () => {
    const result = calculateDonationProgress(0, 0, 0);
    expect(result.currentAmount).toBe(0);
    expect(result.percentage).toBe(0);
    expect(result.remaining).toBe(60000);
  });

  it("includes lastUpdated timestamp", () => {
    const result = calculateDonationProgress(1000, 0, 0);
    expect(result.lastUpdated).toBeTruthy();
    expect(() => new Date(result.lastUpdated)).not.toThrow();
  });
});

describe("formatCurrency", () => {
  it("formats amount in EUR with German locale", () => {
    const formatted = formatCurrency(1234.56);
    expect(formatted).toContain("1.234,56");
    expect(formatted).toContain("€");
  });

  it("formats zero", () => {
    const formatted = formatCurrency(0);
    expect(formatted).toContain("0,00");
    expect(formatted).toContain("€");
  });
});
