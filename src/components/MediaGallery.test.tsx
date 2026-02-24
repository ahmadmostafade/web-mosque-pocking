import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import MediaGallery from "./MediaGallery";
import { MediaItem, MEDIA_CATEGORIES } from "@/lib/media";

const items: MediaItem[] = [
  { id: "1", src: "/a.jpg", alt: "Vorher Bild", category: "vorher", type: "image" },
  { id: "2", src: "/b.jpg", alt: "Nachher Bild", category: "nachher", type: "image" },
  { id: "3", src: "/c.mp4", alt: "Event Video", category: "veranstaltungen", type: "video" },
];

const categories = [...MEDIA_CATEGORIES];

describe("MediaGallery", () => {
  it("renders all category filter buttons", () => {
    render(<MediaGallery items={items} categories={categories} />);
    expect(screen.getByText("Alle")).toBeInTheDocument();
    expect(screen.getByText("Vorher")).toBeInTheDocument();
    expect(screen.getByText("Nachher")).toBeInTheDocument();
  });

  it("shows all items by default", () => {
    render(<MediaGallery items={items} categories={categories} />);
    expect(screen.getByAltText("Vorher Bild")).toBeInTheDocument();
    expect(screen.getByAltText("Nachher Bild")).toBeInTheDocument();
  });

  it("filters items by category", () => {
    render(<MediaGallery items={items} categories={categories} />);
    fireEvent.click(screen.getByText("Vorher"));
    expect(screen.getByAltText("Vorher Bild")).toBeInTheDocument();
    expect(screen.queryByAltText("Nachher Bild")).not.toBeInTheDocument();
  });

  it("opens lightbox on image click", () => {
    render(<MediaGallery items={items} categories={categories} />);
    fireEvent.click(screen.getByRole("button", { name: "Vorher Bild" }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByLabelText("Schließen")).toBeInTheDocument();
  });

  it("closes lightbox on close button click", () => {
    render(<MediaGallery items={items} categories={categories} />);
    fireEvent.click(screen.getByRole("button", { name: "Vorher Bild" }));
    fireEvent.click(screen.getByLabelText("Schließen"));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("shows empty message when no items match", () => {
    render(<MediaGallery items={items} categories={categories} />);
    fireEvent.click(screen.getByText("Allgemein"));
    expect(screen.getByText(/Keine Medien/)).toBeInTheDocument();
  });

  it("renders video elements for video type", () => {
    render(<MediaGallery items={items} categories={categories} />);
    // The video item renders as a button with aria-label matching the alt
    const videoButton = screen.getByRole("button", { name: "Event Video" });
    expect(videoButton).toBeInTheDocument();
    const video = videoButton.querySelector("video");
    expect(video).not.toBeNull();
  });
});
