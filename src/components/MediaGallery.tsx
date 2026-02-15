"use client";

import { useState } from "react";
import { MediaItem, MEDIA_CATEGORIES, filterMedia } from "@/lib/media";

interface Props {
  items: MediaItem[];
}

export default function MediaGallery({ items }: Props) {
  const [activeCategory, setActiveCategory] = useState("alle");
  const [lightboxItem, setLightboxItem] = useState<MediaItem | null>(null);

  const filtered = filterMedia(items, activeCategory);

  return (
    <div>
      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {MEDIA_CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setActiveCategory(cat.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeCategory === cat.value
                ? "bg-mosque-green-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filtered.map((item) => (
          <div key={item.id} className="relative group">
            {item.type === "image" ? (
              <button
                onClick={() => setLightboxItem(item)}
                className="w-full aspect-square overflow-hidden rounded-lg"
                aria-label={`Bild vergrößern: ${item.alt}`}
              >
                <img
                  src={item.src}
                  alt={item.alt}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </button>
            ) : (
              <div className="aspect-square rounded-lg overflow-hidden bg-black">
                <video
                  src={item.src}
                  controls
                  preload="metadata"
                  className="w-full h-full object-cover"
                  aria-label={item.alt}
                >
                  Ihr Browser unterstützt kein Video.
                </video>
              </div>
            )}
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-gray-500 py-8">
          Keine Medien in dieser Kategorie.
        </p>
      )}

      {/* Lightbox */}
      {lightboxItem && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setLightboxItem(null)}
          role="dialog"
          aria-label="Bildansicht"
        >
          <button
            className="absolute top-4 right-4 text-white text-3xl hover:text-gray-300"
            onClick={() => setLightboxItem(null)}
            aria-label="Schließen"
          >
            ✕
          </button>
          <img
            src={lightboxItem.src}
            alt={lightboxItem.alt}
            className="max-w-full max-h-[90vh] rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
