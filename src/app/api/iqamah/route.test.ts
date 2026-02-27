import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

// Mock auth so tests can pass session validation
vi.mock("@/lib/auth", () => ({
  validateSession: vi.fn(async (id: string) => id === "test-session-id" ? { id, username: "admin", createdAt: Date.now(), expiresAt: Date.now() + 3600000 } : null),
  isRateLimited: vi.fn(async () => false),
  authenticate: vi.fn(),
  logout: vi.fn(),
  resetAuthStore: vi.fn(),
}));

// Mock db-iqamah so tests don't need a real PostgreSQL connection
vi.mock("@/lib/db-iqamah", () => {
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

import { resetIqamahStore } from "@/lib/iqamah-store";
import { GET, PUT } from "./route";

describe("Iqamah API", () => {
  beforeEach(async () => {
    await resetIqamahStore();
  });

  it("GET returns current iqamah times in offset format", async () => {
    const res = await GET();
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.Fajr).toMatch(/\+\d+ min/);
    expect(data.Maghrib).toBe("+5 min");
    expect(data.lastUpdated).toBeTruthy();
  });

  it("GET returns all five prayers", async () => {
    const res = await GET();
    const data = await res.json();
    expect(data.Fajr).toBeTruthy();
    expect(data.Dhuhr).toBeTruthy();
    expect(data.Asr).toBeTruthy();
    expect(data.Maghrib).toBeTruthy();
    expect(data.Isha).toBeTruthy();
  });

  it("PUT returns 401 without session cookie", async () => {
    const req = new NextRequest("http://localhost:3000/api/iqamah", {
      method: "PUT",
      body: JSON.stringify({ Fajr: "+20 min" }),
      headers: { "Content-Type": "application/json" },
    });
    const res = await PUT(req);
    expect(res.status).toBe(401);
  });

  it("PUT updates iqamah times with valid session", async () => {
    const req = new NextRequest("http://localhost:3000/api/iqamah", {
      method: "PUT",
      body: JSON.stringify({ Fajr: "+20 min", Isha: "+12 min" }),
      headers: {
        "Content-Type": "application/json",
        Cookie: "session=test-session-id",
      },
    });

    const res = await PUT(req);
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.Fajr).toBe("+20 min");
    expect(data.Isha).toBe("+12 min");
  });
});
