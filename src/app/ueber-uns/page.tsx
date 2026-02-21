import { Metadata } from "next";
import AnimateOnScroll from "@/components/AnimateOnScroll";
import { SITE_CONFIG } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Über uns",
  description: "Erfahren Sie mehr über den Trägerverein der Moschee Pocking.",
};

export default function UeberUnsPage() {
  return (
    <div className="page-container-narrow page-section">
      <h1 className="text-3xl font-bold text-mosque-green-700 mb-8">
        Über uns
      </h1>

      <AnimateOnScroll animation="fade-up">
        <div className="bg-white rounded-xl shadow-md p-8 mb-8">
          <h2 className="text-xl font-bold text-mosque-green-700 mb-4">
            Trägerverein
          </h2>
          <div className="space-y-3 text-gray-700">
            <p>
              <span className="font-medium">Verein:</span>{" "}
              {SITE_CONFIG.bankDetails.accountHolder}
            </p>
            <p>
              <span className="font-medium">Standort:</span>{" "}
              {SITE_CONFIG.contact.address}
            </p>
          </div>
        </div>
      </AnimateOnScroll>

      <AnimateOnScroll animation="fade-up" delay={100}>
        <div className="bg-white rounded-xl shadow-md p-8 mb-8">
          <h2 className="text-xl font-bold text-mosque-green-700 mb-4">
            Unsere Mission
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Die Moschee-Gemeinde in Pocking hat sich zum Ziel gesetzt, einen
            würdevollen Ort des Gebets, der Bildung und der Gemeinschaft zu
            schaffen. Wir fördern den interkulturellen Dialog und bieten
            religiöse Unterweisung für alle Altersgruppen.
          </p>
        </div>
      </AnimateOnScroll>

      <AnimateOnScroll animation="fade-up" delay={200}>
        <div className="bg-white rounded-xl shadow-md p-8 mb-8">
          <h2 className="text-xl font-bold text-mosque-green-700 mb-4">
            Unsere Vision
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Eine offene, integrative und lebendige Moschee, die als Zentrum des
            Glaubens, des Lernens und des interkulturellen Austausches anerkannt
            ist. Wir möchten ein positives Beispiel für gelebten Islam sein und
            Verständnis, Respekt sowie gesellschaftlichen Zusammenhalt fördern.
          </p>
        </div>
      </AnimateOnScroll>

      <AnimateOnScroll animation="fade-up" delay={300}>
        <div className="bg-mosque-green-50 rounded-xl p-8">
          <h2 className="text-xl font-bold text-mosque-green-700 mb-4">
            Zweckbindung der Spenden
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Alle eingehenden Spenden werden ausschließlich für den Erwerb und die
            Instandhaltung des Moschee-Gebäudes verwendet. Der Verein
            veröffentlicht regelmäßig Berichte über die Verwendung der Mittel und
            den Fortschritt des Projekts.
          </p>
        </div>
      </AnimateOnScroll>
    </div>
  );
}
