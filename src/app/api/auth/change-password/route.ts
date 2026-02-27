import { NextRequest, NextResponse } from "next/server";
import { validateSession } from "@/lib/auth";
import { updateAdminPassword } from "@/lib/db-admin";

export async function POST(request: NextRequest) {
  const sessionId = request.cookies.get("session")?.value;
  if (!sessionId || !(await validateSession(sessionId))) {
    return NextResponse.json({ error: "Nicht autorisiert." }, { status: 401 });
  }

  try {
    const { currentPassword, newPassword } = await request.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: "Aktuelles und neues Passwort erforderlich." },
        { status: 400 }
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: "Neues Passwort muss mindestens 8 Zeichen lang sein." },
        { status: 400 }
      );
    }

    const session = (await validateSession(sessionId))!;

    // Re-authenticate with current password before allowing change
    const { authenticate } = await import("@/lib/auth");
    const valid = await authenticate(session.username, currentPassword);
    if (!valid) {
      return NextResponse.json(
        { error: "Aktuelles Passwort ist falsch." },
        { status: 403 }
      );
    }

    const updated = await updateAdminPassword(session.username, newPassword);
    if (!updated) {
      return NextResponse.json(
        { error: "Passwort konnte nicht aktualisiert werden." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Ungültige Anfrage." }, { status: 400 });
  }
}
