import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET } from "./route";

// Mock the prayer-times module
vi.mock("@/lib/prayer-times", () => ({
  fetchPrayerTimes: vi.fn(),
  getNextPrayer: vi.fn(() => ({ name: "Dhuhr", time: "12:30" })),
}));

import { fetchPrayerTimes } from "@/lib/prayer-times";

const mockTimes = {
  Fajr: "05:30",
  Sunrise: "07:00",
  Dhuhr: "12:30",
  Asr: "15:30",
  Maghrib: "18:00",
  Isha: "19:30",
};

describe("GET /api/prayer-times", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns prayer times when API is available", async () => {
    vi.mocked(fetchPrayerTimes).mockResolvedValue(mockTimes);

    const res = await GET();
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.times).toEqual(mockTimes);
    expect(data.cached).toBe(false);
    expect(data.nextPrayer).toBeTruthy();
  });

  it("returns cached times when API fails after previous success", async () => {
    // First call succeeds (populates cache)
    vi.mocked(fetchPrayerTimes).mockResolvedValue(mockTimes);
    await GET();

    // Second call fails
    vi.mocked(fetchPrayerTimes).mockResolvedValue(null);
    const res = await GET();
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.times).toEqual(mockTimes);
    expect(data.cached).toBe(true);
  });
});
