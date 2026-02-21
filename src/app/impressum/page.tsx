import { Metadata } from "next";
import { SITE_CONFIG } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Impressum",
  description: "Impressum der Moschee Pocking.",
};

export default function ImpressumPage() {
  return (
    <div className="page-container-narrow page-section">
      <h1 className="text-4xl font-bold text-mosque-green-700 mb-8">
        Impressum
      </h1>

      <div className="bg-white rounded-xl shadow-md p-8 space-y-8">
        <section>
          <h2 className="text-2xl font-bold text-mosque-green-700 mb-4">
            Angaben gemäß § 5 TMG
          </h2>
          <div className="text-gray-700 leading-relaxed">
            <p className="font-semibold">{SITE_CONFIG.bankDetails.accountHolder}</p>
            <p>{SITE_CONFIG.contact.address}</p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-mosque-green-700 mb-4">
            Kontakt
          </h2>
          <div className="text-gray-700">
            <p>
              <span className="font-medium">E-Mail:</span>{" "}
              <a
                href={`mailto:${SITE_CONFIG.contact.email}`}
                className="text-mosque-green-600 hover:underline"
              >
                {SITE_CONFIG.contact.email}
              </a>
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-mosque-green-700 mb-4">
            Vertretungsberechtigter Vorstand
          </h2>
          <div className="text-gray-700 space-y-2">
            <p>
              <span className="font-medium">Vorsitzender:</span>{" "}
              {SITE_CONFIG.legalInfo.chairman}
            </p>
            <p>
              <span className="font-medium">Stellvertretender Vorsitzender:</span>{" "}
              {SITE_CONFIG.legalInfo.viceChairman}
            </p>
            <p>
              <span className="font-medium">Kassenwart:</span>{" "}
              {SITE_CONFIG.legalInfo.treasurer}
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-mosque-green-700 mb-4">
            Vertretungsregelung
          </h2>
          <div className="text-gray-700 leading-relaxed">
            <p>
              Der Vorsitzende und der stellvertretende Vorsitzende vertreten den Verein jeweils alleine.
              Der Kassenwart vertritt gemeinsam mit dem stellvertretenden Vorsitzenden.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-mosque-green-700 mb-4">
            Registereintrag
          </h2>
          <div className="text-gray-700 space-y-2">
            <p>Eintragung im Vereinsregister.</p>
            <p>
              <span className="font-medium">Registergericht:</span>{" "}
              {SITE_CONFIG.legalInfo.registrationCourt}
            </p>
            <p>
              <span className="font-medium">Registernummer:</span>{" "}
              {SITE_CONFIG.legalInfo.registrationNumber}
            </p>
            <p>
              <span className="font-medium">Rechtsform:</span>{" "}
              {SITE_CONFIG.legalInfo.legalForm}
            </p>
            <p>
              <span className="font-medium">Tag der Eintragung:</span>{" "}
              {SITE_CONFIG.legalInfo.registrationDate}
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-mosque-green-700 mb-4">
            Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV
          </h2>
          <div className="text-gray-700">
            <p className="font-semibold">{SITE_CONFIG.legalInfo.chairman}</p>
            <p>{SITE_CONFIG.contact.address}</p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-mosque-green-700 mb-4">
            Haftungsausschluss
          </h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-mosque-green-600 mb-3">
                Haftung für Inhalte
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Die Inhalte unserer Seiten wurden mit größter Sorgfalt erstellt. Für
                die Richtigkeit, Vollständigkeit und Aktualität der Inhalte können
                wir jedoch keine Gewähr übernehmen.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-mosque-green-600 mb-3">
                Haftung für Links
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Unser Angebot enthält Links zu externen Webseiten Dritter, auf deren
                Inhalte wir keinen Einfluss haben. Für die Inhalte der verlinkten
                Seiten ist stets der jeweilige Anbieter verantwortlich.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
