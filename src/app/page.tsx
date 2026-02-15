import Link from "next/link";
import DonationProgressBar from "@/components/DonationProgressBar";
import PrayerTimesCard from "@/components/PrayerTimesCard";
import { calculateDonationProgress } from "@/lib/donations";
import { calculateTotalBySource } from "@/lib/donation-store";
import { fetchPrayerTimes, getNextPrayer } from "@/lib/prayer-times";

export default async function HomePage() {
  const totals = calculateTotalBySource();
  const progress = calculateDonationProgress(
    totals.manual,
    totals.stripe,
    totals.adjustment
  );
  const prayerTimes = await fetchPrayerTimes();
  const nextPrayer = prayerTimes ? getNextPrayer(prayerTimes) : null;

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-mosque-green-700 to-mosque-green-900 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            🕌 Willkommen bei der Moschee Pocking
          </h1>
          <p className="text-lg md:text-xl text-mosque-green-100 mb-8 max-w-2xl mx-auto">
            Gemeinsam bauen wir ein Haus des Gebets und der Gemeinschaft.
            Unterstützen Sie uns beim Kauf unserer Moschee.
          </p>
          <Link
            href="/spenden"
            className="inline-block bg-mosque-gold-400 text-mosque-green-900 font-bold px-8 py-4 rounded-xl text-lg hover:bg-mosque-gold-300 transition-colors shadow-lg"
          >
            Jetzt spenden – Moschee kaufen
          </Link>
        </div>
      </section>

      {/* Donation Progress */}
      <section className="max-w-4xl mx-auto px-4 -mt-8">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-mosque-green-700 mb-4">
            Spendenfortschritt
          </h2>
          <DonationProgressBar progress={progress} />
        </div>
      </section>

      {/* Prayer Times + Info */}
      <section className="max-w-7xl mx-auto px-4 py-16 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-bold text-mosque-green-700 mb-4">
            Über unsere Moschee
          </h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            Die Moschee-Gemeinde in Pocking hat ein Gebäude erworben und führt
            derzeit Renovierungs- und Instandhaltungsarbeiten durch. Unser Ziel
            ist es, einen würdevollen Ort des Gebets und der Gemeinschaft zu
            schaffen.
          </p>
          <p className="text-gray-600 leading-relaxed mb-6">
            Mit Ihrer Unterstützung können wir die verbleibenden Kosten decken
            und die Moschee für die Gemeinde fertigstellen.
          </p>
          <Link
            href="/ueber-uns"
            className="text-mosque-green-600 font-medium hover:underline"
          >
            Mehr erfahren →
          </Link>
        </div>

        <PrayerTimesCard times={prayerTimes} nextPrayer={nextPrayer} />
      </section>

      {/* Motivation Section */}
      <section className="bg-mosque-green-50 py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-2xl text-mosque-green-800 font-arabic mb-4" dir="rtl">
            مَّن ذَا ٱلَّذِى يُقْرِضُ ٱللَّهَ قَرْضًا حَسَنًا فَيُضَـٰعِفَهُۥ لَهُۥٓ أَضْعَافًا كَثِيرَةً
          </p>
          <p className="text-gray-600 italic mb-6">
            „Wer ist es, der Allah ein gutes Darlehen gibt, damit Er es ihm
            vervielfache?" – Sure Al-Baqara, 245
          </p>
          <p className="text-gray-700 mb-8">
            Jede Spende ist eine <strong>Ṣadaqa Jāriya</strong> – eine
            fortlaufende Wohltat, deren Belohnung auch nach dem Tod weitergeht.
            Jeder Betrag zählt.
          </p>
          <Link
            href="/spenden"
            className="inline-block bg-mosque-green-600 text-white font-bold px-8 py-3 rounded-xl hover:bg-mosque-green-700 transition-colors"
          >
            Jetzt spenden
          </Link>
        </div>
      </section>
    </div>
  );
}
