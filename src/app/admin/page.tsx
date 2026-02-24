"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import DonationProgressBar from "@/components/DonationProgressBar";

type HomeLayout = "v1" | "v2";

interface DashboardData {
  donations: { total: number; goal: number; percentage: number };
}

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [homeLayout, setHomeLayoutState] = useState<HomeLayout>("v2");
  const [layoutSaving, setLayoutSaving] = useState(false);
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

      const currentAmount = donData.progress || donData.total?.total || 0;
      const goalAmount = donData.settings?.goalAmount || 60000;

      setData({
        donations: {
          total: currentAmount,
          goal: goalAmount,
          percentage: Math.min(100, Math.round((currentAmount / goalAmount) * 100)),
        },
      });

      const layoutRes = await fetch("/api/home-layout");
      const layoutData = await layoutRes.json();
      setHomeLayoutState(layoutData.layout ?? "v2");
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

  async function handleLayoutChange(layout: HomeLayout) {
    setLayoutSaving(true);
    await fetch("/api/home-layout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ layout }),
    });
    setHomeLayoutState(layout);
    setLayoutSaving(false);
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

      <div className="page-container py-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Übersicht</h2>

        {/* Progress Bar */}
        {data && (
          <div className="mb-6">
            <DonationProgressBar
              progress={{
                currentAmount: data.donations.total,
                goalAmount: data.donations.goal,
                percentage: data.donations.percentage,
                remaining: Math.max(data.donations.goal - data.donations.total, 0),
                lastUpdated: new Date().toISOString(),
              }}
              title="Spendenfortschritt"
            />
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-5">
            <p className="text-xs text-gray-500 mb-1">Gesammelt</p>
            <p className="text-2xl font-bold text-mosque-green-700">
              {data?.donations.total.toLocaleString("de-DE")} €
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-5">
            <p className="text-xs text-gray-500 mb-1">Ziel</p>
            <p className="text-2xl font-bold text-gray-700">
              {data?.donations.goal.toLocaleString("de-DE")} €
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-5 col-span-2 md:col-span-1">
            <p className="text-xs text-gray-500 mb-1">Fortschritt</p>
            <p className="text-2xl font-bold text-mosque-green-700">
              {data?.donations.percentage} %
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

          <Link
            href="/admin/passwort"
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <h3 className="font-bold text-mosque-green-700 mb-2">Passwort ändern</h3>
            <p className="text-sm text-gray-600">Admin-Passwort aktualisieren</p>
          </Link>
        </div>

        {/* Home Layout Toggle */}
        <div className="mt-8 bg-white rounded-xl shadow-md p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-1">Startseiten-Layout</h2>
          <p className="text-sm text-gray-500 mb-5">Wählen Sie, welche Version der Startseite angezeigt wird.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {(["v1", "v2"] as HomeLayout[]).map((v) => (
              <button
                key={v}
                onClick={() => handleLayoutChange(v)}
                disabled={layoutSaving}
                className={`relative rounded-xl border-2 p-5 text-left transition-all duration-200 ${
                  homeLayout === v
                    ? "border-mosque-green-600 bg-mosque-green-50"
                    : "border-gray-200 hover:border-mosque-green-300 bg-white"
                }`}
              >
                {homeLayout === v && (
                  <span className="absolute top-3 right-3 text-xs font-semibold bg-mosque-green-600 text-white px-2 py-0.5 rounded-full">
                    Aktiv
                  </span>
                )}
                <p className="font-bold text-mosque-green-800 mb-1">
                  {v === "v1" ? "Version 1 – Klassisch" : "Version 2 – Modern"}
                </p>
                <p className="text-sm text-gray-500">
                  {v === "v1"
                    ? "Einfaches Hero-Banner, Spendenfortschritt, Gebetszeiten & Ayah."
                    : "Vollbild-Hero mit Foto, Stats-Leiste, Galerie-Vorschau & mehr."}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
