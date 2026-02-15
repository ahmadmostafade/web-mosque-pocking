import { describe, it, expect, beforeEach } from "vitest";
import { getBlogPosts, addBlogPost, resetBlogStore } from "./blog-store";

describe("blog-store", () => {
  beforeEach(() => {
    resetBlogStore();
  });

  it("starts empty after reset", () => {
    expect(getBlogPosts()).toHaveLength(0);
  });

  it("adds a blog post", () => {
    const post = addBlogPost({
      title: "Test Post",
      content: "Content here",
      date: "2026-02-15",
    });
    expect(post.id).toBeTruthy();
    expect(getBlogPosts()).toHaveLength(1);
  });

  it("returns posts sorted by date descending", () => {
    addBlogPost({ title: "Old", content: "Old post", date: "2026-01-01" });
    addBlogPost({ title: "New", content: "New post", date: "2026-03-01" });

    const posts = getBlogPosts();
    expect(posts[0].title).toBe("New");
    expect(posts[1].title).toBe("Old");
  });
});
