import { Metadata } from "next";
import { SITE_CONFIG } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Datenschutzerklärung",
  description: "Datenschutzerklärung der Moschee Pocking.",
};

export default function DatenschutzPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-mosque-green-700 mb-8">
        Datenschutzerklärung
      </h1>

      <div className="prose prose-gray max-w-none">
        <h2>1. Datenschutz auf einen Blick</h2>
        <p>
          Die folgenden Hinweise geben einen einfachen Überblick darüber, was
          mit Ihren personenbezogenen Daten passiert, wenn Sie diese Website
          besuchen.
        </p>

        <h2>2. Verantwortliche Stelle</h2>
        <p>
          {SITE_CONFIG.bankDetails.accountHolder}
          <br />
          {SITE_CONFIG.contact.address}
          <br />
          E-Mail: {SITE_CONFIG.contact.email}
        </p>

        <h2>3. Cookies</h2>
        <p>
          Diese Website verwendet ausschließlich technisch notwendige Cookies.
          Beim ersten Besuch werden Sie über ein Cookie-Banner informiert und
          können der Verwendung zustimmen oder diese ablehnen. Bei Ablehnung
          werden keine nicht-essentiellen Cookies gesetzt.
        </p>

        <h2>4. Kontaktformular</h2>
        <p>
          Wenn Sie uns per Kontaktformular Anfragen zukommen lassen, werden
          Ihre Angaben zur Bearbeitung der Anfrage bei uns gespeichert. Diese
          Daten geben wir nicht ohne Ihre Einwilligung weiter.
        </p>

        <h2>5. Externe Dienste</h2>

        <h3>5.1 PayPal</h3>
        <p>
          Für Spenden bieten wir die Zahlungsmöglichkeit über PayPal an. Bei
          Nutzung von PayPal werden Ihre Daten an PayPal (Europe) S.à r.l. et
          Cie, S.C.A. übermittelt. Es gelten die Datenschutzbestimmungen von
          PayPal.
        </p>

        <h3>5.2 Aladhan Prayer Times API</h3>
        <p>
          Für die Anzeige der Gebetszeiten nutzen wir die Aladhan API. Dabei
          werden keine personenbezogenen Daten übermittelt, lediglich der
          Standort Pocking wird zur Berechnung verwendet.
        </p>

        <h3>5.3 OpenStreetMap</h3>
        <p>
          Auf der Kontaktseite verwenden wir eine eingebettete Karte von
          OpenStreetMap. OpenStreetMap ist ein DSGVO-konformer Kartendienst.
        </p>

        <h2>6. Ihre Rechte</h2>
        <p>
          Sie haben das Recht auf Auskunft, Berichtigung, Löschung und
          Einschränkung der Verarbeitung Ihrer personenbezogenen Daten. Bitte
          wenden Sie sich dazu an die oben genannte verantwortliche Stelle.
        </p>
      </div>
    </div>
  );
}
