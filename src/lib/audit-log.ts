/**
 * Audit logging for admin actions.
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

let auditLog: AuditEntry[] = [];

export function logAction(
  username: string,
  action: string,
  resource: string,
  details?: string
): AuditEntry {
  const entry: AuditEntry = {
    id: `audit-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    timestamp: new Date().toISOString(),
    username,
    action,
    resource,
    details,
  };
  auditLog.push(entry);
  return entry;
}

export function getAuditLog(limit = 50): AuditEntry[] {
  return [...auditLog].reverse().slice(0, limit);
}

export function getAuditLogByResource(resource: string): AuditEntry[] {
  return auditLog.filter((e) => e.resource === resource).reverse();
}

export function resetAuditLog(): void {
  auditLog = [];
}
