import fs from "fs";
import path from "path";
import type { MediaItem } from "./media";

const IMAGE_EXTS = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif"]);
const VIDEO_EXTS = new Set([".mp4", ".webm", ".mov"]);

const CATEGORY_LABELS: Record<string, string> = {
  vorher: "Vorher",
  nachher: "Nachher",
  veranstaltungen: "Veranstaltung",
  allgemein: "Allgemein",
};

export function getMediaItems(): MediaItem[] {
  const imagesDir = path.join(process.cwd(), "public", "images");
  const items: MediaItem[] = [];

  if (!fs.existsSync(imagesDir)) return items;

  const folders = fs
    .readdirSync(imagesDir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);

  for (const folder of folders) {
    const category = folder as MediaItem["category"];
    const folderPath = path.join(imagesDir, folder);
    const files = fs.readdirSync(folderPath).sort();

    for (const file of files) {
      const ext = path.extname(file).toLowerCase();
      const isImage = IMAGE_EXTS.has(ext);
      const isVideo = VIDEO_EXTS.has(ext);
      if (!isImage && !isVideo) continue;

      const label = CATEGORY_LABELS[folder] ?? folder;
      const index = items.filter((i) => i.category === category).length + 1;

      items.push({
        id: `${folder}-${file}`,
        src: `/images/${folder}/${file}`,
        alt: `${label} – ${index}`,
        caption: `${label} ${index}`,
        category,
        type: isImage ? "image" : "video",
      });
    }
  }

  return items;
}
