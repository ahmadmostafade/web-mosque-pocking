import { NextRequest, NextResponse } from "next/server";
import { validateContactForm } from "@/lib/validation";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Honeypot check
    if (body.website) {
      return NextResponse.json({ success: true }); // Silent fail for bots
    }

    const validation = validateContactForm({
      name: body.name || "",
      email: body.email || "",
      subject: body.subject || "",
      message: body.message || "",
    });

    if (!validation.valid) {
      return NextResponse.json(
        { success: false, errors: validation.errors },
        { status: 400 }
      );
    }

    // In production: send email via Resend, Nodemailer, etc.
    // For now, log the message
    console.log("Contact form submission:", {
      name: body.name,
      email: body.email,
      subject: body.subject,
      message: body.message,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      message: "Nachricht erfolgreich gesendet.",
    });
  } catch {
    return NextResponse.json(
      { success: false, message: "Ein Fehler ist aufgetreten." },
      { status: 500 }
    );
  }
}
