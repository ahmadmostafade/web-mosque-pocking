import { Metadata } from "next";
import ContactForm from "@/components/ContactForm";
import { SITE_CONFIG } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Kontakt",
  description: "Kontaktieren Sie die Moschee Pocking.",
};

export default function KontaktPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-mosque-green-700 mb-8">
        Kontakt
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold text-mosque-green-700 mb-4">
              Kontaktdaten
            </h2>
            <div className="space-y-3 text-gray-700">
              <p>📍 {SITE_CONFIG.contact.address}</p>
              <p>📧 {SITE_CONFIG.contact.email}</p>
              <p>📞 {SITE_CONFIG.contact.phone}</p>
            </div>
          </div>

          {/* OpenStreetMap embed (DSGVO-konform) */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <iframe
              title="Standort der Moschee Pocking"
              src={`https://www.openstreetmap.org/export/embed.html?bbox=${SITE_CONFIG.location.longitude - 0.01}%2C${SITE_CONFIG.location.latitude - 0.01}%2C${SITE_CONFIG.location.longitude + 0.01}%2C${SITE_CONFIG.location.latitude + 0.01}&layer=mapnik&marker=${SITE_CONFIG.location.latitude}%2C${SITE_CONFIG.location.longitude}`}
              width="100%"
              height="300"
              className="border-0"
              loading="lazy"
            />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-mosque-green-700 mb-4">
            Nachricht senden
          </h2>
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
