import { NextRequest, NextResponse } from "next/server";
import { validateSession } from "@/lib/auth";
import {
  GALLERY_CATEGORIES,
  GalleryCategory,
  MAX_IMAGE_BYTES,
  addGalleryImage,
  detectImageType,
  listGalleryImages,
} from "@/lib/db-gallery";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({ items: await listGalleryImages() });
}

export async function POST(request: NextRequest) {
  const sessionId = request.cookies.get("session")?.value;
  const session = sessionId ? await validateSession(sessionId) : null;
  if (!session) {
    return NextResponse.json({ error: "Nicht autorisiert." }, { status: 401 });
  }

  const form = await request.formData().catch(() => null);
  const file = form?.get("file");
  const category = form?.get("category");
  const caption = String(form?.get("caption") ?? "").trim().slice(0, 200) || null;

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Keine Datei erhalten." }, { status: 400 });
  }
  if (!GALLERY_CATEGORIES.includes(category as GalleryCategory)) {
    return NextResponse.json({ error: "Ungültige Kategorie." }, { status: 400 });
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return NextResponse.json({ error: "Bild ist zu groß (max. 5 MB)." }, { status: 413 });
  }

  const data = Buffer.from(await file.arrayBuffer());
  const contentType = detectImageType(data);
  if (!contentType) {
    return NextResponse.json({ error: "Nur JPG, PNG oder WebP erlaubt." }, { status: 400 });
  }

  const id = await addGalleryImage(
    { category: category as GalleryCategory, caption, contentType, data },
    session.username
  );
  return NextResponse.json({ id }, { status: 201 });
}
