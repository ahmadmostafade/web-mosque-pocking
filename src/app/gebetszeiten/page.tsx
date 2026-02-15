import { Metadata } from "next";
import PrayerTimesCard from "@/components/PrayerTimesCard";
import { fetchPrayerTimes, getNextPrayer } from "@/lib/prayer-times";
import { PRAYER_NAMES } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Gebetszeiten",
  description: "Aktuelle Gebetszeiten und Iqāmah-Zeiten für Pocking.",
};

// Default Iqāmah times (in production, from database)
const defaultIqamah = {
  Fajr: "06:00",
  Dhuhr: "13:00",
  Asr: "16:00",
  Maghrib: "+10 min",
  Isha: "20:00",
};

const jumahTime = { begins: "13:30", iqamah: "13:45" };

export default async function GebetszeitenPage() {
  const prayerTimes = await fetchPrayerTimes();
  const nextPrayer = prayerTimes ? getNextPrayer(prayerTimes) : null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-mosque-green-700 mb-2">
        Gebetszeiten – Pocking
      </h1>
      <p className="text-gray-600 mb-8">
        Automatisch berechnete Gebetszeiten und Iqāmah-Zeiten unserer Moschee.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Prayer Times */}
        <PrayerTimesCard times={prayerTimes} nextPrayer={nextPrayer} />

        {/* Iqāmah Times */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="bg-mosque-gold-400 text-mosque-green-900 px-6 py-3">
            <h3 className="text-lg font-semibold">Iqāmah-Zeiten</h3>
          </div>
          <div className="p-6 space-y-2">
            {(["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"] as const).map(
              (key) => (
                <div
                  key={key}
                  className="flex justify-between items-center py-2 px-3 rounded-lg hover:bg-gray-50"
                >
                  <span className="font-medium text-gray-700">
                    {PRAYER_NAMES[key].de}
                  </span>
                  <span className="font-mono text-gray-600">
                    {defaultIqamah[key]}
                  </span>
                </div>
              )
            )}
          </div>
        </div>
      </div>

      {/* Jumuʿah */}
      <div className="mt-8 bg-mosque-green-50 rounded-xl p-6 border-2 border-mosque-green-200">
        <h2 className="text-xl font-bold text-mosque-green-700 mb-3">
          🕌 Jumuʿah (Freitagsgebet)
        </h2>
        <div className="flex gap-8">
          <div>
            <span className="text-sm text-gray-500">Beginn</span>
            <p className="text-2xl font-bold text-mosque-green-700">
              {jumahTime.begins}
            </p>
          </div>
          <div>
            <span className="text-sm text-gray-500">Iqāmah</span>
            <p className="text-2xl font-bold text-mosque-gold-500">
              {jumahTime.iqamah}
            </p>
          </div>
        </div>
      </div>

      {/* Mawaqit Link */}
      <div className="mt-8 text-center">
        <a
          href="https://mawaqit.net"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-mosque-green-600 hover:underline font-medium"
        >
          📱 Mawaqit App für mobile Gebetszeiten →
        </a>
      </div>
    </div>
  );
}
