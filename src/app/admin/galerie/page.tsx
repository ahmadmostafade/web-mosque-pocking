"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import type { MediaItem } from "@/lib/media";
import { MEDIA_CATEGORIES } from "@/lib/media";

const UPLOAD_CATEGORIES = MEDIA_CATEGORIES.filter((c) => c.value !== "alle");
const MAX_SIDE = 1920;

/** Shrink a photo in the browser (max 1920px, JPEG) so uploads are fast and pages load quickly. */
async function compressImage(file: File): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#fff"; // transparent PNGs get a white background
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  return new Promise((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("toBlob failed"))), "image/jpeg", 0.85)
  );
}

export default function AdminGalleryPage() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [category, setCategory] = useState<string>("allgemein");
  const [caption, setCaption] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [inputKey, setInputKey] = useState(0);

  const load = useCallback(async () => {
    const res = await fetch("/api/gallery", { cache: "no-store" });
    if (res.ok) setItems((await res.json()).items);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    if (files.length === 0) return;
    setBusy(true);
    setError("");
    const failed: string[] = [];

    for (let i = 0; i < files.length; i++) {
      setStatus(`Lade hoch ${i + 1} von ${files.length} …`);
      try {
        const body = new FormData();
        body.append("file", await compressImage(files[i]), "image.jpg");
        body.append("category", category);
        body.append("caption", caption);
        const res = await fetch("/api/gallery", { method: "POST", body });
        if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error);
      } catch {
        failed.push(files[i].name);
      }
    }

    setStatus("");
    if (failed.length) setError(`Fehlgeschlagen: ${failed.join(", ")}`);
    setFiles([]);
    setCaption("");
    setInputKey((k) => k + 1);
    setBusy(false);
    load();
  }

  async function handleDelete(item: MediaItem) {
    if (!confirm("Dieses Foto wirklich löschen?")) return;
    const res = await fetch(item.src, { method: "DELETE" });
    if (res.ok) setItems((prev) => prev.filter((i) => i.id !== item.id));
    else setError("Löschen fehlgeschlagen.");
  }

  const labelOf = (v: string) => UPLOAD_CATEGORIES.find((c) => c.value === v)?.label ?? v;

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-mosque-green-700 text-white px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Galerie verwalten</h1>
        <Link href="/admin" className="text-sm hover:underline">
          ← Zurück
        </Link>
      </nav>

      <div className="page-container py-8 space-y-8">
        <form onSubmit={handleUpload} className="bg-white rounded-xl shadow-md p-6 space-y-4">
          <h2 className="text-lg font-bold text-gray-800">Fotos hochladen</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fotos (mehrere möglich)</label>
            <input
              key={inputKey}
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => setFiles(Array.from(e.target.files ?? []))}
              className="block w-full text-sm text-gray-600 file:mr-3 file:rounded-lg file:border-0 file:bg-mosque-green-50 file:px-4 file:py-2 file:text-mosque-green-700 hover:file:bg-mosque-green-100"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kategorie</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-mosque-green-500"
              >
                {UPLOAD_CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Beschreibung (optional)</label>
              <input
                type="text"
                maxLength={200}
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="z. B. Freitagsgebet März 2026"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-mosque-green-500"
              />
            </div>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={busy || files.length === 0}
            className="bg-mosque-green-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-mosque-green-700 disabled:opacity-50 transition-colors"
          >
            {busy ? status : files.length > 1 ? `${files.length} Fotos hochladen` : "Hochladen"}
          </button>
        </form>

        <div>
          <h2 className="text-lg font-bold text-gray-800 mb-1">Hochgeladene Fotos ({items.length})</h2>
          <p className="text-sm text-gray-500 mb-4">
            Erscheinen sofort auf der <Link href="/galerie" className="underline">Galerie-Seite</Link>.
          </p>
          {items.length === 0 ? (
            <p className="text-sm text-gray-400">Noch keine Fotos hochgeladen.</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {items.map((item) => (
                <div key={item.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.src} alt={item.alt} loading="lazy" className="w-full aspect-square object-cover" />
                  <div className="p-2 flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-mosque-green-700">{labelOf(item.category)}</p>
                      {item.caption && <p className="text-xs text-gray-500 truncate">{item.caption}</p>}
                    </div>
                    <button
                      onClick={() => handleDelete(item)}
                      className="text-xs text-red-600 hover:underline shrink-0"
                    >
                      Löschen
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
