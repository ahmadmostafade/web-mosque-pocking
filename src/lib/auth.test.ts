import { describe, it, expect, beforeEach } from "vitest";
import {
  authenticate,
  validateSession,
  logout,
  isRateLimited,
  resetAuthStore,
} from "./auth";

describe("Auth", () => {
  beforeEach(() => resetAuthStore());

  it("authenticates with valid credentials", () => {
    const session = authenticate("admin", "moschee2026!");
    expect(session).not.toBeNull();
    expect(session!.username).toBe("admin");
  });

  it("rejects invalid credentials", () => {
    const session = authenticate("admin", "wrong");
    expect(session).toBeNull();
  });

  it("validates active session", () => {
    const session = authenticate("admin", "moschee2026!")!;
    const valid = validateSession(session.id);
    expect(valid).not.toBeNull();
    expect(valid!.username).toBe("admin");
  });

  it("rejects invalid session id", () => {
    expect(validateSession("fake-id")).toBeNull();
  });

  it("logout invalidates session", () => {
    const session = authenticate("admin", "moschee2026!")!;
    expect(logout(session.id)).toBe(true);
    expect(validateSession(session.id)).toBeNull();
  });

  it("rate limits after 5 attempts", () => {
    const ip = "1.2.3.4";
    for (let i = 0; i < 5; i++) {
      authenticate("admin", "wrong", ip);
    }
    expect(isRateLimited(ip)).toBe(true);
    // Even valid credentials should fail when rate limited
    const session = authenticate("admin", "moschee2026!", ip);
    expect(session).toBeNull();
  });
});
