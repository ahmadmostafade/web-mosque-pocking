import { Metadata } from "next";
import LiveDonationProgress from "@/components/LiveDonationProgress";
import RecentDonations from "@/components/RecentDonations";
import DonationForm from "@/components/DonationForm"; // temporarily unused (PayPal disabled)
import QrCodeDisplay from "@/components/QrCodeDisplay";
import AyahBanner from "@/components/AyahBanner";
import AnimateOnScroll from "@/components/AnimateOnScroll";
import { SITE_CONFIG } from "@/lib/constants";
import { getFaqSchema } from "@/lib/structured-data";
import { getDonationProgress, getDonationGoal } from "@/lib/db-donations";

export const metadata: Metadata = {
  title: "Spenden – Moscheekauf",
  description:
    "Unterstützen Sie den Kauf der Moschee Pocking mit Ihrer Spende.",
};

export default function SpendenPage() {
  const currentAmount = getDonationProgress();
  const goalAmount = getDonationGoal();
  const percentage = Math.min(Math.round((currentAmount / goalAmount) * 100), 100);
  const remaining = Math.max(goalAmount - currentAmount, 0);

  const progress = {
    currentAmount,
    goalAmount,
    percentage,
    remaining,
    lastUpdated: new Date().toISOString(),
  };

  return (
    <div className="page-container-md page-section">
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
      <AnimateOnScroll animation="fade-up" className="mb-8">
        <LiveDonationProgress initialProgress={progress} />
      </AnimateOnScroll>

      {/* Motivation */}
      <AnimateOnScroll animation="fade-in" delay={100} className="mb-8">
        <AyahBanner showButton={false} />
      </AnimateOnScroll>

      <div className="grid grid-cols-1 gap-8">
        {/* Bank Transfer */}
        <AnimateOnScroll animation="fade-left">
          <div className="bg-white rounded-xl shadow-md p-6 h-full">
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
        </AnimateOnScroll>

        {/* Online Donation – PayPal (temporarily disabled, no account available yet) */}
        {/* <AnimateOnScroll animation="fade-right" delay={150}>
          <div className="bg-white rounded-xl shadow-md p-6 h-full">
          <h2 className="text-xl font-bold text-mosque-green-700 mb-4">
            Online spenden
          </h2>
          <DonationForm />
          </div>
        </AnimateOnScroll> */}
      </div>

      {/* Recent Donations */}
      <AnimateOnScroll animation="fade-up">
        <RecentDonations />
      </AnimateOnScroll>

      {/* Transparency */}
      <AnimateOnScroll animation="fade-up" delay={100}>
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
      </AnimateOnScroll>
    </div>
  );
}
