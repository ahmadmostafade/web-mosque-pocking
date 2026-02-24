import Database from "better-sqlite3";
import path from "path";
import fs from "fs";
import bcrypt from "bcryptjs";

const dbDir = path.join(process.cwd(), "data");
const dbPath = path.join(dbDir, "mosque.db");

// Ensure data directory exists
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new Database(dbPath);

// Enable WAL mode for better concurrency
db.pragma("journal_mode = WAL");

// Initialize database schema
function initializeDatabase() {
  db.exec(`
    -- Admin users table
    CREATE TABLE IF NOT EXISTS admin_users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- Iqamah times table (prayer times adjustments)
    CREATE TABLE IF NOT EXISTS iqamah_times (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      prayer_name TEXT UNIQUE NOT NULL,
      offset_minutes INTEGER NOT NULL DEFAULT 0,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_by TEXT
    );

    -- Donations table
    CREATE TABLE IF NOT EXISTS donations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      amount REAL NOT NULL,
      source TEXT NOT NULL DEFAULT 'manual',
      anonymous BOOLEAN DEFAULT 0,
      donor_name TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_by TEXT
    );

    -- Settings table for general configuration
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_by TEXT
    );

    -- Jummah times table
    CREATE TABLE IF NOT EXISTS jummah_times (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      khutba_time TEXT NOT NULL DEFAULT '12:30',
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_by TEXT
    );

  `);

  // Insert default admin user — password comes from env, never hardcoded
  const adminExists = db
    .prepare("SELECT COUNT(*) as count FROM admin_users WHERE username = ?")
    .get("admin") as { count: number };

  if (adminExists.count === 0) {
    const defaultPassword = process.env.ADMIN_DEFAULT_PASSWORD;
    if (!defaultPassword) {
      throw new Error(
        "ADMIN_DEFAULT_PASSWORD env variable is required to initialize the admin user."
      );
    }
    const hash = bcrypt.hashSync(defaultPassword, 12);
    db.prepare(
      "INSERT INTO admin_users (username, password_hash) VALUES (?, ?)"
    ).run("admin", hash);
  }

  // Insert default Iqamah offsets
  const prayers = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];
  const iqamahExists = db
    .prepare("SELECT COUNT(*) as count FROM iqamah_times")
    .get() as { count: number };

  if (iqamahExists.count === 0) {
    const stmt = db.prepare(
      "INSERT INTO iqamah_times (prayer_name, offset_minutes) VALUES (?, ?)"
    );
    prayers.forEach((prayer) => {
      stmt.run(prayer, prayer === "Maghrib" ? 5 : 15);
    });
  }

  // Insert default settings
  const settingsExist = db
    .prepare("SELECT COUNT(*) as count FROM settings")
    .get() as { count: number };

  if (settingsExist.count === 0) {
    const stmt = db.prepare("INSERT INTO settings (key, value) VALUES (?, ?)");
    stmt.run("donation_goal", "60000");
    stmt.run("donation_adjustment", "0");
    stmt.run("donation_progress", "0");
  }

  // Insert default Jummah times
  const jummahExists = db
    .prepare("SELECT COUNT(*) as count FROM jummah_times")
    .get() as { count: number };

  if (jummahExists.count === 0) {
    db.prepare(
      "INSERT INTO jummah_times (id, khutba_time) VALUES (1, '12:30')"
    ).run();
  }
}

// Initialize on first import
initializeDatabase();

export default db;
