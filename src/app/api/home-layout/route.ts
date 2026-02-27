import { NextRequest, NextResponse } from "next/server";
import { validateSession } from "@/lib/auth";
import { getHomeLayout, setHomeLayout, HomeLayout } from "@/lib/db-settings";

export async function GET() {
  return NextResponse.json({ layout: await getHomeLayout() });
}

export async function POST(request: NextRequest) {
  const sessionId = request.cookies.get("session")?.value;
  const session = sessionId ? await validateSession(sessionId) : null;
  if (!session) {
    return NextResponse.json({ error: "Nicht autorisiert." }, { status: 401 });
  }

  const { layout } = await request.json();
  if (layout !== "v1" && layout !== "v2") {
    return NextResponse.json({ error: "Ungültiges Layout." }, { status: 400 });
  }

  await setHomeLayout(layout as HomeLayout, session.username);

  return NextResponse.json({ layout });
}
