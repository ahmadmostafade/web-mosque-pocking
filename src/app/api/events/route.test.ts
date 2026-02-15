import { describe, it, expect, beforeEach } from "vitest";
import { GET, POST } from "./route";
import { resetEventsStore } from "@/lib/events-store";

function jsonRequest(body: unknown) {
  return new Request("http://localhost/api/events", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("Events API", () => {
  beforeEach(() => resetEventsStore());

  it("GET returns empty events after reset", async () => {
    const res = await GET();
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.events).toEqual([]);
  });

  it("POST creates event with valid data", async () => {
    const res = await POST(
      jsonRequest({
        title: "Iftar",
        date: "2026-03-15",
        description: "Gemeinsames Fastenbrechen",
      }) as never
    );
    const data = await res.json();
    expect(res.status).toBe(201);
    expect(data.event.title).toBe("Iftar");
  });

  it("POST rejects missing fields", async () => {
    const res = await POST(
      jsonRequest({ title: "Test" }) as never
    );
    expect(res.status).toBe(400);
  });

  it("POST rejects invalid date format", async () => {
    const res = await POST(
      jsonRequest({
        title: "Test",
        date: "15-03-2026",
        description: "Desc",
      }) as never
    );
    expect(res.status).toBe(400);
  });
});
