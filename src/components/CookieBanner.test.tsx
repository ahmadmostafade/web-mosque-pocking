import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import CookieBanner from "./CookieBanner";

describe("CookieBanner", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("shows banner when no consent stored", () => {
    render(<CookieBanner />);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Akzeptieren")).toBeInTheDocument();
    expect(screen.getByText("Ablehnen")).toBeInTheDocument();
  });

  it("hides banner after accepting", () => {
    render(<CookieBanner />);
    fireEvent.click(screen.getByText("Akzeptieren"));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(localStorage.getItem("cookie-consent")).toBe("accepted");
  });

  it("hides banner after rejecting", () => {
    render(<CookieBanner />);
    fireEvent.click(screen.getByText("Ablehnen"));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(localStorage.getItem("cookie-consent")).toBe("rejected");
  });

  it("does not show banner when consent already stored", () => {
    localStorage.setItem("cookie-consent", "accepted");
    render(<CookieBanner />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("links to Datenschutzerklärung", () => {
    render(<CookieBanner />);
    const link = screen.getByText("Datenschutzerklärung");
    expect(link).toHaveAttribute("href", "/datenschutz");
  });
});
