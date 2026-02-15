import { NextRequest, NextResponse } from "next/server";
import { validateSession } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const sessionId = request.cookies.get("session")?.value;

  if (!sessionId) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  const session = validateSession(sessionId);
  if (!session) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  return NextResponse.json({
    authenticated: true,
    username: session.username,
  });
}
