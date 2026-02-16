import { NextRequest, NextResponse } from "next/server";
import { updateDonationProgress } from "@/lib/db-donations";
import { logAction } from "@/lib/audit-log";

export async function PUT(request: NextRequest) {
  try {
    const session = request.cookies.get("session");
    if (!session?.value) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { progress } = body;

    if (progress === undefined || progress === null) {
      return NextResponse.json(
        { error: "Missing progress value" },
        { status: 400 }
      );
    }

    updateDonationProgress(progress, "admin");
    logAction("admin", "update", "donation_progress", `${progress}€`);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating donation progress:", error);
    return NextResponse.json(
      { error: "Failed to update donation progress" },
      { status: 500 }
    );
  }
}
