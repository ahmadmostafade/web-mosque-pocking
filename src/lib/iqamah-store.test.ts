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

  it("returns default iqamah times", () => {
    const times = getIqamahTimes();
    expect(times.Fajr).toBe("06:00");
    expect(times.Jummah).toBe("13:45");
  });

  it("updates specific iqamah times", () => {
    updateIqamahTimes({ Fajr: "05:45", Isha: "21:00" });
    const times = getIqamahTimes();
    expect(times.Fajr).toBe("05:45");
    expect(times.Isha).toBe("21:00");
    expect(times.Dhuhr).toBe("13:00"); // unchanged
  });

  it("updates lastUpdated on change", () => {
    const before = getIqamahTimes().lastUpdated;
    updateIqamahTimes({ Fajr: "05:30" });
    const after = getIqamahTimes().lastUpdated;
    expect(new Date(after).getTime()).toBeGreaterThanOrEqual(
      new Date(before).getTime()
    );
  });
});
