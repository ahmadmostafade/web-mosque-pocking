import { Metadata } from "next";
import AnimateOnScroll from "@/components/AnimateOnScroll";
import { SITE_CONFIG } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Kontakt",
  description: "Kontaktieren Sie die Moschee Pocking.",
};

export default function KontaktPage() {
  return (
    <div className="page-container-md page-section">
      <h1 className="text-3xl font-bold text-mosque-green-700 mb-10">
        Kontakt
      </h1>

      <div className="max-w-xl mx-auto space-y-6">
        <AnimateOnScroll animation="fade-left">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-mosque-green-700 mb-4">
              Kontaktdaten
            </h2>
            <div className="space-y-3 text-gray-700">
              <p>📍 {SITE_CONFIG.contact.address}</p>
              <p>
                📧{" "}
                <a
                  href={`mailto:${SITE_CONFIG.contact.email}`}
                  className="text-mosque-green-600 underline hover:text-mosque-green-800 transition-colors"
                >
                  {SITE_CONFIG.contact.email}
                </a>
              </p>
            </div>
          </div>
        </AnimateOnScroll>

        {/* OpenStreetMap embed (DSGVO-konform) */}
        <AnimateOnScroll animation="fade-left" delay={150}>
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <iframe
              title="Standort der Moschee Pocking"
              src={`https://www.openstreetmap.org/export/embed.html?bbox=${SITE_CONFIG.location.longitude - 0.01}%2C${SITE_CONFIG.location.latitude - 0.01}%2C${SITE_CONFIG.location.longitude + 0.01}%2C${SITE_CONFIG.location.latitude + 0.01}&layer=mapnik&marker=${SITE_CONFIG.location.latitude}%2C${SITE_CONFIG.location.longitude}`}
              width="100%"
              height="340"
              className="border-0 block"
              loading="lazy"
            />
          </div>
        </AnimateOnScroll>
      </div>
    </div>
  );
}
