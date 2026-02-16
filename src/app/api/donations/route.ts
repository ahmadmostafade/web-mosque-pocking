import { NextRequest, NextResponse } from "next/server";
import {
  getDonations,
  addDonation,
  calculateTotalBySource,
  getDonationSettings,
} from "@/lib/donation-store";
import { getDonationProgress } from "@/lib/db-donations";
import { logAction } from "@/lib/audit-log";

export async function GET() {
  const totals = calculateTotalBySource();
  const settings = getDonationSettings();
  const progress = getDonationProgress();

  return NextResponse.json({
    progress,
    totals,
    donations: getDonations(),
    settings,
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount, source, donorName, anonymous } = body;

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: "Betrag muss größer als 0 sein." },
        { status: 400 }
      );
    }

    const donation = addDonation({
      amount,
      source: source || "manual",
      date: new Date().toISOString().split("T")[0],
      donorName,
      anonymous: anonymous ?? false,
    });

    logAction(
      "admin",
      "create",
      "donation",
      `Spende: ${amount}€ (${anonymous ? "anonym" : donorName || "unbekannt"})`
    );

    return NextResponse.json({ donation }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Ungültige Anfrage." },
      { status: 400 }
    );
  }
}
