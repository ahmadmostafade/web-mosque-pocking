import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock db-admin so auth doesn't need a real DB with seeded user
vi.mock("./db-admin", () => ({
  getAdminUser: vi.fn((username: string) => {
    if (username === "admin") {
      return { id: 1, username: "admin", password_hash: "hashed:moschee2026!", created_at: "", updated_at: "" };
    }
    return null;
  }),
}));

// Mock bcrypt to avoid slow hashing
vi.mock("bcryptjs", () => ({
  default: {
    compare: vi.fn(async (plain: string, hash: string) => hash === `hashed:${plain}`),
    hash: vi.fn(async (plain: string) => `hashed:${plain}`),
  },
  compare: vi.fn(async (plain: string, hash: string) => hash === `hashed:${plain}`),
  hash: vi.fn(async (plain: string) => `hashed:${plain}`),
}));

import {
  authenticate,
  validateSession,
  logout,
  isRateLimited,
  resetAuthStore,
} from "./auth";

describe("Auth", () => {
  beforeEach(() => resetAuthStore());

  it("authenticates with valid credentials", async () => {
    const session = await authenticate("admin", "moschee2026!");
    expect(session).not.toBeNull();
    expect(session!.username).toBe("admin");
  });

  it("rejects invalid credentials", async () => {
    const session = await authenticate("admin", "wrong");
    expect(session).toBeNull();
  });

  it("validates active session", async () => {
    const session = (await authenticate("admin", "moschee2026!"))!;
    const valid = validateSession(session.id);
    expect(valid).not.toBeNull();
    expect(valid!.username).toBe("admin");
  });

  it("rejects invalid session id", () => {
    expect(validateSession("fake-id")).toBeNull();
  });

  it("logout invalidates session", async () => {
    const session = (await authenticate("admin", "moschee2026!"))!;
    expect(logout(session.id)).toBe(true);
    expect(validateSession(session.id)).toBeNull();
  });

  it("rate limits after 5 attempts", async () => {
    const ip = "1.2.3.4";
    for (let i = 0; i < 5; i++) {
      await authenticate("admin", "wrong", ip);
    }
    expect(isRateLimited(ip)).toBe(true);
    // Even valid credentials should fail when rate limited
    const session = await authenticate("admin", "moschee2026!", ip);
    expect(session).toBeNull();
  });
});
