import pool, { ensureInitialized } from "./db";
import bcrypt from "bcryptjs";

export interface AdminUser {
  id: number;
  username: string;
  password_hash: string;
  created_at: string;
  updated_at: string;
}

export async function getAdminUser(
  username: string
): Promise<AdminUser | null> {
  await ensureInitialized();
  const { rows } = await pool.query(
    "SELECT * FROM admin_users WHERE username = $1",
    [username]
  );
  return rows[0] || null;
}

export async function updateAdminPassword(
  username: string,
  newPassword: string
): Promise<boolean> {
  await ensureInitialized();
  const hash = await bcrypt.hash(newPassword, 12);
  const result = await pool.query(
    "UPDATE admin_users SET password_hash = $1, updated_at = NOW() WHERE username = $2",
    [hash, username]
  );
  return (result.rowCount ?? 0) > 0;
}

export async function createAdminUser(
  username: string,
  password: string
): Promise<boolean> {
  await ensureInitialized();
  try {
    const hash = await bcrypt.hash(password, 12);
    await pool.query(
      "INSERT INTO admin_users (username, password_hash) VALUES ($1, $2)",
      [username, hash]
    );
    return true;
  } catch {
    return false;
  }
}
