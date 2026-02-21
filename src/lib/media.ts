export interface MediaItem {
  id: string;
  src: string;
  alt: string;
  caption?: string;
  category: "vorher" | "nachher" | "veranstaltungen" | "allgemein";
  type: "image" | "video";
  thumbnail?: string;
}

export const MEDIA_CATEGORIES = [
  { value: "alle", label: "Alle" },
  { value: "vorher", label: "Vorher" },
  { value: "nachher", label: "Nachher" },
  { value: "veranstaltungen", label: "Veranstaltungen" },
  { value: "allgemein", label: "Allgemein" },
] as const;

export const sampleMedia: MediaItem[] = [
  {
    id: "vorher-1",
    src: "/images/vorher/img-vorher-01.jpg",
    alt: "Moschee vor der Renovierung – Ansicht 1",
    caption: "Zustand vor der Renovierung",
    category: "vorher",
    type: "image",
  },
  {
    id: "vorher-2",
    src: "/images/vorher/img-vorher-02.jpg",
    alt: "Moschee vor der Renovierung – Ansicht 2",
    caption: "Zustand vor der Renovierung",
    category: "vorher",
    type: "image",
  },
  {
    id: "vorher-3",
    src: "/images/vorher/img-vorher-03.jpg",
    alt: "Moschee vor der Renovierung – Ansicht 3",
    caption: "Zustand vor der Renovierung",
    category: "vorher",
    type: "image",
  },
  {
    id: "vorher-4",
    src: "/images/vorher/img-vorher-04.jpg",
    alt: "Moschee vor der Renovierung – Ansicht 4",
    caption: "Zustand vor der Renovierung",
    category: "vorher",
    type: "image",
  },
  {
    id: "vorher-5",
    src: "/images/vorher/img-vorher-05.jpg",
    alt: "Moschee vor der Renovierung – Ansicht 5",
    caption: "Zustand vor der Renovierung",
    category: "vorher",
    type: "image",
  },
  {
    id: "vorher-6",
    src: "/images/vorher/img-vorher-06.jpg",
    alt: "Moschee vor der Renovierung – Ansicht 6",
    caption: "Zustand vor der Renovierung",
    category: "vorher",
    type: "image",
  },
  {
    id: "vorher-vid-1",
    src: "/images/vorher/vid-vorher-01.mp4",
    alt: "Moschee vor der Renovierung – Video",
    caption: "Videodokumentation vor der Renovierung",
    category: "vorher",
    type: "video",
  },
];

export function filterMedia(items: MediaItem[], category: string): MediaItem[] {
  if (category === "alle") return items;
  return items.filter((item) => item.category === category);
}
