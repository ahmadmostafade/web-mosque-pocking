import { describe, it, expect } from "vitest";
import { filterMedia, MediaItem } from "./media";

const items: MediaItem[] = [
  { id: "1", src: "/a.jpg", alt: "A", category: "vorher", type: "image" },
  { id: "2", src: "/b.jpg", alt: "B", category: "nachher", type: "image" },
  { id: "3", src: "/c.jpg", alt: "C", category: "vorher", type: "image" },
  { id: "4", src: "/d.mp4", alt: "D", category: "veranstaltungen", type: "video" },
];

describe("filterMedia", () => {
  it("returns all items for 'alle' category", () => {
    expect(filterMedia(items, "alle")).toHaveLength(4);
  });

  it("filters by vorher category", () => {
    const result = filterMedia(items, "vorher");
    expect(result).toHaveLength(2);
    expect(result.every((i) => i.category === "vorher")).toBe(true);
  });

  it("filters by nachher category", () => {
    expect(filterMedia(items, "nachher")).toHaveLength(1);
  });

  it("returns empty for non-matching category", () => {
    expect(filterMedia(items, "allgemein")).toHaveLength(0);
  });
});
