import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import PrayerTimesCard from "./PrayerTimesCard";
import { PrayerTimesData } from "@/lib/prayer-times";

const mockTimes: PrayerTimesData = {
  Fajr: "05:30",
  Sunrise: "07:00",
  Dhuhr: "12:30",
  Asr: "15:30",
  Maghrib: "18:00",
  Isha: "19:30",
};

describe("PrayerTimesCard", () => {
  it("renders all prayer times", () => {
    render(<PrayerTimesCard times={mockTimes} />);
    expect(screen.getByText("05:30")).toBeInTheDocument();
    expect(screen.getByText("12:30")).toBeInTheDocument();
    expect(screen.getByText("15:30")).toBeInTheDocument();
    expect(screen.getByText("18:00")).toBeInTheDocument();
    expect(screen.getByText("19:30")).toBeInTheDocument();
  });

  it("renders prayer names in German and Arabic", () => {
    render(<PrayerTimesCard times={mockTimes} />);
    expect(screen.getByText("Fajr")).toBeInTheDocument();
    expect(screen.getByText("الفجر")).toBeInTheDocument();
  });

  it("highlights next prayer", () => {
    render(
      <PrayerTimesCard
        times={mockTimes}
        nextPrayer={{ name: "Dhuhr", time: "12:30" }}
      />
    );
    // The Dhuhr row should have the highlight class (text-mosque-green-700)
    const dhuhrTime = screen.getByText("12:30");
    expect(dhuhrTime.className).toContain("text-mosque-green-700");
  });

  it("shows error message when times are null", () => {
    render(<PrayerTimesCard times={null} />);
    expect(
      screen.getByText(/konnten nicht geladen werden/)
    ).toBeInTheDocument();
  });
});
