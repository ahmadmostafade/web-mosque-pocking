import { NextRequest, NextResponse } from "next/server";
import { validateSession } from "@/lib/auth";
import { clearAllDonations, resetDonationProgress } from "@/lib/db-donations";

export async function POST(request: NextRequest) {
  const sessionId = request.cookies.get("session")?.value;
  if (!sessionId || !validateSession(sessionId)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  clearAllDonations();
  resetDonationProgress("admin");

  return NextResponse.json({ success: true });
}
