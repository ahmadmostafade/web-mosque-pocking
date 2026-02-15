import { NextRequest, NextResponse } from "next/server";
import { authenticate } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { error: "Benutzername und Passwort erforderlich." },
        { status: 400 }
      );
    }

    const ip = request.headers.get("x-forwarded-for") || "unknown";
    const session = authenticate(username, password, ip);

    if (!session) {
      return NextResponse.json(
        { error: "Ungültige Anmeldedaten oder zu viele Versuche." },
        { status: 401 }
      );
    }

    const response = NextResponse.json({
      success: true,
      username: session.username,
    });

    response.cookies.set("session", session.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 3600,
      path: "/",
    });

    return response;
  } catch {
    return NextResponse.json(
      { error: "Ungültige Anfrage." },
      { status: 400 }
    );
  }
}
