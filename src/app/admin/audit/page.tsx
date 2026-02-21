"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

interface AuditEntry {
  id: string;
  timestamp: string;
  username: string;
  action: string;
  resource: string;
  details?: string;
}

export default function AdminAuditPage() {
  const [entries, setEntries] = useState<AuditEntry[]>([]);
  const router = useRouter();

  const loadLog = useCallback(async () => {
    const res = await fetch("/api/audit");
    if (res.ok) {
      const data = await res.json();
      setEntries(data.log || []);
    }
  }, []);

  useEffect(() => {
    fetch("/api/auth/session").then((r) => {
      if (!r.ok) router.push("/admin/login");
      else loadLog();
    });
  }, [router, loadLog]);

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-mosque-green-700 text-white px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Audit-Protokoll</h1>
        <button onClick={() => router.push("/admin")} className="text-sm hover:underline">
          ← Zurück
        </button>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {entries.length === 0 ? (
          <p className="text-gray-500">Noch keine Einträge vorhanden.</p>
        ) : (
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Zeit</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Benutzer</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Aktion</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Ressource</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {entries.map((entry) => (
                  <tr key={entry.id}>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {new Date(entry.timestamp).toLocaleString("de-DE")}
                    </td>
                    <td className="px-4 py-3">{entry.username}</td>
                    <td className="px-4 py-3">{entry.action}</td>
                    <td className="px-4 py-3">{entry.resource}</td>
                    <td className="px-4 py-3 text-gray-500">{entry.details || "–"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
