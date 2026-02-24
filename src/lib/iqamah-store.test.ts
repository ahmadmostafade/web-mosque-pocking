import { describe, it, expect, beforeEach } from "vitest";
import {
  getIqamahTimes,
  updateIqamahTimes,
  resetIqamahStore,
} from "./iqamah-store";

describe("iqamah-store", () => {
  beforeEach(() => {
    resetIqamahStore();
  });

  it("returns iqamah times in offset format", () => {
    const times = getIqamahTimes();
    // After reset, all prayers get offset 15 min (Maghrib gets 5)
    expect(times.Fajr).toMatch(/\+\d+ min/);
    expect(times.Dhuhr).toMatch(/\+\d+ min/);
    expect(times.Maghrib).toBe("+5 min");
    expect(times.lastUpdated).toBeTruthy();
  });

  it("updates specific iqamah times", () => {
    updateIqamahTimes({ Fajr: "+20 min", Isha: "+10 min" });
    const times = getIqamahTimes();
    expect(times.Fajr).toBe("+20 min");
    expect(times.Isha).toBe("+10 min");
  });

  it("parses numeric offset strings correctly", () => {
    updateIqamahTimes({ Dhuhr: "+30 min" });
    const times = getIqamahTimes();
    expect(times.Dhuhr).toBe("+30 min");
  });

  it("updates lastUpdated on change", () => {
    const before = getIqamahTimes().lastUpdated;
    updateIqamahTimes({ Fajr: "+25 min" });
    const after = getIqamahTimes().lastUpdated;
    expect(new Date(after).getTime()).toBeGreaterThanOrEqual(
      new Date(before).getTime()
    );
  });

  it("returns all five prayers", () => {
    const times = getIqamahTimes();
    expect(times.Fajr).toBeTruthy();
    expect(times.Dhuhr).toBeTruthy();
    expect(times.Asr).toBeTruthy();
    expect(times.Maghrib).toBeTruthy();
    expect(times.Isha).toBeTruthy();
  });
});
