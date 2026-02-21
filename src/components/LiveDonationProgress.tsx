"use client";

import { useEffect, useState } from "react";
import DonationProgressBar from "./DonationProgressBar";

interface Props {
  initialProgress: {
    currentAmount: number;
    goalAmount: number;
    percentage: number;
    remaining: number;
    lastUpdated: string;
  };
}

export default function LiveDonationProgress({ initialProgress }: Props) {
  const [progress, setProgress] = useState(initialProgress);

  async function load() {
    const res = await fetch("/api/donations");
    if (res.ok) {
      const data = await res.json();
      const currentAmount = data.progress || 0;
      const goalAmount = data.settings?.goalAmount || 60000;
      setProgress({
        currentAmount,
        goalAmount,
        percentage: Math.min(Math.round((currentAmount / goalAmount) * 100), 100),
        remaining: Math.max(goalAmount - currentAmount, 0),
        lastUpdated: new Date().toISOString(),
      });
    }
  }

  useEffect(() => {
    const interval = setInterval(load, 30000); // refresh every 30s
    return () => clearInterval(interval);
  }, []);

  return <DonationProgressBar progress={progress} title="Spendenfortschritt" />;
}
