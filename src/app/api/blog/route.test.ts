import { describe, it, expect, beforeEach } from "vitest";
import { GET, POST } from "./route";
import { resetBlogStore } from "@/lib/blog-store";

function jsonRequest(body: unknown) {
  return new Request("http://localhost/api/blog", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("Blog API", () => {
  beforeEach(() => resetBlogStore());

  it("GET returns empty posts after reset", async () => {
    const res = await GET();
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.posts).toEqual([]);
  });

  it("POST creates blog post with valid data", async () => {
    const res = await POST(
      jsonRequest({
        title: "Update",
        content: "Renovierung läuft gut.",
      }) as never
    );
    const data = await res.json();
    expect(res.status).toBe(201);
    expect(data.post.title).toBe("Update");
    expect(data.post.date).toBeTruthy();
  });

  it("POST rejects missing fields", async () => {
    const res = await POST(
      jsonRequest({ title: "Test" }) as never
    );
    expect(res.status).toBe(400);
  });
});
