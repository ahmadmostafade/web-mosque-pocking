"use client";

import { useEffect, useState } from "react";
import DonationProgressBar from "./DonationProgressBar";

interface ProgressData {
  currentAmount: number;
  goalAmount: number;
  percentage: number;
  remaining: number;
  lastUpdated: string;
}

interface Props {
  initialProgress: ProgressData;
}

export default function LiveDonationProgress({ initialProgress }: Props) {
  const [progress, setProgress] = useState(initialProgress);

  // Fetch once on mount to get the latest from DB (handles page cache)
  useEffect(() => {
    fetch("/api/donations")
      .then((r) => r.json())
      .then((data) => {
        const currentAmount = data.progress || 0;
        const goalAmount = data.settings?.goalAmount || 60000;
        setProgress({
          currentAmount,
          goalAmount,
          percentage: Math.min(Math.round((currentAmount / goalAmount) * 100), 100),
          remaining: Math.max(goalAmount - currentAmount, 0),
          lastUpdated: new Date().toISOString(),
        });
      })
      .catch(() => {/* keep initial */});
  }, []);

  return <DonationProgressBar progress={progress} title="Spendenfortschritt" />;
}
