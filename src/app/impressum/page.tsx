import { Metadata } from "next";
import { SITE_CONFIG } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Impressum",
  description: "Impressum der Moschee Pocking.",
};

export default function ImpressumPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-mosque-green-700 mb-8">
        Impressum
      </h1>

      <div className="prose prose-gray max-w-none">
        <h2>Angaben gemäß § 5 TMG</h2>
        <p>
          {SITE_CONFIG.bankDetails.accountHolder}
          <br />
          {SITE_CONFIG.contact.address}
        </p>

        <h2>Kontakt</h2>
        <p>
          E-Mail: {SITE_CONFIG.contact.email}
        </p>

        <h2>Vertretungsberechtigter Vorstand</h2>
        <p>
          Vorsitzender: {SITE_CONFIG.legalInfo.chairman}
          <br />
          Stellvertretender Vorsitzender: {SITE_CONFIG.legalInfo.viceChairman}
          <br />
          Kassenwart: {SITE_CONFIG.legalInfo.treasurer}
        </p>

        <h2>Registereintrag</h2>
        <p>
          Eintragung im Vereinsregister.
          <br />
          Registergericht: {SITE_CONFIG.legalInfo.registrationCourt}
          <br />
          Rechtsform: {SITE_CONFIG.legalInfo.legalForm}
        </p>

        <h2>Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</h2>
        <p>
          {SITE_CONFIG.legalInfo.chairman}
          <br />
          {SITE_CONFIG.contact.address}
        </p>

        <h2>Haftungsausschluss</h2>
        <h3>Haftung für Inhalte</h3>
        <p>
          Die Inhalte unserer Seiten wurden mit größter Sorgfalt erstellt. Für
          die Richtigkeit, Vollständigkeit und Aktualität der Inhalte können
          wir jedoch keine Gewähr übernehmen.
        </p>

        <h3>Haftung für Links</h3>
        <p>
          Unser Angebot enthält Links zu externen Webseiten Dritter, auf deren
          Inhalte wir keinen Einfluss haben. Für die Inhalte der verlinkten
          Seiten ist stets der jeweilige Anbieter verantwortlich.
        </p>
      </div>
    </div>
  );
}
