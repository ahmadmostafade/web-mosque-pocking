/**
 * CLI script to reset the admin password.
 * Usage: npx tsx scripts/reset-admin-password.ts <newPassword>
 *
 * Example: npx tsx scripts/reset-admin-password.ts MyNewPassword123!
 */

import bcrypt from "bcryptjs";
import Database from "better-sqlite3";
import path from "path";

const newPassword = process.argv[2];

if (!newPassword) {
  console.error("Usage: npx tsx scripts/reset-admin-password.ts <newPassword>");
  process.exit(1);
}

if (newPassword.length < 8) {
  console.error("Password must be at least 8 characters.");
  process.exit(1);
}

const dbPath = path.join(process.cwd(), "data", "mosque.db");
const db = new Database(dbPath);

const hash = bcrypt.hashSync(newPassword, 12);
const result = db
  .prepare(
    "UPDATE admin_users SET password_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE username = 'admin'"
  )
  .run(hash);

if (result.changes > 0) {
  console.log("✓ Admin password updated successfully.");
} else {
  console.error("✗ No admin user found. Is the database initialized?");
  process.exit(1);
}

db.close();
