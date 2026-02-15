"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

interface EventItem {
  id: string;
  title: string;
  date: string;
  description: string;
}

export default function AdminEventsPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  const loadEvents = useCallback(async () => {
    const res = await fetch("/api/events");
    if (res.ok) {
      const data = await res.json();
      setEvents(data.events || []);
    }
  }, []);

  useEffect(() => {
    fetch("/api/auth/session").then((r) => {
      if (!r.ok) router.push("/admin/login");
      else loadEvents();
    });
  }, [router, loadEvents]);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, date, description }),
    });
    if (res.ok) {
      setMessage("Veranstaltung erstellt.");
      setTitle("");
      setDate("");
      setDescription("");
      loadEvents();
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-mosque-green-700 text-white px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Veranstaltungen verwalten</h1>
        <button onClick={() => router.push("/admin")} className="text-sm hover:underline">
          ← Zurück
        </button>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="font-bold text-lg mb-4">Neue Veranstaltung</h2>
          {message && (
            <div className="bg-green-50 text-green-700 p-3 rounded-lg mb-4 text-sm">{message}</div>
          )}
          <form onSubmit={handleAdd} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Titel</label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">Datum</label>
              <input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>
            <div>
              <label htmlFor="desc" className="block text-sm font-medium text-gray-700 mb-1">Beschreibung</label>
              <textarea
                id="desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                rows={3}
                required
              />
            </div>
            <button
              type="submit"
              className="bg-mosque-green-600 text-white px-6 py-2 rounded-lg hover:bg-mosque-green-700 transition-colors"
            >
              Erstellen
            </button>
          </form>
        </div>

        {events.length > 0 && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="font-bold text-lg mb-4">Alle Veranstaltungen</h2>
            <div className="space-y-3">
              {events.map((evt) => (
                <div key={evt.id} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-mosque-green-700">{evt.title}</h3>
                    <span className="text-sm text-gray-500">{evt.date}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{evt.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
