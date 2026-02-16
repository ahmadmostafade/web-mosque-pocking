import {
  logAuditAction,
  getAuditLog as dbGetAuditLog,
  getAuditLogByResource as dbGetAuditLogByResource,
} from "./db-audit";

/**
 * Audit logging for admin actions using database.
 * Tracks who changed what and when.
 */

export interface AuditEntry {
  id: string;
  timestamp: string;
  username: string;
  action: string;
  resource: string;
  details?: string;
}

export function logAction(
  username: string,
  action: string,
  resource: string,
  details?: string
): AuditEntry {
  logAuditAction(username, action, resource, details || null);

  return {
    id: `audit-${Date.now()}`,
    timestamp: new Date().toISOString(),
    username,
    action,
    resource,
    details,
  };
}

export function getAuditLog(limit = 50): AuditEntry[] {
  const dbEntries = dbGetAuditLog(limit);
  return dbEntries.map((e) => ({
    id: e.id.toString(),
    timestamp: e.created_at,
    username: e.username,
    action: e.action,
    resource: e.resource,
    details: e.details || undefined,
  }));
}

export function getAuditLogByResource(resource: string): AuditEntry[] {
  const dbEntries = dbGetAuditLogByResource(resource);
  return dbEntries.map((e) => ({
    id: e.id.toString(),
    timestamp: e.created_at,
    username: e.username,
    action: e.action,
    resource: e.resource,
    details: e.details || undefined,
  }));
}

export function resetAuditLog(): void {
  // For testing - would need database reset
}
