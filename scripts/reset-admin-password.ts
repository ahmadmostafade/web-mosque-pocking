/**
 * CLI script to reset the admin password.
 * Usage: DATABASE_URL=... npx tsx scripts/reset-admin-password.ts <newPassword>
 *
 * Example: DATABASE_URL=postgresql://... npx tsx scripts/reset-admin-password.ts MyNewPassword123!
 */

import bcrypt from "bcryptjs";
import { Pool } from "pg";

const newPassword = process.argv[2];

if (!newPassword) {
  console.error(
    "Usage: DATABASE_URL=... npx tsx scripts/reset-admin-password.ts <newPassword>"
  );
  process.exit(1);
}

if (newPassword.length < 8) {
  console.error("Password must be at least 8 characters.");
  process.exit(1);
}

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL environment variable is required.");
  process.exit(1);
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function main() {
  const hash = await bcrypt.hash(newPassword, 12);
  const result = await pool.query(
    "UPDATE admin_users SET password_hash = $1, updated_at = NOW() WHERE username = 'admin'",
    [hash]
  );

  if ((result.rowCount ?? 0) > 0) {
    console.log("✓ Admin password updated successfully.");
  } else {
    console.error("✗ No admin user found. Is the database initialized?");
    process.exit(1);
  }

  await pool.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
