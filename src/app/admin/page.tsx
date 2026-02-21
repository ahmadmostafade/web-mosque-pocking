"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface DashboardData {
  donations: { total: number; goal: number; percentage: number };
}

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const checkAuth = useCallback(async () => {
    const res = await fetch("/api/auth/session");
    if (!res.ok) {
      router.push("/admin/login");
      return false;
    }
    return true;
  }, [router]);

  const loadData = useCallback(async () => {
    try {
      const donRes = await fetch("/api/donations");
      const donData = await donRes.json();

      const total = donData.total?.total || 0;

      setData({
        donations: {
          total,
          goal: 60000,
          percentage: Math.min(100, Math.round((total / 60000) * 100)),
        },
      });
    } catch {
      // Silently handle errors
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth().then((ok) => {
      if (ok) loadData();
    });
  }, [checkAuth, loadData]);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Laden...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-mosque-green-700 text-white px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Admin Dashboard</h1>
        <div className="flex items-center gap-4">
          <Link href="/" className="text-sm hover:underline">
            Zur Website
          </Link>
          <button
            onClick={handleLogout}
            className="text-sm bg-white/20 px-3 py-1 rounded hover:bg-white/30 transition-colors"
          >
            Abmelden
          </button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Übersicht</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Spendenstand</h3>
            <p className="text-3xl font-bold text-mosque-green-700">
              {data?.donations.total.toLocaleString("de-DE")} €
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {data?.donations.percentage}% von 60.000 €
            </p>
          </div>
        </div>

        <h2 className="text-xl font-bold text-gray-800 mb-4">Verwaltung</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link
            href="/admin/spenden"
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <h3 className="font-bold text-mosque-green-700 mb-2">Spenden</h3>
            <p className="text-sm text-gray-600">Spendenstand verwalten und aktualisieren</p>
          </Link>

          <Link
            href="/admin/gebetszeiten"
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <h3 className="font-bold text-mosque-green-700 mb-2">Gebetszeiten</h3>
            <p className="text-sm text-gray-600">Iqamah-Zeiten anpassen</p>
          </Link>

          <Link
            href="/admin/audit"
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <h3 className="font-bold text-mosque-green-700 mb-2">Audit-Protokoll</h3>
            <p className="text-sm text-gray-600">Änderungsprotokoll einsehen</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
