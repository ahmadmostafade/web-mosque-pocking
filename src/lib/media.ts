export interface MediaItem {
  id: string;
  src: string;
  alt: string;
  category: "vorher" | "nachher" | "veranstaltungen" | "allgemein";
  type: "image" | "video";
  width?: number;
  height?: number;
}

export const MEDIA_CATEGORIES = [
  { value: "alle", label: "Alle" },
  { value: "vorher", label: "Vorher" },
  { value: "nachher", label: "Nachher" },
  { value: "veranstaltungen", label: "Veranstaltungen" },
  { value: "allgemein", label: "Allgemein" },
] as const;

// Sample data - in production, from database
export const sampleMedia: MediaItem[] = [
  {
    id: "1",
    src: "/images/moschee-vorher-1.jpg",
    alt: "Moschee vor der Renovierung",
    category: "vorher",
    type: "image",
  },
  {
    id: "2",
    src: "/images/moschee-nachher-1.jpg",
    alt: "Moschee nach der Reinigung",
    category: "nachher",
    type: "image",
  },
  {
    id: "3",
    src: "/images/moschee-event-1.jpg",
    alt: "Gemeinschaftsaktion",
    category: "veranstaltungen",
    type: "image",
  },
];

export function filterMedia(
  items: MediaItem[],
  category: string
): MediaItem[] {
  if (category === "alle") return items;
  return items.filter((item) => item.category === category);
}
