import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import DonationForm from "./DonationForm";

describe("DonationForm", () => {
  it("renders preset amount buttons", () => {
    render(<DonationForm />);
    expect(screen.getByText("10 €")).toBeInTheDocument();
    expect(screen.getByText("50 €")).toBeInTheDocument();
    expect(screen.getByText("100 €")).toBeInTheDocument();
  });

  it("selects preset amount on click", () => {
    render(<DonationForm />);
    fireEvent.click(screen.getByText("50 €"));
    const input = screen.getByLabelText("Betrag (€)") as HTMLInputElement;
    expect(input.value).toBe("50");
  });

  it("shows error for empty amount on submit", () => {
    render(<DonationForm />);
    fireEvent.click(screen.getByText("Mit PayPal spenden"));
    expect(screen.getByText(/gültigen Betrag/)).toBeInTheDocument();
  });

  it("has anonymous checkbox", () => {
    render(<DonationForm />);
    expect(screen.getByLabelText("Anonym spenden")).toBeInTheDocument();
  });

  it("shows Verwendungszweck", () => {
    render(<DonationForm />);
    expect(screen.getByText(/Moscheekauf/)).toBeInTheDocument();
  });
});
