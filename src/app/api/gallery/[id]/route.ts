import { NextRequest, NextResponse } from "next/server";
import { validateSession } from "@/lib/auth";
import { deleteGalleryImage, getGalleryImage } from "@/lib/db-gallery";

// Uploaded images never change (a new upload gets a new id), so let browsers and
// Netlify's CDN cache them. Kept at 1 day so a deleted photo disappears from caches soon.
const CACHE = "public, max-age=86400";

function parseId(raw: string): number | null {
  const id = Number(raw);
  return Number.isInteger(id) && id > 0 ? id : null;
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const id = parseId((await params).id);
  const image = id ? await getGalleryImage(id) : null;
  if (!image) return new NextResponse("Not found", { status: 404 });

  return new NextResponse(new Uint8Array(image.data), {
    headers: {
      "Content-Type": image.contentType,
      "Cache-Control": CACHE,
      "Netlify-CDN-Cache-Control": `${CACHE}, durable`,
    },
  });
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const sessionId = request.cookies.get("session")?.value;
  const session = sessionId ? await validateSession(sessionId) : null;
  if (!session) {
    return NextResponse.json({ error: "Nicht autorisiert." }, { status: 401 });
  }

  const id = parseId((await params).id);
  if (!id || !(await deleteGalleryImage(id))) {
    return NextResponse.json({ error: "Bild nicht gefunden." }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
