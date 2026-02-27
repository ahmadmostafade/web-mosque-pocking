import pool, { ensureInitialized } from "./db";

export interface JummahTimes {
  khutba_time: string;
  updated_at: string;
  updated_by: string | null;
}

export async function getJummahTimes(): Promise<JummahTimes> {
  await ensureInitialized();
  const { rows } = await pool.query(
    "SELECT * FROM jummah_times WHERE id = 1"
  );

  if (!rows[0]) {
    return {
      khutba_time: "12:30",
      updated_at: new Date().toISOString(),
      updated_by: null,
    };
  }

  return rows[0];
}

export async function updateJummahTimes(
  khutbaTime: string,
  updatedBy: string
): Promise<boolean> {
  await ensureInitialized();
  const result = await pool.query(
    `INSERT INTO jummah_times (id, khutba_time, updated_by)
     VALUES (1, $1, $2)
     ON CONFLICT(id) DO UPDATE SET
       khutba_time = EXCLUDED.khutba_time,
       updated_at = NOW(),
       updated_by = EXCLUDED.updated_by`,
    [khutbaTime, updatedBy]
  );
  return (result.rowCount ?? 0) > 0;
}
