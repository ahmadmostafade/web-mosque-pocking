import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "./route";
import { resetAuthStore } from "@/lib/auth";

// Mock db module so auth doesn't need a real PostgreSQL connection
vi.mock("@/lib/db", () => {
  const sessions = new Map<string, { id: string; username: string; created_at: Date; expires_at: Date }>();
  const attempts = new Map<string, { count: number; last_attempt: Date }>();

  return {
    default: {
      query: vi.fn(async (text: string, params?: unknown[]) => {
        const values = params || [];

        if (text.includes("INSERT INTO sessions")) {
          sessions.set(values[0] as string, {
            id: values[0] as string,
            username: values[1] as string,
            created_at: values[2] as Date,
            expires_at: values[3] as Date,
          });
          return { rows: [], rowCount: 1 };
        }
        if (text.includes("SELECT * FROM sessions")) {
          const s = sessions.get(values[0] as string);
          return { rows: s ? [s] : [], rowCount: s ? 1 : 0 };
        }
        if (text.includes("DELETE FROM sessions WHERE id")) {
          const had = sessions.has(values[0] as string);
          sessions.delete(values[0] as string);
          return { rows: [], rowCount: had ? 1 : 0 };
        }
        if (text.includes("DELETE FROM sessions")) {
          sessions.clear();
          return { rows: [], rowCount: 0 };
        }
        if (text.includes("SELECT count, last_attempt FROM login_attempts")) {
          const a = attempts.get(values[0] as string);
          return { rows: a ? [a] : [], rowCount: a ? 1 : 0 };
        }
        if (text.includes("INSERT INTO login_attempts")) {
          const existing = attempts.get(values[0] as string);
          if (existing) {
            existing.count++;
            existing.last_attempt = new Date();
          } else {
            attempts.set(values[0] as string, { count: 1, last_attempt: new Date() });
          }
          return { rows: [], rowCount: 1 };
        }
        if (text.includes("DELETE FROM login_attempts WHERE ip")) {
          attempts.delete(values[0] as string);
          return { rows: [], rowCount: 0 };
        }
        if (text.includes("DELETE FROM login_attempts")) {
          attempts.clear();
          return { rows: [], rowCount: 0 };
        }
        return { rows: [], rowCount: 0 };
      }),
    },
    ensureInitialized: vi.fn(async () => { }),
  };
});

// Mock db-admin so auth doesn't need a real DB with seeded user
vi.mock("@/lib/db-admin", () => ({
  getAdminUser: vi.fn(async (username: string) => {
    if (username === "admin") {
      return {
        id: 1,
        username: "admin",
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
  beforeEach(async () => await resetAuthStore());

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
