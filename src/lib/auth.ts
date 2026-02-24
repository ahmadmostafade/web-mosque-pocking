import { getAdminUser } from "./db-admin";
import bcrypt from "bcryptjs";

/**
 * Simple authentication system for admin dashboard.
 * Uses database for user credentials and in-memory session store.
 */

export interface Session {
  id: string;
  username: string;
  createdAt: number;
  expiresAt: number;
}

const SESSION_DURATION = 60 * 60 * 1000; // 1 hour

// Persist across HMR reloads in dev by attaching to global
declare global {
  // eslint-disable-next-line no-var
  var __sessions: Map<string, Session> | undefined;
  // eslint-disable-next-line no-var
  var __loginAttempts: Map<string, { count: number; lastAttempt: number }> | undefined;
}

if (!global.__sessions) global.__sessions = new Map();
if (!global.__loginAttempts) global.__loginAttempts = new Map();

let sessions = global.__sessions;
let loginAttempts = global.__loginAttempts;

const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes

export function isRateLimited(ip: string): boolean {
  const attempt = loginAttempts.get(ip);
  if (!attempt) return false;
  if (Date.now() - attempt.lastAttempt > RATE_LIMIT_WINDOW) {
    loginAttempts.delete(ip);
    return false;
  }
  return attempt.count >= RATE_LIMIT_MAX;
}

function recordAttempt(ip: string): void {
  const attempt = loginAttempts.get(ip);
  if (!attempt || Date.now() - attempt.lastAttempt > RATE_LIMIT_WINDOW) {
    loginAttempts.set(ip, { count: 1, lastAttempt: Date.now() });
  } else {
    attempt.count++;
    attempt.lastAttempt = Date.now();
  }
}

export async function authenticate(
  username: string,
  password: string,
  ip: string = "unknown"
): Promise<Session | null> {
  if (isRateLimited(ip)) return null;

  recordAttempt(ip);

  const user = getAdminUser(username);
  if (user && (await bcrypt.compare(password, user.password_hash))) {
    const session: Session = {
      id: `sess-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      username,
      createdAt: Date.now(),
      expiresAt: Date.now() + SESSION_DURATION,
    };
    sessions.set(session.id, session);
    return session;
  }
  return null;
}

export function validateSession(sessionId: string): Session | null {
  const session = sessions.get(sessionId);
  if (!session) return null;
  if (Date.now() > session.expiresAt) {
    sessions.delete(sessionId);
    return null;
  }
  return session;
}

export function logout(sessionId: string): boolean {
  return sessions.delete(sessionId);
}

export function resetAuthStore(): void {
  sessions = global.__sessions = new Map();
  loginAttempts = global.__loginAttempts = new Map();
}
