import Database from "better-sqlite3";
import bcrypt from "bcryptjs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const db = new Database(path.join(__dirname, "../data/mosque.db"));
const user = db.prepare("SELECT username, password_hash FROM admin_users WHERE username = 'admin'").get();
console.log("User found:", user ? "yes" : "no");
if (user) {
  console.log("Hash:", user.password_hash);
  const match = bcrypt.compareSync("moschee2026!", user.password_hash);
  console.log("Password 'moschee2026!' matches:", match);
}
db.close();
