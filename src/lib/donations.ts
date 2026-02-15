import { SITE_CONFIG } from "./constants";

export interface DonationProgress {
  currentAmount: number;
  goalAmount: number;
  percentage: number;
  remaining: number;
  lastUpdated: string;
}

export function calculateDonationProgress(
  manualDonations: number,
  stripeDonations: number,
  manualAdjustment: number
): DonationProgress {
  const currentAmount = manualDonations + stripeDonations + manualAdjustment;
  const goalAmount = SITE_CONFIG.donationGoal;
  const percentage = Math.min(
    Math.round((currentAmount / goalAmount) * 100),
    100
  );
  const remaining = Math.max(goalAmount - currentAmount, 0);

  return {
    currentAmount,
    goalAmount,
    percentage,
    remaining,
    lastUpdated: new Date().toISOString(),
  };
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
  }).format(amount);
}
