import db from "./db";

export type HomeLayout = "v1" | "v2";

export function getHomeLayout(): HomeLayout {
  const row = db.prepare("SELECT value FROM settings WHERE key = 'home_layout'").get() as { value: string } | undefined;
  return (row?.value as HomeLayout) ?? "v2";
}

export function setHomeLayout(layout: HomeLayout, updatedBy: string): void {
  db.prepare(`
    INSERT INTO settings (key, value, updated_by)
    VALUES ('home_layout', ?, ?)
    ON CONFLICT(key) DO UPDATE SET
      value = excluded.value,
      updated_at = CURRENT_TIMESTAMP,
      updated_by = excluded.updated_by
  `).run(layout, updatedBy);
}
