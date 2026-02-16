import db from "./db";

export interface Donation {
  id: number;
  amount: number;
  source: string;
  anonymous: boolean;
  donor_name: string | null;
  created_at: string;
  updated_by: string | null;
}

export interface DonationTotal {
  total: number;
  manual: number;
  stripe: number;
  adjustment: number;
}

export function getAllDonations(): Donation[] {
  const stmt = db.prepare(
    "SELECT * FROM donations ORDER BY created_at DESC"
  );
  return stmt.all() as Donation[];
}

export function addDonation(
  amount: number,
  source: string = "manual",
  anonymous: boolean = false,
  donorName: string | null = null,
  updatedBy: string | null = null
): number {
  const stmt = db.prepare(`
    INSERT INTO donations (amount, source, anonymous, donor_name, updated_by)
    VALUES (?, ?, ?, ?, ?)
  `);
  const result = stmt.run(amount, source, anonymous ? 1 : 0, donorName, updatedBy);
  return result.lastInsertRowid as number;
}

export function getDonationTotals(): DonationTotal {
  const manualStmt = db.prepare(
    "SELECT COALESCE(SUM(amount), 0) as total FROM donations WHERE source = 'manual'"
  );
  const stripeStmt = db.prepare(
    "SELECT COALESCE(SUM(amount), 0) as total FROM donations WHERE source = 'stripe'"
  );
  const adjustmentStmt = db.prepare(
    "SELECT value FROM settings WHERE key = 'donation_adjustment'"
  );

  const manual = (manualStmt.get() as { total: number }).total;
  const stripe = (stripeStmt.get() as { total: number }).total;
  const adjustmentRow = adjustmentStmt.get() as { value: string } | undefined;
  const adjustment = adjustmentRow ? parseFloat(adjustmentRow.value) : 0;

  return {
    total: manual + stripe + adjustment,
    manual,
    stripe,
    adjustment,
  };
}

export function updateDonationAdjustment(
  adjustment: number,
  updatedBy: string
): void {
  const stmt = db.prepare(`
    INSERT INTO settings (key, value, updated_by)
    VALUES ('donation_adjustment', ?, ?)
    ON CONFLICT(key) DO UPDATE SET
      value = excluded.value,
      updated_at = CURRENT_TIMESTAMP,
      updated_by = excluded.updated_by
  `);
  stmt.run(adjustment.toString(), updatedBy);
}

export function getDonationGoal(): number {
  const stmt = db.prepare("SELECT value FROM settings WHERE key = 'donation_goal'");
  const row = stmt.get() as { value: string } | undefined;
  return row ? parseFloat(row.value) : 60000;
}

export function getDonationProgress(): number {
  const stmt = db.prepare("SELECT value FROM settings WHERE key = 'donation_progress'");
  const row = stmt.get() as { value: string } | undefined;
  return row ? parseFloat(row.value) : 0;
}

export function updateDonationProgress(
  progress: number,
  updatedBy: string
): void {
  const stmt = db.prepare(`
    INSERT INTO settings (key, value, updated_by)
    VALUES ('donation_progress', ?, ?)
    ON CONFLICT(key) DO UPDATE SET
      value = excluded.value,
      updated_at = CURRENT_TIMESTAMP,
      updated_by = excluded.updated_by
  `);
  stmt.run(progress.toString(), updatedBy);
}
