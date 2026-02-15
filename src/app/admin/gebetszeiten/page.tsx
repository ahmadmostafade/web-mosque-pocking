"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

interface IqamahData {
  Fajr: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
  Jummah: string;
  lastUpdated: string;
}

const PRAYER_LABELS: Record<string, string> = {
  Fajr: "Fajr",
  Dhuhr: "Dhuhr",
  Asr: "Asr",
  Maghrib: "Maghrib",
  Isha: "Isha",
  Jummah: "Jumuʿah",
};

export default function AdminPrayerTimesPage() {
  const [times, setTimes] = useState<IqamahData | null>(null);
  const [form, setForm] = useState<Record<string, string>>({});
  const [message, setMessage] = useState("");
  const router = useRouter();

  const loadTimes = useCallback(async () => {
    const res = await fetch("/api/iqamah");
    if (res.ok) {
      const data = await res.json();
      setTimes(data.times);
      const { lastUpdated, ...rest } = data.times;
      void lastUpdated;
      setForm(rest);
    }
  }, []);

  useEffect(() => {
    fetch("/api/auth/session").then((r) => {
      if (!r.ok) router.push("/admin/login");
      else loadTimes();
    });
  }, [router, loadTimes]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/iqamah", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setMessage("Iqamah-Zeiten aktualisiert.");
      loadTimes();
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-mosque-green-700 text-white px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Iqamah-Zeiten verwalten</h1>
        <button onClick={() => router.push("/admin")} className="text-sm hover:underline">
          ← Zurück
        </button>
      </nav>

      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-md p-6">
          {message && (
            <div className="bg-green-50 text-green-700 p-3 rounded-lg mb-4 text-sm">{message}</div>
          )}
          {times && (
            <p className="text-sm text-gray-500 mb-4">
              Letzte Aktualisierung:{" "}
              {new Date(times.lastUpdated).toLocaleString("de-DE")}
            </p>
          )}
          <form onSubmit={handleSave} className="space-y-4">
            {Object.entries(PRAYER_LABELS).map(([key, label]) => (
              <div key={key}>
                <label htmlFor={key} className="block text-sm font-medium text-gray-700 mb-1">
                  {label}
                </label>
                <input
                  id={key}
                  type="text"
                  value={form[key] || ""}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  placeholder="z.B. 13:00 oder +10 min"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            ))}
            <button
              type="submit"
              className="bg-mosque-green-600 text-white px-6 py-2 rounded-lg hover:bg-mosque-green-700 transition-colors"
            >
              Speichern
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
