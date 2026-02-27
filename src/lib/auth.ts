import { getAdminUser } from "./db-admin";
import pool, { ensureInitialized } from "./db";
import bcrypt from "bcryptjs";

/**
 * Simple authentication system for admin dashboard.
 * Uses database for user credentials and database-backed session store
 * (serverless-safe — no in-memory state).
 */

export interface Session {
  id: string;
  username: string;
  createdAt: number;
  expiresAt: number;
}

const SESSION_DURATION = 60 * 60 * 1000; // 1 hour

const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes

export async function isRateLimited(ip: string): Promise<boolean> {
  await ensureInitialized();
  const { rows } = await pool.query(
    "SELECT count, last_attempt FROM login_attempts WHERE ip = $1",
    [ip]
  );
  if (!rows[0]) return false;

  const lastAttempt = new Date(rows[0].last_attempt).getTime();
  if (Date.now() - lastAttempt > RATE_LIMIT_WINDOW) {
    await pool.query("DELETE FROM login_attempts WHERE ip = $1", [ip]);
    return false;
  }
  return rows[0].count >= RATE_LIMIT_MAX;
}

async function recordAttempt(ip: string): Promise<void> {
  await ensureInitialized();
  await pool.query(
    `INSERT INTO login_attempts (ip, count, last_attempt)
     VALUES ($1, 1, NOW())
     ON CONFLICT(ip) DO UPDATE SET
       count = login_attempts.count + 1,
       last_attempt = NOW()`,
    [ip]
  );
}

export async function authenticate(
  username: string,
  password: string,
  ip: string = "unknown"
): Promise<Session | null> {
  if (await isRateLimited(ip)) return null;

  await recordAttempt(ip);

  const user = await getAdminUser(username);
  if (user && (await bcrypt.compare(password, user.password_hash))) {
    const session: Session = {
      id: `sess-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      username,
      createdAt: Date.now(),
      expiresAt: Date.now() + SESSION_DURATION,
    };

    await ensureInitialized();
    await pool.query(
      "INSERT INTO sessions (id, username, created_at, expires_at) VALUES ($1, $2, $3, $4)",
      [
        session.id,
        session.username,
        new Date(session.createdAt),
        new Date(session.expiresAt),
      ]
    );

    return session;
  }
  return null;
}

export async function validateSession(
  sessionId: string
): Promise<Session | null> {
  await ensureInitialized();
  const { rows } = await pool.query(
    "SELECT * FROM sessions WHERE id = $1",
    [sessionId]
  );

  if (!rows[0]) return null;

  const expiresAt = new Date(rows[0].expires_at).getTime();
  if (Date.now() > expiresAt) {
    await pool.query("DELETE FROM sessions WHERE id = $1", [sessionId]);
    return null;
  }

  return {
    id: rows[0].id,
    username: rows[0].username,
    createdAt: new Date(rows[0].created_at).getTime(),
    expiresAt,
  };
}

export async function logout(sessionId: string): Promise<boolean> {
  await ensureInitialized();
  const result = await pool.query("DELETE FROM sessions WHERE id = $1", [
    sessionId,
  ]);
  return (result.rowCount ?? 0) > 0;
}

export async function resetAuthStore(): Promise<void> {
  await ensureInitialized();
  await pool.query("DELETE FROM sessions");
  await pool.query("DELETE FROM login_attempts");
}
