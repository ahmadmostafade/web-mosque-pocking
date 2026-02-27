import pg from "pg";
import bcrypt from "bcryptjs";

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL environment variable is required.");
  process.exit(1);
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

const { rows } = await pool.query(
  "SELECT username, password_hash FROM admin_users WHERE username = 'admin'"
);
const user = rows[0];
console.log("User found:", user ? "yes" : "no");
if (user) {
  console.log("Hash:", user.password_hash);
  const match = bcrypt.compareSync("moschee2026!", user.password_hash);
  console.log("Password 'moschee2026!' matches:", match);
}
await pool.end();
