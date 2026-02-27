import { NextRequest, NextResponse } from "next/server";
import { logout } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const sessionId = request.cookies.get("session")?.value;

  if (sessionId) {
    await logout(sessionId);
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set("session", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 0,
    path: "/",
  });

  return response;
}
