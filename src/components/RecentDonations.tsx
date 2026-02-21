"use client";

import { useEffect, useState } from "react";

interface Donation {
  id: string;
  amount: number;
  donorName?: string;
  anonymous: boolean;
  date: string;
}

export default function RecentDonations() {
  const [donations, setDonations] = useState<Donation[]>([]);

  async function load() {
    const res = await fetch("/api/donations");
    if (res.ok) {
      const data = await res.json();
      setDonations((data.donations || []).slice(0, 10));
    }
  }

  useEffect(() => {
    load();
    const interval = setInterval(load, 30000); // refresh every 30s
    return () => clearInterval(interval);
  }, []);

  if (donations.length === 0) return null;

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mt-8">
      <h2 className="text-xl font-bold text-mosque-green-700 mb-4">Letzte Spenden</h2>
      <div className="space-y-2">
        {donations.map((d) => (
          <div
            key={d.id}
            className="flex justify-between items-center py-2 border-b last:border-0"
          >
            <div>
              <span className="font-medium text-gray-800">
                {d.anonymous ? "Anonym" : d.donorName || "Unbekannt"}
              </span>
              <span className="text-sm text-gray-400 ml-2">
                {new Date(d.date).toLocaleDateString("de-DE")}
              </span>
            </div>
            <span className="font-bold text-mosque-green-700">
              {d.amount.toLocaleString("de-DE")} €
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
