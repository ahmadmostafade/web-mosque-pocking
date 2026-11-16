import pool, { ensureInitialized } from "./db";
import type { MediaItem } from "./media";

export const GALLERY_CATEGORIES = ["vorher", "nachher", "veranstaltungen", "allgemein"] as const;
export type GalleryCategory = (typeof GALLERY_CATEGORIES)[number];

export const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // stays under Netlify's 6 MB request limit

/** Detect the real image type from the file's first bytes (ignores the client-sent type). */
export function detectImageType(buf: Buffer): string | null {
  if (buf.length < 12) return null;
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return "image/jpeg";
  if (buf.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return "image/png";
  if (buf.toString("ascii", 0, 4) === "RIFF" && buf.toString("ascii", 8, 12) === "WEBP") return "image/webp";
  return null;
}

export async function listGalleryImages(): Promise<MediaItem[]> {
  await ensureInitialized();
  const { rows } = await pool.query(
    "SELECT id, category, caption FROM gallery_images ORDER BY created_at DESC, id DESC"
  );
  return rows.map((r) => ({
    id: `db-${r.id}`,
    src: `/api/gallery/${r.id}`,
    alt: r.caption || "Foto der Moschee Pocking",
    caption: r.caption || undefined,
    category: r.category as GalleryCategory,
    type: "image" as const,
  }));
}

export async function getGalleryImage(
  id: number
): Promise<{ data: Buffer; contentType: string } | null> {
  await ensureInitialized();
  const { rows } = await pool.query(
    "SELECT data, content_type FROM gallery_images WHERE id = $1",
    [id]
  );
  return rows[0] ? { data: rows[0].data, contentType: rows[0].content_type } : null;
}

export async function addGalleryImage(
  image: { category: GalleryCategory; caption: string | null; contentType: string; data: Buffer },
  createdBy: string
): Promise<number> {
  await ensureInitialized();
  const { rows } = await pool.query(
    `INSERT INTO gallery_images (category, caption, content_type, data, created_by)
     VALUES ($1, $2, $3, $4, $5) RETURNING id`,
    [image.category, image.caption, image.contentType, image.data, createdBy]
  );
  return rows[0].id;
}

export async function deleteGalleryImage(id: number): Promise<boolean> {
  await ensureInitialized();
  const { rowCount } = await pool.query("DELETE FROM gallery_images WHERE id = $1", [id]);
  return (rowCount ?? 0) > 0;
}
