# Full Migration Plan: Netlify Deployment

## Overview

Your project is a **Next.js 16** app with a **SQLite database** (`better-sqlite3`), **in-memory sessions**, and **filesystem-based media**. Netlify runs Next.js on serverless functions — three things must change:

1. **Database**: SQLite → PostgreSQL (serverless can't use native modules or persistent files)
2. **Sessions**: In-memory `Map` → PostgreSQL sessions table (serverless functions don't share memory)
3. **Media**: images read via `fs` at runtime → committed static assets (already fine) or external storage

---

## Phase 0 — Prerequisites (before writing any code)

| Step | Action |
|---|---|
| 0.1 | Create a [Neon](https://neon.tech) account (free 0.5 GB PostgreSQL) |
| 0.2 | Create a database, copy the `DATABASE_URL` connection string |
| 0.3 | Create a [Netlify](https://netlify.com) account, connect your GitHub repo |

---

## Phase 1 — Swap database driver

**Files:** package.json

| Remove | Add |
|---|---|
| `better-sqlite3` | `pg` |
| `@types/better-sqlite3` | `@types/pg` |

```bash
npm uninstall better-sqlite3 @types/better-sqlite3
npm install pg @types/pg
```

---

## Phase 2 — Rewrite the database layer (6 files)

All `db-*.ts` files use synchronous `better-sqlite3` API. Every function that touches the DB must become `async` and use `pg.Pool`.

### 2.1 — db.ts (full rewrite)

**Current:** Opens a SQLite file, creates tables synchronously at import time, inserts default admin user + settings.

**New:**
- Export a `pg.Pool` instance using `DATABASE_URL` env var
- Export an `async initializeDatabase()` function with schema translated to PostgreSQL syntax
- Schema differences:

| SQLite | PostgreSQL |
|---|---|
| `INTEGER PRIMARY KEY AUTOINCREMENT` | `SERIAL PRIMARY KEY` |
| `BOOLEAN DEFAULT 0` | `BOOLEAN DEFAULT FALSE` |
| `DATETIME DEFAULT CURRENT_TIMESTAMP` | `TIMESTAMP DEFAULT NOW()` |
| `REAL` | `NUMERIC(10,2)` |
| `bcrypt.hashSync()` | `await bcrypt.hash()` |

- Initialization called once per cold start (lazy singleton pattern)

### 2.2 — db-admin.ts (3 functions)

| Function | Change |
|---|---|
| `getAdminUser(username)` | `async`, `pool.query('SELECT ... WHERE username = $1', [username])`, returns `rows[0]` |
| `updateAdminPassword(username, pw)` | Already async, swap `.prepare().run()` → `pool.query()`, use `result.rowCount` |
| `createAdminUser(username, pw)` | Already async, same conversion |

### 2.3 — db-donations.ts (8 functions)

| Function | Change |
|---|---|
| `getAllDonations()` | `async`, `.all()` → `pool.query()`, return `rows` |
| `addDonation(...)` | `async`, use `RETURNING id` instead of `lastInsertRowid` |
| `getDonationTotals()` | `async`, 3 queries → single query or sequenced awaits |
| `updateDonationAdjustment(...)` | `async`, `ON CONFLICT` syntax identical in PG |
| `getDonationGoal()` | `async` |
| `getDonationProgress()` | `async` |
| `updateDonationProgress(...)` | `async` |
| `clearAllDonations()` | `async` |
| `resetDonationProgress(...)` | `async` |

### 2.4 — db-iqamah.ts (3 functions)

| Function | Change |
|---|---|
| `getAllIqamahTimes()` | `async`, return `rows` |
| `getIqamahTime(prayer)` | `async`, return `rows[0]` |
| `updateIqamahTime(...)` | `async`, `rowCount > 0` |
| `upsertIqamahTime(...)` | `async`, `ON CONFLICT` works identically |

### 2.5 — db-jummah.ts (2 functions)

| Function | Change |
|---|---|
| `getJummahTimes()` | `async` |
| `updateJummahTimes(...)` | `async` |

### 2.6 — db-settings.ts (2 functions)

| Function | Change |
|---|---|
| `getHomeLayout()` | `async` |
| `setHomeLayout(...)` | `async` |

### 2.7 — db-seed.ts

Convert to async. Call `await initializeDatabase()` then `await addDonation(...)` etc.

---

## Phase 3 — Move sessions to PostgreSQL

**File:** auth.ts

**Current:** Sessions and rate-limit attempts stored in `global.__sessions` (in-memory `Map`). Works when there's one persistent Node.js process. On Netlify serverless, each request can hit a different function instance — the Map is empty.

**New:**
- Add a `sessions` table (created in Phase 2.1):
  ```sql
  CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY,
    username TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    expires_at TIMESTAMP NOT NULL
  );
  ```
- Add a `login_attempts` table:
  ```sql
  CREATE TABLE IF NOT EXISTS login_attempts (
    ip TEXT PRIMARY KEY,
    count INTEGER DEFAULT 1,
    last_attempt TIMESTAMP DEFAULT NOW()
  );
  ```

| Function | Change |
|---|---|
| `authenticate()` | `async` (already is), call `await getAdminUser()`, insert session into DB |
| `validateSession()` | `async`, query `sessions` table, delete if expired |
| `logout()` | `async`, `DELETE FROM sessions WHERE id = $1` |
| `isRateLimited()` | `async`, query `login_attempts` table |
| `recordAttempt()` | `async`, upsert into `login_attempts` table |

Remove all `global.__sessions` / `global.__loginAttempts` patterns.

---

## Phase 4 — Update all callers (store layers + API routes)

Now every DB function is async, so every caller must add `await`.

### 4.1 — Store layer files

| File | Functions to make async |
|---|---|
| donation-store.ts | `getDonations()`, `getDonationSettings()`, `addDonation()`, `updateManualAdjustment()`, `calculateTotalBySource()` |
| iqamah-store.ts | `getIqamahTimes()`, `updateIqamahTimes()` |

### 4.2 — API routes (8 files)

| Route file | Change |
|---|---|
| route.ts | `await` on `calculateTotalBySource()`, `getDonationSettings()`, `getDonationProgress()`, `getDonations()`, `addDonation()`, `updateDonationProgress()` |
| route.ts | `await updateDonationProgress()` |
| route.ts | `await clearAllDonations()`, `await resetDonationProgress()` |
| route.ts | `await getIqamahTimes()`, `await updateIqamahTimes()` |
| route.ts | `await getJummahTimes()`, `await updateJummahTimes()` |
| route.ts | `await getHomeLayout()`, `await setHomeLayout()` |
| route.ts | No change (already awaits `authenticate()`) |
| route.ts | `await validateSession()` |
| route.ts | `await validateSession()` |
| route.ts | `await logout()` |

route.ts — **no change** (fetches from external API, no DB).
route.ts — **no change** (validation only, no DB).

---

## Phase 5 — Media / Images

media-server.ts reads images using `fs.readdirSync`. On Netlify, public is deployed as static assets and the filesystem **is** available at build time.

**Decision point:**

| Scenario | Action needed |
|---|---|
| Images only change when you git push (current behavior) | **None** — they're committed to the repo and served statically |
| Admin needs to upload images at runtime | Need external storage (Netlify Blobs, Cloudinary, or S3) |

If images are git-committed only → skip this phase entirely.

---

## Phase 6 — Netlify configuration

Create `netlify.toml` at project root:

```toml
[build]
  command = "npm run build"
  publish = ".next"

[build.environment]
  NODE_VERSION = "20"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

Install the plugin:
```bash
npm install -D @netlify/plugin-nextjs
```

Set environment variables in Netlify dashboard → Site settings → Environment variables:
```
DATABASE_URL=postgresql://user:pass@host:5432/dbname
ADMIN_DEFAULT_PASSWORD=your-password
```

---

## Phase 7 — Update tests

Test files that mock `better-sqlite3` or the sync DB API need updating:

| File | Change |
|---|---|
| donation-store.test.ts | Mock async functions |
| donations.test.ts | Same |
| iqamah-store.test.ts | Same |
| auth.test.ts | Mock async session functions |
| src/app/api/*/route.test.ts | Ensure tests await route responses |

---

## Execution order and estimated effort

| Phase | Description | Files | Effort |
|---|---|---|---|
| 0 | Create Neon DB + Netlify account | 0 | 15 min |
| 1 | Swap npm packages | 1 | 2 min |
| 2 | Rewrite DB layer (6 files) | 7 | 45 min |
| 3 | Sessions → PostgreSQL | 1 | 30 min |
| 4 | Add `await` to callers (stores + routes) | 10 | 20 min |
| 5 | Media decision | 0–1 | 0–30 min |
| 6 | Netlify config + env vars | 1 | 5 min |
| 7 | Fix tests | 5–6 | 30 min |
| **Total** | | **~20 files** | **~2.5 hours** |