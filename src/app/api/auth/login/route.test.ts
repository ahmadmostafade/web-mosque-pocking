import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "./route";
import { resetAuthStore } from "@/lib/auth";

// Mock db-admin so auth doesn't need a real DB with seeded user
vi.mock("@/lib/db-admin", () => ({
  getAdminUser: vi.fn((username: string) => {
    if (username === "admin") {
      // bcrypt hash of "moschee2026!"
      return {
        id: 1,
        username: "admin",
        // pre-computed hash for "moschee2026!"
        password_hash: "$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/HS.iK8i",
        created_at: "2026-01-01",
        updated_at: "2026-01-01",
      };
    }
    return null;
  }),
}));

// Mock bcrypt to avoid slow hashing in tests
vi.mock("bcryptjs", () => ({
  default: {
    compare: vi.fn(async (plain: string, _hash: string) => plain === "moschee2026!"),
    hash: vi.fn(async (plain: string) => `hashed:${plain}`),
  },
  compare: vi.fn(async (plain: string, _hash: string) => plain === "moschee2026!"),
  hash: vi.fn(async (plain: string) => `hashed:${plain}`),
}));

function jsonRequest(body: unknown) {
  return new Request("http://localhost/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("POST /api/auth/login", () => {
  beforeEach(() => resetAuthStore());

  it("returns success with valid credentials", async () => {
    const res = await POST(jsonRequest({ username: "admin", password: "moschee2026!" }) as never);
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.username).toBe("admin");
  });

  it("returns 401 for invalid credentials", async () => {
    const res = await POST(jsonRequest({ username: "admin", password: "wrong" }) as never);
    expect(res.status).toBe(401);
  });

  it("returns 400 for missing fields", async () => {
    const res = await POST(jsonRequest({ username: "admin" }) as never);
    expect(res.status).toBe(400);
  });

  it("sets session cookie on success", async () => {
    const res = await POST(jsonRequest({ username: "admin", password: "moschee2026!" }) as never);
    expect(res.status).toBe(200);
    const setCookie = res.headers.get("set-cookie");
    expect(setCookie).toContain("session=");
  });
});
