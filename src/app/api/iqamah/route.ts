import { NextRequest, NextResponse } from "next/server";
import { getIqamahTimes, updateIqamahTimes } from "@/lib/iqamah-store";

export async function GET() {
  return NextResponse.json(getIqamahTimes());
}

export async function PUT(request: NextRequest) {
  try {
    const session = request.cookies.get("session");
    if (!session?.value) {
      return NextResponse.json({ error: "Nicht autorisiert." }, { status: 401 });
    }

    const body = await request.json();
    const updated = updateIqamahTimes(body);
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json(
      { error: "Ungültige Daten." },
      { status: 400 }
    );
  }
}
