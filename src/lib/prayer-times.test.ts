import { describe, it, expect } from "vitest";
import { getNextPrayer, PrayerTimesData } from "./prayer-times";

const mockTimes: PrayerTimesData = {
  Fajr: "05:30",
  Sunrise: "07:00",
  Dhuhr: "12:30",
  Asr: "15:30",
  Maghrib: "18:00",
  Isha: "19:30",
};

describe("getNextPrayer", () => {
  it("returns the next prayer based on current time", () => {
    // Mock a time before Fajr
    const originalDate = global.Date;
    const mockDate = new Date(2026, 1, 15, 4, 0); // 04:00
    vi.setSystemTime(mockDate);

    const result = getNextPrayer(mockTimes);
    expect(result).not.toBeNull();
    expect(result!.name).toBe("Fajr");
    expect(result!.time).toBe("05:30");

    vi.useRealTimers();
  });

  it("returns null when all prayers have passed", () => {
    const mockDate = new Date(2026, 1, 15, 22, 0); // 22:00
    vi.setSystemTime(mockDate);

    const result = getNextPrayer(mockTimes);
    expect(result).toBeNull();

    vi.useRealTimers();
  });

  it("returns Dhuhr when time is between Fajr and Dhuhr", () => {
    const mockDate = new Date(2026, 1, 15, 10, 0); // 10:00
    vi.setSystemTime(mockDate);

    const result = getNextPrayer(mockTimes);
    expect(result).not.toBeNull();
    expect(result!.name).toBe("Dhuhr");

    vi.useRealTimers();
  });
});
