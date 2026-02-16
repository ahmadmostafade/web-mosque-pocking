import db from "./db";

export interface IqamahTime {
  id: number;
  prayer_name: string;
  offset_minutes: number;
  updated_at: string;
  updated_by: string | null;
}

export function getAllIqamahTimes(): IqamahTime[] {
  const stmt = db.prepare("SELECT * FROM iqamah_times ORDER BY id");
  return stmt.all() as IqamahTime[];
}

export function getIqamahTime(prayerName: string): IqamahTime | null {
  const stmt = db.prepare("SELECT * FROM iqamah_times WHERE prayer_name = ?");
  return (stmt.get(prayerName) as IqamahTime) || null;
}

export function updateIqamahTime(
  prayerName: string,
  offsetMinutes: number,
  updatedBy: string
): boolean {
  const stmt = db.prepare(
    "UPDATE iqamah_times SET offset_minutes = ?, updated_at = CURRENT_TIMESTAMP, updated_by = ? WHERE prayer_name = ?"
  );
  const result = stmt.run(offsetMinutes, updatedBy, prayerName);
  return result.changes > 0;
}

export function upsertIqamahTime(
  prayerName: string,
  offsetMinutes: number,
  updatedBy: string
): void {
  const stmt = db.prepare(`
    INSERT INTO iqamah_times (prayer_name, offset_minutes, updated_by)
    VALUES (?, ?, ?)
    ON CONFLICT(prayer_name) DO UPDATE SET
      offset_minutes = excluded.offset_minutes,
      updated_at = CURRENT_TIMESTAMP,
      updated_by = excluded.updated_by
  `);
  stmt.run(prayerName, offsetMinutes, updatedBy);
}
