import pool, { ensureInitialized } from "./db";

export type HomeLayout = "v1" | "v2";

export async function getHomeLayout(): Promise<HomeLayout> {
  await ensureInitialized();
  const { rows } = await pool.query(
    "SELECT value FROM settings WHERE key = 'home_layout'"
  );
  return (rows[0]?.value as HomeLayout) ?? "v2";
}

export async function setHomeLayout(
  layout: HomeLayout,
  updatedBy: string
): Promise<void> {
  await ensureInitialized();
  await pool.query(
    `INSERT INTO settings (key, value, updated_by)
     VALUES ('home_layout', $1, $2)
     ON CONFLICT(key) DO UPDATE SET
       value = EXCLUDED.value,
       updated_at = NOW(),
       updated_by = EXCLUDED.updated_by`,
    [layout, updatedBy]
  );
}
