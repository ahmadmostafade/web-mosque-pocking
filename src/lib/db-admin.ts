import db from "./db";

export interface AdminUser {
  id: number;
  username: string;
  password_hash: string;
  created_at: string;
  updated_at: string;
}

export function getAdminUser(username: string): AdminUser | null {
  const stmt = db.prepare("SELECT * FROM admin_users WHERE username = ?");
  return (stmt.get(username) as AdminUser) || null;
}

export function updateAdminPassword(
  username: string,
  newPasswordHash: string
): boolean {
  const stmt = db.prepare(
    "UPDATE admin_users SET password_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE username = ?"
  );
  const result = stmt.run(newPasswordHash, username);
  return result.changes > 0;
}

export function createAdminUser(
  username: string,
  passwordHash: string
): boolean {
  try {
    const stmt = db.prepare(
      "INSERT INTO admin_users (username, password_hash) VALUES (?, ?)"
    );
    stmt.run(username, passwordHash);
    return true;
  } catch {
    return false;
  }
}
