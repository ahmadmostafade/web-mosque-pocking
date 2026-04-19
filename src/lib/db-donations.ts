import pool, { ensureInitialized } from "./db";

export interface Donation {
  id: number;
  amount: number;
  source: string;
  anonymous: boolean;
  donor_name: string | null;
  // pg returns TIMESTAMP columns as Date objects at runtime
  created_at: Date | string;
  updated_by: string | null;
}

export interface DonationTotal {
  total: number;
  manual: number;
  stripe: number;
  adjustment: number;
}

export async function getAllDonations(): Promise<Donation[]> {
  await ensureInitialized();
  const { rows } = await pool.query(
    "SELECT * FROM donations ORDER BY created_at DESC"
  );
  return rows;
}

export async function addDonation(
  amount: number,
  source: string = "manual",
  anonymous: boolean = false,
  donorName: string | null = null,
  updatedBy: string | null = null
): Promise<number> {
  await ensureInitialized();
  const { rows } = await pool.query(
    `INSERT INTO donations (amount, source, anonymous, donor_name, updated_by)
     VALUES ($1, $2, $3, $4, $5) RETURNING id`,
    [amount, source, anonymous, donorName, updatedBy]
  );
  return rows[0].id;
}

export async function getDonationTotals(): Promise<DonationTotal> {
  await ensureInitialized();
  const { rows: manualRows } = await pool.query(
    "SELECT COALESCE(SUM(amount), 0) as total FROM donations WHERE source = 'manual'"
  );
  const { rows: stripeRows } = await pool.query(
    "SELECT COALESCE(SUM(amount), 0) as total FROM donations WHERE source = 'stripe'"
  );
  const { rows: adjustmentRows } = await pool.query(
    "SELECT value FROM settings WHERE key = 'donation_adjustment'"
  );

  const manual = parseFloat(manualRows[0].total);
  const stripe = parseFloat(stripeRows[0].total);
  const adjustment = adjustmentRows[0]
    ? parseFloat(adjustmentRows[0].value)
    : 0;

  return {
    total: manual + stripe + adjustment,
    manual,
    stripe,
    adjustment,
  };
}

export async function updateDonationAdjustment(
  adjustment: number,
  updatedBy: string
): Promise<void> {
  await ensureInitialized();
  await pool.query(
    `INSERT INTO settings (key, value, updated_by)
     VALUES ('donation_adjustment', $1, $2)
     ON CONFLICT(key) DO UPDATE SET
       value = EXCLUDED.value,
       updated_at = NOW(),
       updated_by = EXCLUDED.updated_by`,
    [adjustment.toString(), updatedBy]
  );
}

export async function getDonationGoal(): Promise<number> {
  await ensureInitialized();
  const { rows } = await pool.query(
    "SELECT value FROM settings WHERE key = 'donation_goal'"
  );
  return rows[0] ? parseFloat(rows[0].value) : 60000;
}

export async function getDonationProgress(): Promise<number> {
  await ensureInitialized();
  const { rows } = await pool.query(
    "SELECT value FROM settings WHERE key = 'donation_progress'"
  );
  return rows[0] ? parseFloat(rows[0].value) : 0;
}

export async function updateDonationProgress(
  progress: number,
  updatedBy: string
): Promise<void> {
  await ensureInitialized();
  await pool.query(
    `INSERT INTO settings (key, value, updated_by)
     VALUES ('donation_progress', $1, $2)
     ON CONFLICT(key) DO UPDATE SET
       value = EXCLUDED.value,
       updated_at = NOW(),
       updated_by = EXCLUDED.updated_by`,
    [progress.toString(), updatedBy]
  );
}

export async function clearAllDonations(): Promise<void> {
  await ensureInitialized();
  await pool.query("DELETE FROM donations");
}

export async function resetDonationProgress(
  updatedBy: string
): Promise<void> {
  await ensureInitialized();
  await pool.query(
    `INSERT INTO settings (key, value, updated_by)
     VALUES ('donation_progress', '0', $1)
     ON CONFLICT(key) DO UPDATE SET
       value = '0',
       updated_at = NOW(),
       updated_by = EXCLUDED.updated_by`,
    [updatedBy]
  );
}
