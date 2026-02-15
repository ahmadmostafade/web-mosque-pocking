import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import MediaGallery from "./MediaGallery";
import { MediaItem } from "@/lib/media";

const items: MediaItem[] = [
  { id: "1", src: "/a.jpg", alt: "Vorher Bild", category: "vorher", type: "image" },
  { id: "2", src: "/b.jpg", alt: "Nachher Bild", category: "nachher", type: "image" },
  { id: "3", src: "/c.mp4", alt: "Event Video", category: "veranstaltungen", type: "video" },
];

describe("MediaGallery", () => {
  it("renders all category filter buttons", () => {
    render(<MediaGallery items={items} />);
    expect(screen.getByText("Alle")).toBeInTheDocument();
    expect(screen.getByText("Vorher")).toBeInTheDocument();
    expect(screen.getByText("Nachher")).toBeInTheDocument();
  });

  it("shows all items by default", () => {
    render(<MediaGallery items={items} />);
    expect(screen.getByAltText("Vorher Bild")).toBeInTheDocument();
    expect(screen.getByAltText("Nachher Bild")).toBeInTheDocument();
  });

  it("filters items by category", () => {
    render(<MediaGallery items={items} />);
    fireEvent.click(screen.getByText("Vorher"));
    expect(screen.getByAltText("Vorher Bild")).toBeInTheDocument();
    expect(screen.queryByAltText("Nachher Bild")).not.toBeInTheDocument();
  });

  it("opens lightbox on image click", () => {
    render(<MediaGallery items={items} />);
    fireEvent.click(screen.getByLabelText("Bild vergrößern: Vorher Bild"));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByLabelText("Schließen")).toBeInTheDocument();
  });

  it("closes lightbox on close button click", () => {
    render(<MediaGallery items={items} />);
    fireEvent.click(screen.getByLabelText("Bild vergrößern: Vorher Bild"));
    fireEvent.click(screen.getByLabelText("Schließen"));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("shows empty message when no items match", () => {
    render(<MediaGallery items={items} />);
    fireEvent.click(screen.getByText("Allgemein"));
    expect(screen.getByText(/Keine Medien/)).toBeInTheDocument();
  });

  it("renders video elements for video type", () => {
    render(<MediaGallery items={items} />);
    const video = screen.getByLabelText("Event Video");
    expect(video.tagName).toBe("VIDEO");
  });
});
