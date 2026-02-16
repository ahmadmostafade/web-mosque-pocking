import db from "./db";

export interface AuditLogEntry {
  id: number;
  username: string;
  action: string;
  resource: string;
  details: string | null;
  created_at: string;
}

export function logAuditAction(
  username: string,
  action: string,
  resource: string,
  details: string | null = null
): void {
  const stmt = db.prepare(`
    INSERT INTO audit_log (username, action, resource, details)
    VALUES (?, ?, ?, ?)
  `);
  stmt.run(username, action, resource, details);
}

export function getAuditLog(limit: number = 100): AuditLogEntry[] {
  const stmt = db.prepare(
    "SELECT * FROM audit_log ORDER BY created_at DESC LIMIT ?"
  );
  return stmt.all(limit) as AuditLogEntry[];
}

export function getAuditLogByResource(resource: string): AuditLogEntry[] {
  const stmt = db.prepare(
    "SELECT * FROM audit_log WHERE resource = ? ORDER BY created_at DESC"
  );
  return stmt.all(resource) as AuditLogEntry[];
}
