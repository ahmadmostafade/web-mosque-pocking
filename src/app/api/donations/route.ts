import { NextRequest, NextResponse } from "next/server";
import {
  getDonations,
  calculateTotalBySource,
  getDonationSettings,
} from "@/lib/donation-store";
import { calculateDonationProgress } from "@/lib/donations";

export async function GET() {
  const totals = calculateTotalBySource();
  const settings = getDonationSettings();
  const progress = calculateDonationProgress(
    totals.manual,
    totals.stripe,
    totals.adjustment
  );

  return NextResponse.json({
    progress: {
      ...progress,
      lastUpdated: settings.lastUpdated,
    },
    totals,
    donations: getDonations(),
  });
}
