import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ContactForm from "./ContactForm";

beforeEach(() => {
  vi.restoreAllMocks();
});

describe("ContactForm", () => {
  it("renders all form fields", () => {
    render(<ContactForm />);
    expect(screen.getByLabelText("Name *")).toBeInTheDocument();
    expect(screen.getByLabelText("E-Mail *")).toBeInTheDocument();
    expect(screen.getByLabelText("Betreff *")).toBeInTheDocument();
    expect(screen.getByLabelText("Nachricht *")).toBeInTheDocument();
  });

  it("shows errors for empty fields on submit", () => {
    render(<ContactForm />);
    fireEvent.click(screen.getByText("Nachricht senden"));
    expect(screen.getByText(/Namen ein/)).toBeInTheDocument();
    expect(screen.getByText(/E-Mail-Adresse ein/)).toBeInTheDocument();
  });

  it("shows success message after valid submission", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: true }),
    });

    render(<ContactForm />);

    fireEvent.change(screen.getByLabelText("Name *"), {
      target: { value: "Max Mustermann" },
    });
    fireEvent.change(screen.getByLabelText("E-Mail *"), {
      target: { value: "max@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Betreff *"), {
      target: { value: "Frage" },
    });
    fireEvent.change(screen.getByLabelText("Nachricht *"), {
      target: { value: "Hallo, ich habe eine Frage." },
    });

    fireEvent.click(screen.getByText("Nachricht senden"));

    await waitFor(() => {
      expect(screen.getByText(/Vielen Dank/)).toBeInTheDocument();
    });
  });

  it("has a hidden honeypot field", () => {
    render(<ContactForm />);
    const honeypot = document.querySelector('input[name="website"]');
    expect(honeypot).toBeInTheDocument();
    expect(honeypot).toHaveClass("hidden");
  });
});
