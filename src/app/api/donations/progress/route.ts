import { NextRequest, NextResponse } from "next/server";
import { validateSession } from "@/lib/auth";
import { updateDonationProgress } from "@/lib/db-donations";

export async function PUT(request: NextRequest) {
  try {
    const sessionId = request.cookies.get("session")?.value;
    if (!sessionId || !(await validateSession(sessionId))) {
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

    await updateDonationProgress(progress, "admin");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating donation progress:", error);
    return NextResponse.json(
      { error: "Failed to update donation progress" },
      { status: 500 }
    );
  }
}
