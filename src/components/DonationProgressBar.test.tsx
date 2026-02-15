import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import DonationProgressBar from "./DonationProgressBar";
import { DonationProgress } from "@/lib/donations";

const mockProgress: DonationProgress = {
  currentAmount: 22000,
  goalAmount: 60000,
  percentage: 37,
  remaining: 38000,
  lastUpdated: "2026-02-15T10:00:00.000Z",
};

describe("DonationProgressBar", () => {
  it("displays current amount and goal", () => {
    render(<DonationProgressBar progress={mockProgress} />);
    expect(screen.getByText(/22\.000,00/)).toBeInTheDocument();
    expect(screen.getByText(/60\.000,00/)).toBeInTheDocument();
  });

  it("displays percentage", () => {
    render(<DonationProgressBar progress={mockProgress} />);
    expect(screen.getByText("37%")).toBeInTheDocument();
  });

  it("displays remaining amount", () => {
    render(<DonationProgressBar progress={mockProgress} />);
    expect(screen.getByText(/38\.000,00/)).toBeInTheDocument();
  });

  it("has correct progressbar role and aria attributes", () => {
    render(<DonationProgressBar progress={mockProgress} />);
    const progressbar = screen.getByRole("progressbar");
    expect(progressbar).toHaveAttribute("aria-valuenow", "37");
    expect(progressbar).toHaveAttribute("aria-valuemin", "0");
    expect(progressbar).toHaveAttribute("aria-valuemax", "100");
  });

  it("hides details when showDetails is false", () => {
    render(
      <DonationProgressBar progress={mockProgress} showDetails={false} />
    );
    expect(screen.queryByText(/benötigt/)).not.toBeInTheDocument();
  });
});
