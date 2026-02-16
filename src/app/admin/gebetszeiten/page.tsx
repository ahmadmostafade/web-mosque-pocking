"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

interface IqamahData {
  Fajr: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
  lastUpdated: string;
}

interface JummahData {
  khutba: string;
}

const PRAYER_LABELS: Record<string, string> = {
  Fajr: "Fajr",
  Dhuhr: "Dhuhr",
  Asr: "Asr",
  Maghrib: "Maghrib",
  Isha: "Isha",
};

export default function AdminPrayerTimesPage() {
  const [times, setTimes] = useState<IqamahData | null>(null);
  const [jummah, setJummah] = useState<JummahData>({ khutba: "12:30" });
  const [form, setForm] = useState<Record<string, string>>({});
  const [jummahForm, setJummahForm] = useState<JummahData>({ khutba: "12:30" });
  const [message, setMessage] = useState("");
  const router = useRouter();

  const loadTimes = useCallback(async () => {
    const res = await fetch("/api/iqamah");
    if (res.ok) {
      const data = await res.json();
      setTimes(data.times);
      const { lastUpdated, Jummah, ...rest } = data.times;
      void lastUpdated;
      void Jummah;
      setForm(rest);
    }

    // Load Jummah times
    const jummahRes = await fetch("/api/jummah");
    if (jummahRes.ok) {
      const jummahData = await jummahRes.json();
      setJummah(jummahData);
      setJummahForm(jummahData);
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
      setTimeout(() => setMessage(""), 3000);
    }
  }

  async function handleJummahSave(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/jummah", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(jummahForm),
    });
    if (res.ok) {
      setMessage("Jumuʿah-Zeit aktualisiert.");
      loadTimes();
      setTimeout(() => setMessage(""), 3000);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-mosque-green-700 text-white px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Gebetszeiten verwalten</h1>
        <button onClick={() => router.push("/admin")} className="text-sm hover:underline">
          ← Zurück
        </button>
      </nav>

      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        {message && (
          <div className="bg-green-50 text-green-700 p-3 rounded-lg text-sm">{message}</div>
        )}

        {/* Iqamah Times */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-lg font-bold text-mosque-green-700 mb-2">Iqamah-Zeiten</h2>
          <p className="text-sm text-gray-600 mb-4">
            Geben Sie die Minuten nach dem Adhan an (z.B. +15 min)
          </p>
          {times && (
            <p className="text-sm text-gray-500 mb-4">
              Letzte Aktualisierung:{" "}
              {new Date(times.lastUpdated).toLocaleString("de-DE")}
            </p>
          )}
          <form onSubmit={handleSave} className="space-y-4">
            {Object.entries(PRAYER_LABELS).map(([key, label]) => (
              <div key={key} className="flex items-center gap-4">
                <label htmlFor={key} className="w-24 text-sm font-medium text-gray-700">
                  {label}
                </label>
                <div className="flex-1 flex items-center gap-2">
                  <span className="text-gray-500">+</span>
                  <input
                    id={key}
                    type="number"
                    min="0"
                    max="60"
                    value={form[key]?.replace(/\D/g, "") || "15"}
                    onChange={(e) => setForm({ ...form, [key]: `+${e.target.value} min` })}
                    className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-center"
                  />
                  <span className="text-gray-500">min</span>
                </div>
              </div>
            ))}
            <button
              type="submit"
              className="w-full bg-mosque-green-600 text-white px-6 py-2 rounded-lg hover:bg-mosque-green-700 transition-colors"
            >
              Iqamah-Zeiten speichern
            </button>
          </form>
        </div>

        {/* Jummah Times */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-lg font-bold text-mosque-green-700 mb-2">Jumuʿah (Freitagsgebet)</h2>
          <p className="text-sm text-gray-600 mb-4">
            Khutba-Beginn am Freitag
          </p>
          <form onSubmit={handleJummahSave} className="space-y-4">
            <div className="flex items-center gap-4">
              <label htmlFor="khutba" className="w-24 text-sm font-medium text-gray-700">
                Khutba
              </label>
              <input
                id="khutba"
                type="time"
                value={jummahForm.khutba}
                onChange={(e) => setJummahForm({ khutba: e.target.value })}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-mosque-green-600 text-white px-6 py-2 rounded-lg hover:bg-mosque-green-700 transition-colors"
            >
              Jumuʿah-Zeit speichern
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
