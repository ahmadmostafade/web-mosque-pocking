import {
  getAllDonations,
  addDonation as dbAddDonation,
  getDonationTotals,
  updateDonationAdjustment,
  getDonationGoal,
} from "./db-donations";

/**
 * Donation store using SQLite database.
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

export function getDonations(): Donation[] {
  const dbDonations = getAllDonations();
  return dbDonations.map((d) => ({
    id: d.id.toString(),
    amount: d.amount,
    source: d.source as "manual" | "stripe",
    date: d.created_at.split("T")[0],
    donorName: d.donor_name || undefined,
    anonymous: Boolean(d.anonymous),
  }));
}

export function getDonationSettings(): DonationSettings {
  const totals = getDonationTotals();
  const goal = getDonationGoal();

  return {
    goalAmount: goal,
    manualAdjustment: totals.adjustment,
    lastUpdated: new Date().toISOString(),
  };
}

export function addDonation(donation: Omit<Donation, "id">): Donation {
  const id = dbAddDonation(
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

export function updateManualAdjustment(amount: number): void {
  updateDonationAdjustment(amount, "admin");
}

export function calculateTotalBySource(): {
  manual: number;
  stripe: number;
  adjustment: number;
  total: number;
} {
  return getDonationTotals();
}

// For testing: reset store
export function resetStore(): void {
  // This would require a database reset function
  // For now, just a placeholder
}
