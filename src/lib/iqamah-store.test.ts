import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock db-iqamah so tests don't need a real PostgreSQL connection
vi.mock("./db-iqamah", () => {
  const times: Record<string, { id: number; prayer_name: string; offset_minutes: number; updated_at: string; updated_by: string | null }> = {};
  let nextId = 1;

  return {
    getAllIqamahTimes: vi.fn(async () => Object.values(times).sort((a, b) => a.id - b.id)),
    getIqamahTime: vi.fn(async (name: string) => times[name] || null),
    updateIqamahTime: vi.fn(async (name: string, offset: number, updatedBy: string) => {
      if (times[name]) {
        times[name].offset_minutes = offset;
        times[name].updated_at = new Date().toISOString();
        times[name].updated_by = updatedBy;
        return true;
      }
      return false;
    }),
    upsertIqamahTime: vi.fn(async (name: string, offset: number, updatedBy: string) => {
      if (times[name]) {
        times[name].offset_minutes = offset;
        times[name].updated_at = new Date().toISOString();
        times[name].updated_by = updatedBy;
      } else {
        times[name] = { id: nextId++, prayer_name: name, offset_minutes: offset, updated_at: new Date().toISOString(), updated_by: updatedBy };
      }
    }),
    __reset: () => {
      Object.keys(times).forEach(k => delete times[k]);
      nextId = 1;
    },
  };
});

import {
  getIqamahTimes,
  updateIqamahTimes,
  resetIqamahStore,
} from "./iqamah-store";

describe("iqamah-store", () => {
  beforeEach(async () => {
    await resetIqamahStore();
  });

  it("returns iqamah times in offset format", async () => {
    const times = await getIqamahTimes();
    // After reset, all prayers get offset 15 min (Maghrib gets 5)
    expect(times.Fajr).toMatch(/\+\d+ min/);
    expect(times.Dhuhr).toMatch(/\+\d+ min/);
    expect(times.Maghrib).toBe("+5 min");
    expect(times.lastUpdated).toBeTruthy();
  });

  it("updates specific iqamah times", async () => {
    await updateIqamahTimes({ Fajr: "+20 min", Isha: "+10 min" });
    const times = await getIqamahTimes();
    expect(times.Fajr).toBe("+20 min");
    expect(times.Isha).toBe("+10 min");
  });

  it("parses numeric offset strings correctly", async () => {
    await updateIqamahTimes({ Dhuhr: "+30 min" });
    const times = await getIqamahTimes();
    expect(times.Dhuhr).toBe("+30 min");
  });

  it("updates lastUpdated on change", async () => {
    const before = (await getIqamahTimes()).lastUpdated;
    await updateIqamahTimes({ Fajr: "+25 min" });
    const after = (await getIqamahTimes()).lastUpdated;
    expect(new Date(after).getTime()).toBeGreaterThanOrEqual(
      new Date(before).getTime()
    );
  });

  it("returns all five prayers", async () => {
    const times = await getIqamahTimes();
    expect(times.Fajr).toBeTruthy();
    expect(times.Dhuhr).toBeTruthy();
    expect(times.Asr).toBeTruthy();
    expect(times.Maghrib).toBeTruthy();
    expect(times.Isha).toBeTruthy();
  });
});
