import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock auth so tests can pass session validation
vi.mock("@/lib/auth", () => ({
  validateSession: vi.fn(async (id: string) => id === "test-session-id" ? { id, username: "admin", createdAt: Date.now(), expiresAt: Date.now() + 3600000 } : null),
  isRateLimited: vi.fn(async () => false),
  authenticate: vi.fn(),
  logout: vi.fn(),
  resetAuthStore: vi.fn(),
}));

// Mock db-donations so tests don't touch a real PostgreSQL DB
vi.mock("@/lib/db-donations", () => {
  let donations: Array<{ id: number; amount: number; source: string; anonymous: boolean; donor_name: string | null; created_at: string; updated_by: string | null }> = [];
  let nextId = 1;
  let adjustment = 0;
  let progress = 0;

  return {
    getAllDonations: vi.fn(async () => donations),
    addDonation: vi.fn(async (amount: number, source: string, anonymous: boolean, donorName: string | null) => {
      const id = nextId++;
      donations.push({ id, amount, source, anonymous, donor_name: donorName, created_at: new Date().toISOString(), updated_by: null });
      return id;
    }),
    getDonationTotals: vi.fn(async () => {
      const manual = donations.filter(d => d.source === "manual").reduce((s, d) => s + d.amount, 0);
      const stripe = donations.filter(d => d.source === "stripe").reduce((s, d) => s + d.amount, 0);
      return { manual, stripe, adjustment, total: manual + stripe + adjustment };
    }),
    updateDonationAdjustment: vi.fn(async (amount: number) => { adjustment = amount; }),
    getDonationGoal: vi.fn(async () => 60000),
    getDonationProgress: vi.fn(async () => progress),
    updateDonationProgress: vi.fn(async (p: number) => { progress = p; }),
    __reset: () => { donations = []; nextId = 1; adjustment = 0; progress = 0; },
  };
});

import { GET, POST } from "./route";
import { NextRequest } from "next/server";
import * as dbDonations from "@/lib/db-donations";

function resetMock() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (dbDonations as any).__reset();
}

describe("GET /api/donations", () => {
  beforeEach(() => resetMock());

  it("returns donation data structure", async () => {
    const res = await GET();
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data).toHaveProperty("total");
    expect(data).toHaveProperty("donations");
    expect(data).toHaveProperty("settings");
    expect(data.donations).toHaveLength(0);
  });

  it("reflects added donations in totals", async () => {
    // Add a donation via POST first
    const req = new NextRequest("http://localhost:3000/api/donations", {
      method: "POST",
      body: JSON.stringify({ amount: 1000, source: "manual", anonymous: false }),
      headers: { "Content-Type": "application/json", Cookie: "session=test-session-id" },
    });
    await POST(req);

    const res = await GET();
    const data = await res.json();
    expect(data.total.manual).toBe(1000);
    expect(data.donations).toHaveLength(1);
  });
});

describe("POST /api/donations", () => {
  beforeEach(() => resetMock());

  it("creates a donation and returns 201", async () => {
    const req = new NextRequest("http://localhost:3000/api/donations", {
      method: "POST",
      body: JSON.stringify({ amount: 500, source: "manual", anonymous: false }),
      headers: { "Content-Type": "application/json", Cookie: "session=test-session-id" },
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(201);
    expect(data.donation.amount).toBe(500);
  });

  it("returns 400 for missing amount", async () => {
    const req = new NextRequest("http://localhost:3000/api/donations", {
      method: "POST",
      body: JSON.stringify({ source: "manual" }),
      headers: { "Content-Type": "application/json", Cookie: "session=test-session-id" },
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("returns 400 for zero amount", async () => {
    const req = new NextRequest("http://localhost:3000/api/donations", {
      method: "POST",
      body: JSON.stringify({ amount: 0, source: "manual" }),
      headers: { "Content-Type": "application/json", Cookie: "session=test-session-id" },
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("defaults source to manual when not provided", async () => {
    const req = new NextRequest("http://localhost:3000/api/donations", {
      method: "POST",
      body: JSON.stringify({ amount: 250, anonymous: true }),
      headers: { "Content-Type": "application/json", Cookie: "session=test-session-id" },
    });

    const res = await POST(req);
    const data = await res.json();
    expect(res.status).toBe(201);
    expect(data.donation.source).toBe("manual");
  });
});
