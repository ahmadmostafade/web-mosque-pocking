import { Metadata } from "next";
import { SITE_CONFIG } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Datenschutzerklärung",
  description: "Datenschutzerklärung der Moschee Pocking.",
};

export default function DatenschutzPage() {
  return (
    <div className="page-container-narrow page-section">
      <h1 className="text-4xl font-bold text-mosque-green-700 mb-8">
        Datenschutzerklärung
      </h1>

      <div className="bg-white rounded-xl shadow-md p-8 space-y-8">
        <section>
          <h2 className="text-2xl font-bold text-mosque-green-700 mb-4">
            1. Datenschutz auf einen Blick
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Die folgenden Hinweise geben einen einfachen Überblick darüber, was
            mit Ihren personenbezogenen Daten passiert, wenn Sie diese Website
            besuchen.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-mosque-green-700 mb-4">
            2. Verantwortliche Stelle
          </h2>
          <div className="text-gray-700 leading-relaxed">
            <p className="font-semibold">{SITE_CONFIG.bankDetails.accountHolder}</p>
            <p>{SITE_CONFIG.contact.address}</p>
            <p className="mt-2">
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
            3. Cookies
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Diese Website verwendet ausschließlich technisch notwendige Cookies.
            Beim ersten Besuch werden Sie über ein Cookie-Banner informiert und
            können der Verwendung zustimmen oder diese ablehnen. Bei Ablehnung
            werden keine nicht-essentiellen Cookies gesetzt.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-mosque-green-700 mb-4">
            4. Kontaktformular
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Wenn Sie uns per Kontaktformular Anfragen zukommen lassen, werden
            Ihre Angaben zur Bearbeitung der Anfrage bei uns gespeichert. Diese
            Daten geben wir nicht ohne Ihre Einwilligung weiter.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-mosque-green-700 mb-4">
            5. Externe Dienste
          </h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-mosque-green-600 mb-3">
                5.1 PayPal
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Für Spenden bieten wir die Zahlungsmöglichkeit über PayPal an. Bei
                Nutzung von PayPal werden Ihre Daten an PayPal (Europe) S.à r.l. et
                Cie, S.C.A. übermittelt. Es gelten die Datenschutzbestimmungen von
                PayPal.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-mosque-green-600 mb-3">
                5.2 Aladhan Prayer Times API
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Für die Anzeige der Gebetszeiten nutzen wir die Aladhan API. Dabei
                werden keine personenbezogenen Daten übermittelt, lediglich der
                Standort Pocking wird zur Berechnung verwendet.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-mosque-green-600 mb-3">
                5.3 OpenStreetMap
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Auf der Kontaktseite verwenden wir eine eingebettete Karte von
                OpenStreetMap. OpenStreetMap ist ein DSGVO-konformer Kartendienst.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-mosque-green-700 mb-4">
            6. Ihre Rechte
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Sie haben das Recht auf Auskunft, Berichtigung, Löschung und
            Einschränkung der Verarbeitung Ihrer personenbezogenen Daten. Bitte
            wenden Sie sich dazu an die oben genannte verantwortliche Stelle.
          </p>
        </section>
      </div>
    </div>
  );
}
