import db from "./db";
import bcrypt from "bcryptjs";

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

export async function updateAdminPassword(
  username: string,
  newPassword: string
): Promise<boolean> {
  const hash = await bcrypt.hash(newPassword, 12);
  const stmt = db.prepare(
    "UPDATE admin_users SET password_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE username = ?"
  );
  const result = stmt.run(hash, username);
  return result.changes > 0;
}

export async function createAdminUser(
  username: string,
  password: string
): Promise<boolean> {
  try {
    const hash = await bcrypt.hash(password, 12);
    const stmt = db.prepare(
      "INSERT INTO admin_users (username, password_hash) VALUES (?, ?)"
    );
    stmt.run(username, hash);
    return true;
  } catch {
    return false;
  }
}
