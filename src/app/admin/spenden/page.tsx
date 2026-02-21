"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

interface DonationData {
  donations: Array<{
    id: string;
    amount: number;
    source: string;
    date: string;
    donorName?: string;
    anonymous: boolean;
  }>;
  total: { manual: number; stripe: number; adjustment: number; total: number };
  settings: { goalAmount: number; manualAdjustment: number };
  progress: number;
}

export default function AdminDonationsPage() {
  const [data, setData] = useState<DonationData | null>(null);
  const [amount, setAmount] = useState("");
  const [donorName, setDonorName] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [progress, setProgress] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  const loadData = useCallback(async () => {
    const res = await fetch("/api/donations");
    if (res.ok) {
      const donationData = await res.json();
      const currentProgress = donationData.progress || donationData.total?.total || 0;
      setData({
        donations: donationData.donations || [],
        total: donationData.total || { manual: 0, stripe: 0, adjustment: 0, total: 0 },
        settings: donationData.settings || { goalAmount: 60000, manualAdjustment: 0 },
        progress: currentProgress,
      });
      setProgress(currentProgress.toString());
    }
  }, []);

  useEffect(() => {
    fetch("/api/auth/session").then((r) => {
      if (!r.ok) router.push("/admin/login");
      else loadData();
    });
  }, [router, loadData]);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/donations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: parseFloat(amount),
        source: "manual",
        donorName: anonymous ? undefined : donorName,
        anonymous,
      }),
    });
    if (res.ok) {
      setMessage("Spende erfolgreich hinzugefügt.");
      setAmount("");
      setDonorName("");
      setAnonymous(false);
      loadData();
      setTimeout(() => setMessage(""), 3000);
    }
  }

  async function handleUpdateProgress(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/donations/progress", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ progress: parseFloat(progress) }),
    });
    if (res.ok) {
      setMessage("Spendenstand aktualisiert.");
      loadData();
      setTimeout(() => setMessage(""), 3000);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-mosque-green-700 text-white px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Spenden verwalten</h1>
        <button onClick={() => router.push("/admin")} className="text-sm hover:underline">
          ← Zurück
        </button>
      </nav>

      <div className="page-container py-8 space-y-6">
        {message && (
          <div className="bg-green-50 text-green-700 p-3 rounded-lg text-sm">{message}</div>
        )}

        {/* Current Progress */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="font-bold text-lg mb-4">Aktueller Spendenstand (Öffentlich)</h2>
          <form onSubmit={handleUpdateProgress} className="space-y-4">
            <div>
              <label htmlFor="progress" className="block text-sm font-medium text-gray-700 mb-1">
                Aktueller Betrag (€)
              </label>
              <input
                id="progress"
                type="number"
                min="0"
                step="0.01"
                value={progress}
                onChange={(e) => setProgress(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Dieser Betrag wird auf der Spendenseite angezeigt
              </p>
            </div>
            <button
              type="submit"
              className="bg-mosque-green-600 text-white px-6 py-2 rounded-lg hover:bg-mosque-green-700 transition-colors"
            >
              Spendenstand aktualisieren
            </button>
          </form>
        </div>

        {/* Internal Tracking */}
        {data && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="font-bold text-lg mb-2">Interne Übersicht</h2>
            <p className="text-2xl font-bold text-mosque-green-700">
              {data.total.total.toLocaleString("de-DE")} € / 60.000 €
            </p>
            <p className="text-sm text-gray-500">
              Manuell: {data.total.manual.toLocaleString("de-DE")} € | Stripe:{" "}
              {data.total.stripe.toLocaleString("de-DE")} € | Anpassung:{" "}
              {data.total.adjustment.toLocaleString("de-DE")} €
            </p>
          </div>
        )}

        {/* Add Donation */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="font-bold text-lg mb-4">Neue Spende eintragen (Intern)</h2>
          <form onSubmit={handleAdd} className="space-y-4">
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                Betrag (€)
              </label>
              <input
                id="amount"
                type="number"
                min="1"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                id="anonymous"
                type="checkbox"
                checked={anonymous}
                onChange={(e) => setAnonymous(e.target.checked)}
              />
              <label htmlFor="anonymous" className="text-sm text-gray-700">Anonyme Spende</label>
            </div>
            {!anonymous && (
              <div>
                <label htmlFor="donorName" className="block text-sm font-medium text-gray-700 mb-1">
                  Spendername
                </label>
                <input
                  id="donorName"
                  type="text"
                  value={donorName}
                  onChange={(e) => setDonorName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            )}
            <button
              type="submit"
              className="bg-mosque-green-600 text-white px-6 py-2 rounded-lg hover:bg-mosque-green-700 transition-colors"
            >
              Spende eintragen
            </button>
          </form>
        </div>

        {/* Recent Donations */}
        {data && data.donations.length > 0 && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="font-bold text-lg mb-4">Letzte Spenden</h2>
            <div className="space-y-2">
              {data.donations.slice(0, 10).map((d) => (
                <div key={d.id} className="flex justify-between items-center py-2 border-b last:border-0">
                  <div>
                    <span className="font-medium">{d.anonymous ? "Anonym" : d.donorName || "Unbekannt"}</span>
                    <span className="text-sm text-gray-500 ml-2">{d.date}</span>
                  </div>
                  <span className="font-bold text-mosque-green-700">{d.amount.toLocaleString("de-DE")} €</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
