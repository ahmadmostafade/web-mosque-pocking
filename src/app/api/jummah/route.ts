import { NextRequest, NextResponse } from "next/server";
import { getJummahTimes, updateJummahTimes } from "@/lib/db-jummah";
import { logAction } from "@/lib/audit-log";

export async function GET() {
  try {
    const times = getJummahTimes();
    return NextResponse.json({
      khutba: times.khutba_time,
      iqamah: times.iqamah_time,
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
    const session = request.cookies.get("session");
    if (!session?.value) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { khutba, iqamah } = body;

    if (!khutba || !iqamah) {
      return NextResponse.json(
        { error: "Missing khutba or iqamah time" },
        { status: 400 }
      );
    }

    updateJummahTimes(khutba, iqamah, "admin");
    logAction("admin", "update", "jummah", `Khutba: ${khutba}, Iqamah: ${iqamah}`);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating Jummah times:", error);
    return NextResponse.json(
      { error: "Failed to update Jummah times" },
      { status: 500 }
    );
  }
}
