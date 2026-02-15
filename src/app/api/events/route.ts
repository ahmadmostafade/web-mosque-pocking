import { NextRequest, NextResponse } from "next/server";
import { getEvents, addEvent } from "@/lib/events-store";

export async function GET() {
  const events = getEvents();
  return NextResponse.json({ events });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, date, description, imageUrl } = body;

    if (!title || !date || !description) {
      return NextResponse.json(
        { error: "Titel, Datum und Beschreibung sind erforderlich." },
        { status: 400 }
      );
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return NextResponse.json(
        { error: "Datum muss im Format YYYY-MM-DD sein." },
        { status: 400 }
      );
    }

    const event = addEvent({ title, date, description, imageUrl });
    return NextResponse.json({ event }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Ungültige Anfrage." },
      { status: 400 }
    );
  }
}
