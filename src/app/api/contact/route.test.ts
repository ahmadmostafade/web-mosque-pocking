import { describe, it, expect } from "vitest";
import { POST } from "./route";
import { NextRequest } from "next/server";

function createRequest(body: Record<string, unknown>) {
  return new NextRequest("http://localhost:3000/api/contact", {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  });
}

describe("POST /api/contact", () => {
  it("returns success for valid submission", async () => {
    const req = createRequest({
      name: "Max Mustermann",
      email: "max@example.com",
      subject: "Frage",
      message: "Hallo, ich habe eine Frage.",
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
  });

  it("returns 400 for invalid data", async () => {
    const req = createRequest({
      name: "",
      email: "invalid",
      subject: "",
      message: "",
    });

    const res = await POST(req);
    expect(res.status).toBe(400);

    const data = await res.json();
    expect(data.success).toBe(false);
    expect(data.errors).toBeTruthy();
  });

  it("silently accepts honeypot submissions", async () => {
    const req = createRequest({
      name: "Bot",
      email: "bot@spam.com",
      subject: "Spam",
      message: "Buy now",
      website: "http://spam.com",
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
  });
});
