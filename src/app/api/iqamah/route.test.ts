import { describe, it, expect, beforeEach } from "vitest";
import { GET, PUT } from "./route";
import { NextRequest } from "next/server";
import { resetIqamahStore } from "@/lib/iqamah-store";

describe("Iqamah API", () => {
  beforeEach(() => {
    resetIqamahStore();
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
