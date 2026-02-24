export interface MediaItem {
  id: string;
  src: string;
  alt: string;
  caption?: string;
  category: "vorher" | "nachher" | "veranstaltungen" | "allgemein";
  type: "image" | "video";
}

export const MEDIA_CATEGORIES = [
  { value: "alle", label: "Alle" },
  { value: "vorher", label: "Vorher" },
  { value: "nachher", label: "Nachher" },
  { value: "veranstaltungen", label: "Veranstaltungen" },
  { value: "allgemein", label: "Allgemein" },
] as const;

export function filterMedia(items: MediaItem[], category: string): MediaItem[] {
  if (category === "alle") return items;
  return items.filter((item) => item.category === category);
}
