"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import DonationProgressBar from "@/components/DonationProgressBar";

interface Donation {
  id: string;
  amount: number;
  source: string;
  date: string;
  donorName?: string;
  anonymous: boolean;
}

interface DonationData {
  donations: Donation[];
  total: { manual: number; stripe: number; adjustment: number; total: number };
  settings: { goalAmount: number; manualAdjustment: number };
  progress: number;
}

export default function AdminDonationsPage() {
  const [data, setData] = useState<DonationData | null>(null);
  const [amount, setAmount] = useState("");
  const [donorName, setDonorName] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [initialBetrag, setInitialBetrag] = useState("");
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" }>({ text: "", type: "success" });
  const router = useRouter();

  const loadData = useCallback(async () => {
    const res = await fetch("/api/donations");
    if (res.ok) {
      const d = await res.json();
      const currentProgress = d.progress || 0;
      setData({
        donations: d.donations || [],
        total: d.total || { manual: 0, stripe: 0, adjustment: 0, total: 0 },
        settings: d.settings || { goalAmount: 60000, manualAdjustment: 0 },
        progress: currentProgress,
      });
      setInitialBetrag(currentProgress.toString());
    }
  }, []);

  useEffect(() => {
    fetch("/api/auth/session").then((r) => {
      if (!r.ok) router.push("/admin/login");
      else loadData();
    });
  }, [router, loadData]);

  function showMessage(text: string, type: "success" | "error" = "success") {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "success" }), 4000);
  }

  async function handleSetInitial(e: React.FormEvent) {
    e.preventDefault();
    const value = parseFloat(initialBetrag);
    if (isNaN(value) || value < 0) return;
    const res = await fetch("/api/donations/progress", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ progress: value }),
    });
    if (res.ok) {
      await loadData();
      showMessage("Anfangsbetrag gespeichert.");
    } else {
      showMessage("Fehler beim Speichern.", "error");
    }
  }

  async function handleResetDonations() {
    if (!confirm("Alle Spenden löschen und Betrag auf 0 zurücksetzen?")) return;
    const res = await fetch("/api/donations/reset", { method: "POST" });
    if (res.ok) {
      await loadData();
      showMessage("Spendenliste geleert und Betrag zurückgesetzt.");
    } else {
      showMessage("Fehler beim Zurücksetzen.", "error");
    }
  }

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
      setAmount("");
      setDonorName("");
      setAnonymous(false);
      await loadData();
      showMessage("Spende erfolgreich eingetragen.");
    } else {
      showMessage("Fehler beim Eintragen.", "error");
    }
  }

  const progress = data
    ? {
        currentAmount: data.progress,
        goalAmount: data.settings.goalAmount,
        percentage: Math.min(Math.round((data.progress / data.settings.goalAmount) * 100), 100),
        remaining: Math.max(data.settings.goalAmount - data.progress, 0),
        lastUpdated: new Date().toISOString(),
      }
    : null;

  const donationCount = data?.donations.length || 0;
  const latestDonation = data?.donations[0];

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-mosque-green-700 text-white px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Spenden verwalten</h1>
        <button onClick={() => router.push("/admin")} className="text-sm hover:underline">
          ← Zurück
        </button>
      </nav>

      <div className="page-container py-8 space-y-6">
        {message.text && (
          <div className={`p-3 rounded-lg text-sm ${message.type === "error" ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"}`}>
            {message.text}
          </div>
        )}

        {/* Progress Bar */}
        {progress && (
          <DonationProgressBar progress={progress} title="Spendenfortschritt" />
        )}

        {/* Stats Row */}
        {data && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl shadow-sm p-4 text-center">
              <p className="text-xs text-gray-500 mb-1">Gesamtbetrag</p>
              <p className="text-xl font-bold text-mosque-green-700">{data.progress.toLocaleString("de-DE")} €</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-4 text-center">
              <p className="text-xs text-gray-500 mb-1">Ziel</p>
              <p className="text-xl font-bold text-gray-700">{data.settings.goalAmount.toLocaleString("de-DE")} €</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-4 text-center">
              <p className="text-xs text-gray-500 mb-1">Anzahl Spenden</p>
              <p className="text-xl font-bold text-gray-700">{donationCount}</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-4 text-center">
              <p className="text-xs text-gray-500 mb-1">Letzte Spende</p>
              <p className="text-xl font-bold text-mosque-green-700">
                {latestDonation ? `${latestDonation.amount.toLocaleString("de-DE")} €` : "–"}
              </p>
            </div>
          </div>
        )}

        {/* Initial Betrag */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="font-bold text-lg mb-1">Anfangsbetrag</h2>
          <p className="text-sm text-gray-500 mb-4">
            Setzen Sie den aktuellen Spendenstand manuell. Neue Spenden werden darauf addiert.
          </p>
          <form onSubmit={handleSetInitial} className="flex gap-3 items-end">
            <div className="flex-1">
              <label htmlFor="initialBetrag" className="block text-sm font-medium text-gray-700 mb-1">
                Betrag (€)
              </label>
              <input
                id="initialBetrag"
                type="number"
                min="0"
                step="0.01"
                value={initialBetrag}
                onChange={(e) => setInitialBetrag(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>
            <button
              type="submit"
              className="bg-mosque-green-600 text-white px-6 py-2 rounded-lg hover:bg-mosque-green-700 transition-colors"
            >
              Speichern
            </button>
          </form>
        </div>

        {/* Add Donation */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="font-bold text-lg mb-4">Neue Spende eintragen</h2>
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
        {data && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-lg">Letzte Spenden</h2>
              <button
                onClick={handleResetDonations}
                className="text-sm text-red-600 border border-red-300 px-3 py-1 rounded-lg hover:bg-red-50 transition-colors"
              >
                Liste leeren &amp; zurücksetzen
              </button>
            </div>
            {data.donations.length === 0 ? (
              <p className="text-sm text-gray-400">Keine Spenden vorhanden.</p>
            ) : (
              <div className="space-y-2">
                {data.donations.slice(0, 15).map((d) => (
                  <div key={d.id} className="flex justify-between items-center py-2 border-b last:border-0">
                    <div>
                      <span className="font-medium text-gray-800">
                        {d.anonymous ? "Anonym" : d.donorName || "Unbekannt"}
                      </span>
                      <span className="text-xs text-gray-400 ml-2">{d.date}</span>
                      <span className="text-xs text-gray-400 ml-2 capitalize">{d.source}</span>
                    </div>
                    <span className="font-bold text-mosque-green-700">{d.amount.toLocaleString("de-DE")} €</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
