import { Metadata } from "next";
import MediaGallery from "@/components/MediaGallery";
import { sampleMedia } from "@/lib/media";

export const metadata: Metadata = {
  title: "Galerie",
  description: "Fotos und Videos der Moschee Pocking und der Renovierungsarbeiten.",
};

export default function GaleriePage() {
  return (
    <div className="page-container page-section">
      <h1 className="text-3xl font-bold text-mosque-green-700 mb-2">
        Galerie
      </h1>
      <p className="text-gray-600 mb-8">
        Fotos und Videos unserer Moschee – vom Anfang bis heute.
      </p>

      <MediaGallery items={sampleMedia} />
    </div>
  );
}
