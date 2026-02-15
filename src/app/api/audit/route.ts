import { NextRequest, NextResponse } from "next/server";
import { getAuditLog, getAuditLogByResource } from "@/lib/audit-log";
import { validateSession } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const sessionId = request.cookies.get("session")?.value;
  if (!sessionId || !validateSession(sessionId)) {
    return NextResponse.json({ error: "Nicht autorisiert." }, { status: 401 });
  }

  const resource = request.nextUrl.searchParams.get("resource");
  const log = resource ? getAuditLogByResource(resource) : getAuditLog();
  return NextResponse.json({ log });
}
