import { NextRequest, NextResponse } from "next/server";
import { validateSession } from "@/lib/auth";
import { getJummahTimes, updateJummahTimes } from "@/lib/db-jummah";

export async function GET() {
  try {
    const times = getJummahTimes();
    return NextResponse.json({
      khutba: times.khutba_time,
    });
  } catch (error) {
    console.error("Error fetching Jummah times:", error);
    return NextResponse.json(
      { error: "Failed to fetch Jummah times" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const sessionId = request.cookies.get("session")?.value;
    if (!sessionId || !validateSession(sessionId)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { khutba } = body;

    if (!khutba) {
      return NextResponse.json(
        { error: "Missing khutba time" },
        { status: 400 }
      );
    }

    updateJummahTimes(khutba, "admin");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating Jummah times:", error);
    return NextResponse.json(
      { error: "Failed to update Jummah times" },
      { status: 500 }
    );
  }
}
