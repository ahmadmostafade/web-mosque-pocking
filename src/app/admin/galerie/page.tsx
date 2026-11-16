"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
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
  const [dragOver, setDragOver] = useState(false);

  // Small local previews of the chosen photos (freed again when the selection changes)
  const previews = useMemo(() => files.map((f) => URL.createObjectURL(f)), [files]);
  useEffect(() => () => previews.forEach((u) => URL.revokeObjectURL(u)), [previews]);

  function addFiles(list: FileList | null) {
    const images = Array.from(list ?? []).filter((f) => f.type.startsWith("image/"));
    if (images.length) setFiles((prev) => [...prev, ...images]);
    setError("");
  }

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
        <form onSubmit={handleUpload} className="bg-white rounded-xl shadow-md p-6 space-y-5">
          <h2 className="text-lg font-bold text-gray-800">Fotos hochladen</h2>

          {/* Drop box: click or drag photos in */}
          <label
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => { e.preventDefault(); setDragOver(false); addFiles(e.dataTransfer.files); }}
            className={`flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-6 py-10 text-center cursor-pointer transition-colors ${
              dragOver
                ? "border-mosque-green-500 bg-mosque-green-50"
                : "border-gray-300 bg-gray-50 hover:border-mosque-green-400 hover:bg-mosque-green-50/50"
            }`}
          >
            <svg className="w-10 h-10 text-mosque-green-600" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.16-5.16a2.25 2.25 0 013.18 0l5.16 5.16m-1.5-1.5l1.41-1.41a2.25 2.25 0 013.18 0l2.91 2.91M3.75 21h16.5A1.5 1.5 0 0021.75 19.5V4.5A1.5 1.5 0 0020.25 3H3.75A1.5 1.5 0 002.25 4.5v15A1.5 1.5 0 003.75 21zM13.5 8.25h.008v.008H13.5V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
            <p className="font-medium text-gray-800">
              Fotos hierher ziehen oder <span className="text-mosque-green-700 underline">auswählen</span>
            </p>
            <p className="text-xs text-gray-500">JPG, PNG oder WebP · mehrere Fotos auf einmal möglich</p>
            <input
              type="file"
              accept="image/*"
              multiple
              className="sr-only"
              onChange={(e) => { addFiles(e.target.files); e.target.value = ""; }}
            />
          </label>

          {files.length > 0 && (
            <>
              {/* Previews of chosen photos */}
              <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-8 gap-2">
                {previews.map((url, i) => (
                  <div key={url} className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={url} alt="" className="w-full h-full object-cover" />
                    {!busy && (
                      <button
                        type="button"
                        onClick={() => setFiles((f) => f.filter((_, j) => j !== i))}
                        className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/60 text-white text-sm leading-none hover:bg-black/80"
                        aria-label="Foto entfernen"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Details (secondary) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Kategorie</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-mosque-green-400"
                  >
                    {UPLOAD_CATEGORIES.map((c) => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Beschreibung (optional)</label>
                  <input
                    type="text"
                    maxLength={200}
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    placeholder="z. B. Freitagsgebet März 2026"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:border-mosque-green-400"
                  />
                </div>
              </div>
            </>
          )}

          {error && <p className="text-sm text-red-600">{error}</p>}

          {files.length > 0 && (
            <button
              type="submit"
              disabled={busy}
              className="bg-mosque-green-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-mosque-green-700 disabled:opacity-60 transition-colors"
            >
              {busy ? status : files.length === 1 ? "1 Foto hochladen" : `${files.length} Fotos hochladen`}
            </button>
          )}
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
