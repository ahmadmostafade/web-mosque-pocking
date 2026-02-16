import db from "./db";

export interface JummahTimes {
  khutba_time: string;
  iqamah_time: string;
  updated_at: string;
  updated_by: string | null;
}

export function getJummahTimes(): JummahTimes {
  const stmt = db.prepare("SELECT * FROM jummah_times WHERE id = 1");
  const result = stmt.get() as JummahTimes | undefined;
  
  if (!result) {
    // Return defaults if not found
    return {
      khutba_time: "12:30",
      iqamah_time: "13:45",
      updated_at: new Date().toISOString(),
      updated_by: null,
    };
  }
  
  return result;
}

export function updateJummahTimes(
  khutbaTime: string,
  iqamahTime: string,
  updatedBy: string
): boolean {
  const stmt = db.prepare(`
    INSERT INTO jummah_times (id, khutba_time, iqamah_time, updated_by)
    VALUES (1, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
      khutba_time = excluded.khutba_time,
      iqamah_time = excluded.iqamah_time,
      updated_at = CURRENT_TIMESTAMP,
      updated_by = excluded.updated_by
  `);
  const result = stmt.run(khutbaTime, iqamahTime, updatedBy);
  return result.changes > 0;
}
