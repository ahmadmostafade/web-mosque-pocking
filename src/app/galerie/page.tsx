import { Metadata } from "next";
import MediaGallery from "@/components/MediaGallery";
import AnimateOnScroll from "@/components/AnimateOnScroll";
import { getMediaItems } from "@/lib/media-server";
import { listGalleryImages } from "@/lib/db-gallery";
import { MEDIA_CATEGORIES } from "@/lib/media";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Galerie",
  description: "Fotos und Videos der Moschee Pocking und der Renovierungsarbeiten.",
};

export default async function GaleriePage() {
  // Newest admin uploads first, then the photos shipped with the website.
  const uploaded = await listGalleryImages().catch(() => []);
  const allItems = [...uploaded, ...getMediaItems()];

  // Only show tabs for categories that actually have files
  const activeCategories = MEDIA_CATEGORIES.filter(
    (cat) => cat.value === "alle" || allItems.some((i) => i.category === cat.value)
  );

  return (
    <div className="page-container page-section">
      <h1 className="text-3xl font-bold text-mosque-green-700 mb-2">Galerie</h1>
      <p className="text-gray-600 mb-8">
        Fotos und Videos unserer Moschee – vom Anfang bis heute.
      </p>

      <AnimateOnScroll animation="fade-up">
        <MediaGallery items={allItems} categories={activeCategories} />
      </AnimateOnScroll>
    </div>
  );
}
