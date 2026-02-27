import {
  getAllDonations,
  addDonation as dbAddDonation,
  getDonationTotals,
  updateDonationAdjustment,
  getDonationGoal,
} from "./db-donations";

/**
 * Donation store using PostgreSQL database.
 */

export interface Donation {
  id: string;
  amount: number;
  source: "manual" | "stripe";
  date: string;
  donorName?: string;
  anonymous: boolean;
}

export interface DonationSettings {
  goalAmount: number;
  manualAdjustment: number;
  lastUpdated: string;
}

export async function getDonations(): Promise<Donation[]> {
  const dbDonations = await getAllDonations();
  return dbDonations.map((d) => ({
    id: d.id.toString(),
    amount: typeof d.amount === "string" ? parseFloat(d.amount) : d.amount,
    source: d.source as "manual" | "stripe",
    date: d.created_at.split("T")[0],
    donorName: d.donor_name || undefined,
    anonymous: Boolean(d.anonymous),
  }));
}

export async function getDonationSettings(): Promise<DonationSettings> {
  const totals = await getDonationTotals();
  const goal = await getDonationGoal();

  return {
    goalAmount: goal,
    manualAdjustment: totals.adjustment,
    lastUpdated: new Date().toISOString(),
  };
}

export async function addDonation(
  donation: Omit<Donation, "id">
): Promise<Donation> {
  const id = await dbAddDonation(
    donation.amount,
    donation.source,
    donation.anonymous,
    donation.donorName || null,
    "admin"
  );

  return {
    ...donation,
    id: id.toString(),
  };
}

export async function updateManualAdjustment(amount: number): Promise<void> {
  await updateDonationAdjustment(amount, "admin");
}

export async function calculateTotalBySource(): Promise<{
  manual: number;
  stripe: number;
  adjustment: number;
  total: number;
}> {
  return getDonationTotals();
}

// For testing: reset store
export async function resetStore(): Promise<void> {
  // This would require a database reset function
  // For now, just a placeholder
}
