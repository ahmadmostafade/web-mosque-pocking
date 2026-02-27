import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock db module so auth doesn't need a real PostgreSQL connection
vi.mock("./db", () => ({
  default: {
    query: vi.fn(),
  },
  ensureInitialized: vi.fn(async () => { }),
}));

// Mock db-admin so auth doesn't need a real DB with seeded user
vi.mock("./db-admin", () => ({
  getAdminUser: vi.fn(async (username: string) => {
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

import pool from "./db";

import {
  authenticate,
  validateSession,
  logout,
  isRateLimited,
  resetAuthStore,
} from "./auth";

// Helper to mock pool.query responses for session/rate-limit operations
function mockPoolQuery() {
  const sessions = new Map<string, { id: string; username: string; created_at: Date; expires_at: Date }>();
  const attempts = new Map<string, { count: number; last_attempt: Date }>();

  vi.mocked(pool.query).mockImplementation(async (text: string, params?: unknown[]) => {
    const query = typeof text === "string" ? text : "";
    const values = params || [];

    // Sessions: INSERT
    if (query.includes("INSERT INTO sessions")) {
      sessions.set(values[0] as string, {
        id: values[0] as string,
        username: values[1] as string,
        created_at: values[2] as Date,
        expires_at: values[3] as Date,
      });
      return { rows: [], rowCount: 1 } as never;
    }

    // Sessions: SELECT
    if (query.includes("SELECT * FROM sessions")) {
      const s = sessions.get(values[0] as string);
      return { rows: s ? [s] : [], rowCount: s ? 1 : 0 } as never;
    }

    // Sessions: DELETE by id
    if (query.includes("DELETE FROM sessions WHERE id")) {
      const had = sessions.has(values[0] as string);
      sessions.delete(values[0] as string);
      return { rows: [], rowCount: had ? 1 : 0 } as never;
    }

    // Sessions: DELETE all
    if (query.includes("DELETE FROM sessions")) {
      sessions.clear();
      return { rows: [], rowCount: 0 } as never;
    }

    // Login attempts: SELECT
    if (query.includes("SELECT count, last_attempt FROM login_attempts")) {
      const a = attempts.get(values[0] as string);
      return { rows: a ? [a] : [], rowCount: a ? 1 : 0 } as never;
    }

    // Login attempts: INSERT/UPSERT
    if (query.includes("INSERT INTO login_attempts")) {
      const existing = attempts.get(values[0] as string);
      if (existing) {
        existing.count++;
        existing.last_attempt = new Date();
      } else {
        attempts.set(values[0] as string, { count: 1, last_attempt: new Date() });
      }
      return { rows: [], rowCount: 1 } as never;
    }

    // Login attempts: DELETE
    if (query.includes("DELETE FROM login_attempts WHERE ip")) {
      attempts.delete(values[0] as string);
      return { rows: [], rowCount: 0 } as never;
    }

    // Login attempts: DELETE all
    if (query.includes("DELETE FROM login_attempts")) {
      attempts.clear();
      return { rows: [], rowCount: 0 } as never;
    }

    return { rows: [], rowCount: 0 } as never;
  });
}

describe("Auth", () => {
  beforeEach(async () => {
    mockPoolQuery();
    await resetAuthStore();
  });

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
    const valid = await validateSession(session.id);
    expect(valid).not.toBeNull();
    expect(valid!.username).toBe("admin");
  });

  it("rejects invalid session id", async () => {
    expect(await validateSession("fake-id")).toBeNull();
  });

  it("logout invalidates session", async () => {
    const session = (await authenticate("admin", "moschee2026!"))!;
    expect(await logout(session.id)).toBe(true);
    expect(await validateSession(session.id)).toBeNull();
  });

  it("rate limits after 5 attempts", async () => {
    const ip = "1.2.3.4";
    for (let i = 0; i < 5; i++) {
      await authenticate("admin", "wrong", ip);
    }
    expect(await isRateLimited(ip)).toBe(true);
    // Even valid credentials should fail when rate limited
    const session = await authenticate("admin", "moschee2026!", ip);
    expect(session).toBeNull();
  });
});
