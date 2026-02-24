"use client";

import { useState, useEffect, useCallback } from "react";
import { MediaItem, filterMedia } from "@/lib/media";

type Category = { value: string; label: string };

interface Props {
  items: MediaItem[];
  categories: Category[];
}

export default function MediaGallery({ items, categories }: Props) {
  const [activeCategory, setActiveCategory] = useState("alle");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filtered = filterMedia(items, activeCategory);

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);

  const goPrev = useCallback(() => {
    setLightboxIndex((i) => (i !== null ? (i - 1 + filtered.length) % filtered.length : null));
  }, [filtered.length]);

  const goNext = useCallback(() => {
    setLightboxIndex((i) => (i !== null ? (i + 1) % filtered.length : null));
  }, [filtered.length]);

  useEffect(() => {
    if (lightboxIndex === null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightboxIndex, goPrev, goNext]);

  const lightboxItem = lightboxIndex !== null ? filtered[lightboxIndex] : null;

  return (
    <div>
      {/* Category Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setActiveCategory(cat.value)}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              activeCategory === cat.value
                ? "bg-mosque-green-600 text-white shadow-md"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800"
            }`}
          >
            {cat.label}
            {cat.value !== "alle" && (
              <span className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${
                activeCategory === cat.value ? "bg-white/20 text-white" : "bg-gray-200 text-gray-500"
              }`}>
                {items.filter((i) => i.category === cat.value).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <div className="text-5xl mb-3">📷</div>
          <p className="text-lg">Keine Medien in dieser Kategorie.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {filtered.map((item, index) => (
            <button
              key={item.id}
              onClick={() => openLightbox(index)}
              className="relative group aspect-square overflow-hidden rounded-xl bg-gray-100 focus:outline-none focus:ring-2 focus:ring-mosque-green-500 focus:ring-offset-2"
              aria-label={item.alt}
            >
              {item.type === "image" ? (
                <img
                  src={item.src}
                  alt={item.alt}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              ) : (
                <video
                  src={item.src}
                  preload="metadata"
                  muted
                  className="w-full h-full object-cover"
                />
              )}

              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 rounded-xl" />

              {/* Video play icon */}
              {item.type === "video" && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-black/50 flex items-center justify-center group-hover:bg-mosque-green-600 transition-colors duration-200">
                    <svg className="w-5 h-5 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              )}

              {/* Caption on hover */}
              {item.caption && (
                <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/70 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300 rounded-b-xl">
                  <p className="text-white text-xs truncate">{item.caption}</p>
                </div>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightboxItem && lightboxIndex !== null && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center"
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
          aria-label="Medienansicht"
        >
          {/* Close */}
          <button
            className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            onClick={closeLightbox}
            aria-label="Schließen"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Counter */}
          <div className="absolute top-4 left-4 z-10 text-white/70 text-sm">
            {lightboxIndex + 1} / {filtered.length}
          </div>

          {/* Prev */}
          {filtered.length > 1 && (
            <button
              className="absolute left-4 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
              onClick={(e) => { e.stopPropagation(); goPrev(); }}
              aria-label="Vorheriges"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          {/* Media */}
          <div
            className="max-w-5xl w-full mx-16 flex flex-col items-center gap-3"
            onClick={(e) => e.stopPropagation()}
          >
            {lightboxItem.type === "image" ? (
              <img
                src={lightboxItem.src}
                alt={lightboxItem.alt}
                className="max-h-[80vh] max-w-full rounded-lg object-contain shadow-2xl"
              />
            ) : (
              <video
                src={lightboxItem.src}
                controls
                autoPlay
                className="max-h-[80vh] max-w-full rounded-lg shadow-2xl"
                aria-label={lightboxItem.alt}
              >
                Ihr Browser unterstützt kein Video.
              </video>
            )}
            {lightboxItem.caption && (
              <p className="text-white/80 text-sm text-center">{lightboxItem.caption}</p>
            )}
          </div>

          {/* Next */}
          {filtered.length > 1 && (
            <button
              className="absolute right-4 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
              onClick={(e) => { e.stopPropagation(); goNext(); }}
              aria-label="Nächstes"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
