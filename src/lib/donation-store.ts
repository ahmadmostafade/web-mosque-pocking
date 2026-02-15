/**
 * In-memory donation store for MVP.
 * In production, this will be replaced by Supabase/PostgreSQL.
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

// In-memory store (replaced by DB in Phase 2)
let donations: Donation[] = [
  {
    id: "seed-1",
    amount: 10000,
    source: "manual",
    date: "2026-01-15",
    donorName: "Gemeinde",
    anonymous: false,
  },
  {
    id: "seed-2",
    amount: 5000,
    source: "manual",
    date: "2026-02-01",
    anonymous: true,
  },
];

let settings: DonationSettings = {
  goalAmount: 60000,
  manualAdjustment: 0,
  lastUpdated: new Date().toISOString(),
};

export function getDonations(): Donation[] {
  return [...donations];
}

export function getDonationSettings(): DonationSettings {
  return { ...settings };
}

export function addDonation(donation: Omit<Donation, "id">): Donation {
  const newDonation: Donation = {
    ...donation,
    id: `don-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
  };
  donations.push(newDonation);
  settings.lastUpdated = new Date().toISOString();
  return newDonation;
}

export function updateManualAdjustment(amount: number): void {
  settings.manualAdjustment = amount;
  settings.lastUpdated = new Date().toISOString();
}

export function calculateTotalBySource(): {
  manual: number;
  stripe: number;
  adjustment: number;
  total: number;
} {
  const manual = donations
    .filter((d) => d.source === "manual")
    .reduce((sum, d) => sum + d.amount, 0);
  const stripe = donations
    .filter((d) => d.source === "stripe")
    .reduce((sum, d) => sum + d.amount, 0);

  return {
    manual,
    stripe,
    adjustment: settings.manualAdjustment,
    total: manual + stripe + settings.manualAdjustment,
  };
}

// For testing: reset store
export function resetStore(): void {
  donations = [];
  settings = {
    goalAmount: 60000,
    manualAdjustment: 0,
    lastUpdated: new Date().toISOString(),
  };
}
