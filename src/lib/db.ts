import { Pool } from "pg";
import bcrypt from "bcryptjs";

// Create pool (this does NOT connect — safe at import time)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Neon requires SSL with valid certs → verify-full (rejectUnauthorized: true).
  // Skip SSL entirely for local development.
  ssl: process.env.DATABASE_URL?.includes("localhost")
    ? false
    : { rejectUnauthorized: true },
  max: 5,
});

// Lazy initialization: runs once per process on first query
let initPromise: Promise<void> | null = null;

async function initializeDatabase(): Promise<void> {
  await pool.query(`
    -- Admin users table
    CREATE TABLE IF NOT EXISTS admin_users (
      id SERIAL PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );

    -- Iqamah times table (prayer times adjustments)
    CREATE TABLE IF NOT EXISTS iqamah_times (
      id SERIAL PRIMARY KEY,
      prayer_name TEXT UNIQUE NOT NULL,
      offset_minutes INTEGER NOT NULL DEFAULT 0,
      updated_at TIMESTAMP DEFAULT NOW(),
      updated_by TEXT
    );

    -- Donations table
    CREATE TABLE IF NOT EXISTS donations (
      id SERIAL PRIMARY KEY,
      amount NUMERIC(10,2) NOT NULL,
      source TEXT NOT NULL DEFAULT 'manual',
      anonymous BOOLEAN DEFAULT FALSE,
      donor_name TEXT,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_by TEXT
    );

    -- Settings table for general configuration
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at TIMESTAMP DEFAULT NOW(),
      updated_by TEXT
    );

    -- Jummah times table
    CREATE TABLE IF NOT EXISTS jummah_times (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      khutba_time TEXT NOT NULL DEFAULT '12:30',
      updated_at TIMESTAMP DEFAULT NOW(),
      updated_by TEXT
    );

    -- Sessions table (for serverless-safe auth)
    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      username TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT NOW(),
      expires_at TIMESTAMP NOT NULL
    );

    -- Login attempts table (for rate limiting)
    CREATE TABLE IF NOT EXISTS login_attempts (
      ip TEXT PRIMARY KEY,
      count INTEGER DEFAULT 1,
      last_attempt TIMESTAMP DEFAULT NOW()
    );
  `);

  // Insert default admin user — password comes from env, never hardcoded
  const { rows: adminRows } = await pool.query(
    "SELECT COUNT(*) as count FROM admin_users WHERE username = $1",
    ["admin"]
  );

  if (parseInt(adminRows[0].count) === 0) {
    const defaultPassword = process.env.ADMIN_DEFAULT_PASSWORD;
    if (!defaultPassword) {
      throw new Error(
        "ADMIN_DEFAULT_PASSWORD env variable is required to initialize the admin user."
      );
    }
    const hash = await bcrypt.hash(defaultPassword, 12);
    await pool.query(
      "INSERT INTO admin_users (username, password_hash) VALUES ($1, $2)",
      ["admin", hash]
    );
  }

  // Insert default Iqamah offsets
  const prayers = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];
  const { rows: iqamahRows } = await pool.query(
    "SELECT COUNT(*) as count FROM iqamah_times"
  );

  if (parseInt(iqamahRows[0].count) === 0) {
    for (const prayer of prayers) {
      await pool.query(
        "INSERT INTO iqamah_times (prayer_name, offset_minutes) VALUES ($1, $2)",
        [prayer, prayer === "Maghrib" ? 5 : 15]
      );
    }
  }

  // Insert default settings
  const { rows: settingsRows } = await pool.query(
    "SELECT COUNT(*) as count FROM settings"
  );

  if (parseInt(settingsRows[0].count) === 0) {
    await pool.query("INSERT INTO settings (key, value) VALUES ($1, $2)", [
      "donation_goal",
      "60000",
    ]);
    await pool.query("INSERT INTO settings (key, value) VALUES ($1, $2)", [
      "donation_adjustment",
      "0",
    ]);
    await pool.query("INSERT INTO settings (key, value) VALUES ($1, $2)", [
      "donation_progress",
      "0",
    ]);
  }

  // Insert default Jummah times
  const { rows: jummahRows } = await pool.query(
    "SELECT COUNT(*) as count FROM jummah_times"
  );

  if (parseInt(jummahRows[0].count) === 0) {
    await pool.query(
      "INSERT INTO jummah_times (id, khutba_time) VALUES (1, '12:30')"
    );
  }
}

/** Call before any DB operation to ensure schema + seed data exist. */
export async function ensureInitialized(): Promise<void> {
  if (!initPromise) {
    initPromise = initializeDatabase();
  }
  await initPromise;
}

export default pool;
