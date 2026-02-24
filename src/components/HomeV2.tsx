import Link from "next/link";
import LiveDonationProgress from "@/components/LiveDonationProgress";
import PrayerTimesCard from "@/components/PrayerTimesCard";
import GoogleRating from "@/components/GoogleRating";
import AnimateOnScroll from "@/components/AnimateOnScroll";
import { formatCurrency, DonationProgress } from "@/lib/donations";
import { PrayerTimesData } from "@/lib/prayer-times";

interface Props {
  progress: DonationProgress;
  prayerTimes: PrayerTimesData | null;
  nextPrayer: { name: string; time: string } | null;
}

export default function HomeV2({ progress, prayerTimes, nextPrayer }: Props) {
  const { currentAmount, goalAmount, percentage, remaining } = progress;

  return (
    <div className="overflow-x-hidden">

      {/* ── Hero ── */}
      <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden bg-mosque-green-900">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/images/allgemein/allgemein-01.jpg')" }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-mosque-green-900/80 via-mosque-green-900/70 to-mosque-green-900/95" aria-hidden="true" />
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-10" aria-hidden="true">
          <div className="absolute top-0 right-0 w-96 h-96 border border-mosque-gold-400 rounded-full translate-x-1/2 -translate-y-1/2" />
          <div className="absolute top-0 right-0 w-64 h-64 border border-mosque-gold-400 rounded-full translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-80 h-80 border border-mosque-gold-400 rounded-full -translate-x-1/2 translate-y-1/2" />
        </div>

        <div className="relative z-10 page-container text-center py-24">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-mosque-gold-400/20 rounded-3xl blur-xl scale-150" />
              <img src="/images/logo.png" alt="IBF Pocking Logo" className="relative w-24 h-24 rounded-2xl shadow-2xl ring-2 ring-mosque-gold-400/40" />
            </div>
          </div>
          <p className="animate-hero-title text-3xl md:text-4xl font-bold text-mosque-gold-300 mb-2 tracking-wide" dir="rtl" lang="ar">
            مسجد عباد الرحمن
          </p>
          <h1 className="animate-hero-title text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-5 max-w-3xl mx-auto leading-tight">
            Moschee Pocking –{" "}
            <span className="text-mosque-gold-300">Ihr Haus des Gebets</span>
          </h1>
          <p className="animate-hero-subtitle text-lg md:text-xl text-mosque-green-100/90 mb-10 max-w-2xl mx-auto leading-relaxed">
            Gemeinsam bauen wir einen würdevollen Ort für Gebet, Bildung und Gemeinschaft.
            Helfen Sie uns, unsere Moschee zu vollenden.
          </p>
          <div className="animate-hero-cta flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/spenden" className="animate-glow inline-flex items-center gap-2 bg-mosque-gold-400 text-mosque-green-900 font-bold px-10 py-4 rounded-xl text-lg hover:bg-mosque-gold-300 hover:scale-105 transition-all duration-300 shadow-xl">
              <span>🤲</span> Jetzt spenden
            </Link>
            <Link href="/gebetszeiten" className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white font-semibold px-8 py-4 rounded-xl text-lg hover:bg-white/20 hover:scale-105 transition-all duration-300 border border-white/20">
              <span>🕌</span> Gebetszeiten
            </Link>
          </div>
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce opacity-50">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </section>

      {/* ── Stats strip ── */}
      <section className="bg-mosque-green-700 text-white py-6">
        <div className="page-container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: formatCurrency(currentAmount), label: "Gespendet" },
              { value: `${percentage}%`, label: "Ziel erreicht" },
              { value: formatCurrency(remaining), label: "Noch benötigt" },
              { value: "5.0 ⭐", label: "Google Bewertung" },
            ].map(({ value, label }) => (
              <div key={label} className="flex flex-col gap-1">
                <span className="text-2xl sm:text-3xl font-bold text-mosque-gold-300">{value}</span>
                <span className="text-sm text-mosque-green-100/80">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Donation progress ── */}
      <section className="page-container py-12">
        <AnimateOnScroll animation="scale-in">
          <div className="max-w-2xl mx-auto">
            <LiveDonationProgress initialProgress={progress} />
            <p className="text-center text-sm text-gray-500 mt-3">
              Jede Spende zählt –{" "}
              <Link href="/spenden" className="text-mosque-green-600 hover:underline font-medium">jetzt beitragen</Link>
            </p>
          </div>
        </AnimateOnScroll>
      </section>

      {/* ── Prayer times ── */}
      <section className="bg-gray-50 py-20 sm:py-28">
        <div className="page-container max-w-3xl mx-auto">
          <AnimateOnScroll animation="fade-up">
            <div className="text-center mb-10">
              <span className="inline-block text-xs font-semibold uppercase tracking-widest text-mosque-gold-500 mb-3">Täglich</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-mosque-green-800">Gebetszeiten</h2>
            </div>
          </AnimateOnScroll>
          <AnimateOnScroll animation="scale-in" delay={100}>
            <PrayerTimesCard times={prayerTimes} nextPrayer={nextPrayer} showDate />
            <div className="mt-6 text-center">
              <Link href="/gebetszeiten" className="text-mosque-green-600 font-medium hover:underline inline-flex items-center gap-1 group">
                Vollständige Gebetszeiten & Iqāmah
                <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
              </Link>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* ── About / Community ── */}
      <section className="bg-white py-20 sm:py-28">
        <div className="page-container max-w-4xl mx-auto">
          <AnimateOnScroll animation="fade-up">
            <div className="text-center mb-12">
              <span className="inline-block text-xs font-semibold uppercase tracking-widest text-mosque-gold-500 mb-3">Über uns</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-mosque-green-800">Unsere Gemeinschaft</h2>
            </div>
          </AnimateOnScroll>
          <AnimateOnScroll animation="fade-up" delay={100}>
            <div className="text-center max-w-2xl mx-auto space-y-4 text-gray-600 leading-relaxed mb-14 text-lg">
              <p>Die Moschee-Gemeinde in Pocking hat ein Gebäude erworben und führt Renovierungs- und Instandhaltungsarbeiten durch. Unser Ziel ist ein würdevoller Ort des Gebets, der Bildung und der Begegnung.</p>
              <p>Mit Ihrer Unterstützung können wir die verbleibenden Kosten decken und die Moschee für alle fertigstellen.</p>
            </div>
          </AnimateOnScroll>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[
              { icon: "🕌", title: "Tägliche Gebete", desc: "Fünf Gebete täglich für die Gemeinde" },
              { icon: "📖", title: "Islamische Bildung", desc: "Kurse und Unterricht für Jung und Alt" },
              { icon: "🤝", title: "Gemeinschaft", desc: "Ein offener Ort für alle" },
              { icon: "🌙", title: "Freitagsgebet", desc: "Jumu'ah jeden Freitag" },
            ].map(({ icon, title, desc }, i) => (
              <AnimateOnScroll key={title} animation="fade-up" delay={i * 80}>
                <div className="flex flex-col items-center text-center gap-3 p-6 bg-gray-50 rounded-2xl border border-gray-100 hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                  <span className="text-4xl">{icon}</span>
                  <p className="font-semibold text-mosque-green-800">{title}</p>
                  <p className="text-gray-500 text-sm">{desc}</p>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
          <AnimateOnScroll animation="fade-up" delay={200}>
            <div className="text-center">
              <Link href="/ueber-uns" className="inline-flex items-center gap-2 bg-mosque-green-600 text-white font-semibold px-8 py-4 rounded-xl hover:bg-mosque-green-700 hover:scale-105 transition-all duration-300 text-lg">
                Mehr über uns erfahren →
              </Link>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* ── Ayah ── */}
      <section className="relative bg-mosque-green-800 py-20 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-5" aria-hidden="true">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border-2 border-mosque-gold-400 rounded-full" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-mosque-gold-400 rounded-full" />
        </div>
        <AnimateOnScroll animation="fade-up" className="page-container-narrow relative z-10">
          <div className="text-center">
            <p className="text-3xl sm:text-4xl text-mosque-gold-300 font-arabic mb-5 leading-loose" dir="rtl" lang="ar">
              مَّن ذَا ٱلَّذِى يُقْرِضُ ٱللَّهَ قَرْضًا حَسَنًا فَيُضَـٰعِفَهُۥ لَهُۥٓ أَضْعَافًا كَثِيرَةً
            </p>
            <p className="text-mosque-green-100/80 italic text-lg mb-4">„Wer ist es, der Allah ein gutes Darlehen gibt, damit Er es ihm vervielfache?"</p>
            <p className="text-mosque-green-200/60 text-sm mb-10">Sure Al-Baqara, 245</p>
            <Link href="/spenden" className="animate-glow inline-flex items-center gap-2 bg-mosque-gold-400 text-mosque-green-900 font-bold px-10 py-4 rounded-xl text-lg hover:bg-mosque-gold-300 hover:scale-105 transition-all duration-300 shadow-xl">
              🤲 Jetzt spenden
            </Link>
          </div>
        </AnimateOnScroll>
      </section>

      {/* ── Gallery teaser ── */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="page-container">
          <AnimateOnScroll animation="fade-up">
            <div className="text-center mb-10">
              <span className="inline-block text-xs font-semibold uppercase tracking-widest text-mosque-gold-500 mb-3">Einblicke</span>
              <h2 className="text-3xl font-bold text-mosque-green-800">Unsere Moschee</h2>
              <p className="text-gray-500 mt-2">Vorher & Nachher – sehen Sie den Fortschritt</p>
            </div>
          </AnimateOnScroll>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
            {["/images/nachher/nachher-01.jpeg", "/images/nachher/nachher-02.jpeg", "/images/nachher/nachher-03.jpeg"].map((src, i) => (
              <AnimateOnScroll key={src} animation="scale-in" delay={i * 100}>
                <div className="aspect-square overflow-hidden rounded-2xl shadow-md group">
                  <img src={src} alt={`Moschee Bild ${i + 1}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
              </AnimateOnScroll>
            ))}
          </div>
          <AnimateOnScroll animation="fade-up" delay={300}>
            <div className="text-center mt-8">
              <Link href="/galerie" className="inline-flex items-center gap-2 border-2 border-mosque-green-600 text-mosque-green-700 font-semibold px-8 py-3 rounded-xl hover:bg-mosque-green-600 hover:text-white transition-all duration-300">
                Alle Bilder ansehen →
              </Link>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* ── Google Rating ── */}
      <section className="bg-gray-50 py-12 border-y border-gray-100">
        <AnimateOnScroll animation="fade-up">
          <div className="page-container flex justify-center">
            <div className="w-full max-w-sm">
              <GoogleRating />
            </div>
          </div>
        </AnimateOnScroll>
      </section>

    </div>
  );
}
