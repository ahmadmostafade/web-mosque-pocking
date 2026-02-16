import { Metadata } from "next";
import DonationProgressBar from "@/components/DonationProgressBar";
import DonationForm from "@/components/DonationForm";
import QrCodeDisplay from "@/components/QrCodeDisplay";
import { SITE_CONFIG } from "@/lib/constants";
import { getFaqSchema } from "@/lib/structured-data";
import { calculateDonationProgress } from "@/lib/donations";
import { calculateTotalBySource } from "@/lib/donation-store";

export const metadata: Metadata = {
  title: "Spenden – Moscheekauf",
  description:
    "Unterstützen Sie den Kauf der Moschee Pocking mit Ihrer Spende.",
};

export default function SpendenPage() {
  const totals = calculateTotalBySource();
  const progress = calculateDonationProgress(
    totals.manual,
    totals.stripe,
    totals.adjustment
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(getFaqSchema()) }}
      />
      <h1 className="text-3xl font-bold text-mosque-green-700 mb-2">
        Spenden – Moscheekauf {progress.goalAmount.toLocaleString("de-DE")} €
      </h1>
      <p className="text-gray-600 mb-8">
        Unterstützen Sie uns beim Kauf unserer Moschee. Jede Spende zählt.
      </p>

      {/* Progress */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <DonationProgressBar progress={progress} />
      </div>

      {/* Motivation */}
      <div className="mb-8 text-center bg-mosque-green-50 rounded-xl p-8">
        <p className="text-xl text-mosque-green-800 font-arabic mb-3" dir="rtl">
          مَّن ذَا ٱلَّذِى يُقْرِضُ ٱللَّهَ قَرْضًا حَسَنًا
        </p>
        <p className="text-gray-600 italic mb-4">
          Ṣadaqa Jāriya – eine fortlaufende Wohltat, deren Belohnung niemals
          endet.
        </p>
        <p className="text-gray-700">
          Jede Spende, egal wie klein, bringt uns dem Ziel näher.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Bank Transfer */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-mosque-green-700 mb-4">
            Banküberweisung
          </h2>
          <div className="space-y-2 text-sm">
            <p>
              <span className="font-medium text-gray-500">Empfänger:</span>{" "}
              {SITE_CONFIG.bankDetails.accountHolder}
            </p>
            <p>
              <span className="font-medium text-gray-500">IBAN:</span>{" "}
              <span className="font-mono">
                {SITE_CONFIG.bankDetails.iban}
              </span>
            </p>
            <p>
              <span className="font-medium text-gray-500">BIC:</span>{" "}
              {SITE_CONFIG.bankDetails.bic}
            </p>
            <p>
              <span className="font-medium text-gray-500">Bank:</span>{" "}
              {SITE_CONFIG.bankDetails.bank}
            </p>
            <p>
              <span className="font-medium text-gray-500">
                Verwendungszweck:
              </span>{" "}
              {SITE_CONFIG.bankDetails.reference}
            </p>
          </div>

          <div className="mt-6">
            <h3 className="text-sm font-semibold text-gray-500 mb-2">
              QR-Code für Überweisung
            </h3>
            <QrCodeDisplay />
          </div>
        </div>

        {/* Online Donation */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-mosque-green-700 mb-4">
            Online spenden
          </h2>
          <DonationForm />
        </div>
      </div>

      {/* Transparency */}
      <div className="bg-mosque-green-50 rounded-xl p-6 mt-8">
        <h2 className="text-xl font-bold text-mosque-green-700 mb-3">
          Transparenz
        </h2>
        <p className="text-gray-700">
          Alle Spenden werden ausschließlich für den Kauf und die Renovierung
          des Moschee-Gebäudes verwendet. Der Verein{" "}
          <strong>{SITE_CONFIG.bankDetails.accountHolder}</strong> verwaltet die
          Gelder treuhänderisch und veröffentlicht regelmäßige Updates zum
          Projektfortschritt.
        </p>
      </div>
    </div>
  );
}
