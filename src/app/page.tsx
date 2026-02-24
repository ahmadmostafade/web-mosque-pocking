import Link from "next/link";
import DonationProgressBar from "@/components/DonationProgressBar";
import PrayerTimesCard from "@/components/PrayerTimesCard";
import AyahBanner from "@/components/AyahBanner";
import GoogleRating from "@/components/GoogleRating";
import AnimateOnScroll from "@/components/AnimateOnScroll";
import { getDonationProgress, getDonationGoal } from "@/lib/db-donations";
import { fetchPrayerTimes, getNextPrayer } from "@/lib/prayer-times";

export default async function HomePage() {
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

  const prayerTimes = await fetchPrayerTimes();
  const nextPrayer = prayerTimes ? getNextPrayer(prayerTimes) : null;

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-mosque-green-700 to-mosque-green-900 text-white py-24 sm:py-32 overflow-hidden">
        {/* Decorative floating elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
          <div className="animate-float absolute top-16 left-[10%] w-2 h-2 bg-mosque-gold-400/20 rounded-full" />
          <div className="animate-float absolute top-24 right-[15%] w-3 h-3 bg-mosque-gold-400/15 rounded-full" style={{ animationDelay: "1s" }} />
          <div className="animate-float absolute bottom-20 left-[20%] w-2.5 h-2.5 bg-mosque-gold-400/10 rounded-full" style={{ animationDelay: "2s" }} />
          <div className="animate-float absolute top-32 right-[30%] w-1.5 h-1.5 bg-mosque-gold-300/20 rounded-full" style={{ animationDelay: "1.5s" }} />
        </div>

        <div className="page-container text-center relative z-10">
          <div className="flex justify-center mb-5">
            <img
              src="/images/logo.png"
              alt="IBF Pocking Logo"
              className="w-20 h-20 rounded-2xl shadow-lg"
            />
          </div>
          <p className="animate-hero-title text-2xl md:text-3xl font-bold text-mosque-gold-300 mb-1 tracking-wide" dir="rtl" lang="ar">
            مسجد عباد الرحمن
          </p>
          <h1 className="animate-hero-title text-4xl md:text-5xl font-bold mb-6 max-w-3xl mx-auto">
            Willkommen bei der Moschee Pocking
          </h1>
          <p className="animate-hero-subtitle text-lg md:text-xl text-mosque-green-100 mb-10 max-w-2xl mx-auto">
            Gemeinsam bauen wir ein Haus des Gebets und der Gemeinschaft.
            Unterstützen Sie uns beim Kauf unserer Moschee.
          </p>
          <Link
            href="/spenden"
            className="animate-hero-cta animate-glow inline-block bg-mosque-gold-400 text-mosque-green-900 font-bold px-10 py-4 rounded-xl text-lg hover:bg-mosque-gold-300 hover:scale-105 transition-all duration-300 shadow-lg"
          >
            Jetzt spenden – Moschee kaufen
          </Link>
        </div>
      </section>

      {/* Donation Progress */}
      <section className="page-container -mt-10">
        <AnimateOnScroll animation="scale-in">
          <div className="max-w-2xl mx-auto">
            <DonationProgressBar progress={progress} title="Spendenfortschritt" />
          </div>
        </AnimateOnScroll>
      </section>

      {/* Prayer Times + Info */}
      <section className="page-container page-section grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        <AnimateOnScroll animation="fade-left">
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
              className="text-mosque-green-600 font-medium hover:underline inline-flex items-center gap-1 group"
            >
              Mehr erfahren
              <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
            </Link>
          </div>
        </AnimateOnScroll>

        <AnimateOnScroll animation="fade-right" delay={150}>
          <PrayerTimesCard times={prayerTimes} nextPrayer={nextPrayer} />
        </AnimateOnScroll>
      </section>

      {/* Google Rating */}
      <section className="bg-gray-50 py-10 border-y border-gray-100">
        <AnimateOnScroll animation="fade-up">
          <div className="page-container flex justify-center">
            <div className="w-full max-w-sm">
              <GoogleRating />
            </div>
          </div>
        </AnimateOnScroll>
      </section>

      {/* Motivation Section */}
      <section className="bg-mosque-green-50 page-section">
        <AnimateOnScroll animation="fade-up" className="page-container-narrow">
          <AyahBanner />
        </AnimateOnScroll>
      </section>
    </div>
  );
}
