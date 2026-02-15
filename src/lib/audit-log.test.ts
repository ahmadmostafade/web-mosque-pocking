import { describe, it, expect, beforeEach } from "vitest";
import {
  logAction,
  getAuditLog,
  getAuditLogByResource,
  resetAuditLog,
} from "./audit-log";

describe("Audit Log", () => {
  beforeEach(() => resetAuditLog());

  it("logs an action and retrieves it", () => {
    logAction("admin", "create", "donation", "Added 500€");
    const log = getAuditLog();
    expect(log).toHaveLength(1);
    expect(log[0].username).toBe("admin");
    expect(log[0].action).toBe("create");
    expect(log[0].resource).toBe("donation");
  });

  it("returns entries in reverse chronological order", () => {
    logAction("admin", "create", "event", "First");
    logAction("admin", "update", "event", "Second");
    const log = getAuditLog();
    expect(log[0].details).toBe("Second");
    expect(log[1].details).toBe("First");
  });

  it("filters by resource", () => {
    logAction("admin", "create", "donation");
    logAction("admin", "create", "event");
    logAction("admin", "update", "donation");
    const donationLog = getAuditLogByResource("donation");
    expect(donationLog).toHaveLength(2);
  });
});
