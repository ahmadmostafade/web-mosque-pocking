import pool, { ensureInitialized } from "./db";

export interface IqamahTime {
  id: number;
  prayer_name: string;
  offset_minutes: number;
  updated_at: string;
  updated_by: string | null;
}

export async function getAllIqamahTimes(): Promise<IqamahTime[]> {
  await ensureInitialized();
  const { rows } = await pool.query(
    "SELECT * FROM iqamah_times ORDER BY id"
  );
  return rows;
}

export async function getIqamahTime(
  prayerName: string
): Promise<IqamahTime | null> {
  await ensureInitialized();
  const { rows } = await pool.query(
    "SELECT * FROM iqamah_times WHERE prayer_name = $1",
    [prayerName]
  );
  return rows[0] || null;
}

export async function updateIqamahTime(
  prayerName: string,
  offsetMinutes: number,
  updatedBy: string
): Promise<boolean> {
  await ensureInitialized();
  const result = await pool.query(
    "UPDATE iqamah_times SET offset_minutes = $1, updated_at = NOW(), updated_by = $2 WHERE prayer_name = $3",
    [offsetMinutes, updatedBy, prayerName]
  );
  return (result.rowCount ?? 0) > 0;
}

export async function upsertIqamahTime(
  prayerName: string,
  offsetMinutes: number,
  updatedBy: string
): Promise<void> {
  await ensureInitialized();
  await pool.query(
    `INSERT INTO iqamah_times (prayer_name, offset_minutes, updated_by)
     VALUES ($1, $2, $3)
     ON CONFLICT(prayer_name) DO UPDATE SET
       offset_minutes = EXCLUDED.offset_minutes,
       updated_at = NOW(),
       updated_by = EXCLUDED.updated_by`,
    [prayerName, offsetMinutes, updatedBy]
  );
}
