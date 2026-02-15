import { describe, it, expect, beforeEach } from "vitest";
import { POST } from "./route";
import { resetAuthStore } from "@/lib/auth";

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
  });

  it("returns 401 for invalid credentials", async () => {
    const res = await POST(jsonRequest({ username: "admin", password: "wrong" }) as never);
    expect(res.status).toBe(401);
  });

  it("returns 400 for missing fields", async () => {
    const res = await POST(jsonRequest({ username: "admin" }) as never);
    expect(res.status).toBe(400);
  });
});
