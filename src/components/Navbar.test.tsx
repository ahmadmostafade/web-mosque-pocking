import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Navbar from "./Navbar";

describe("Navbar", () => {
  it("renders the logo/brand", () => {
    render(<Navbar />);
    expect(screen.getByText(/IBF Pocking/)).toBeInTheDocument();
  });

  it("renders all navigation links", () => {
    render(<Navbar />);
    expect(screen.getAllByText("Startseite").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Gebetszeiten").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Spenden").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Kontakt").length).toBeGreaterThanOrEqual(1);
  });

  it("toggles mobile menu on button click", () => {
    render(<Navbar />);
    const toggleButton = screen.getByLabelText("Menü öffnen");
    fireEvent.click(toggleButton);
    expect(screen.getByLabelText("Menü schließen")).toBeInTheDocument();
  });

  it("has correct aria attributes", () => {
    render(<Navbar />);
    expect(screen.getByRole("navigation")).toHaveAttribute(
      "aria-label",
      "Hauptnavigation"
    );
  });
});
