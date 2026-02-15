import { describe, it, expect, beforeEach } from "vitest";
import { GET, PUT } from "./route";
import { NextRequest } from "next/server";
import { resetIqamahStore } from "@/lib/iqamah-store";

describe("Iqamah API", () => {
  beforeEach(() => {
    resetIqamahStore();
  });

  it("GET returns current iqamah times", async () => {
    const res = await GET();
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.Fajr).toBe("06:00");
    expect(data.Jummah).toBe("13:45");
  });

  it("PUT updates iqamah times", async () => {
    const req = new NextRequest("http://localhost:3000/api/iqamah", {
      method: "PUT",
      body: JSON.stringify({ Fajr: "05:30", Isha: "21:00" }),
      headers: { "Content-Type": "application/json" },
    });

    const res = await PUT(req);
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.Fajr).toBe("05:30");
    expect(data.Isha).toBe("21:00");
    expect(data.Dhuhr).toBe("13:00"); // unchanged
  });
});
