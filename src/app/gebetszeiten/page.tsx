import { Metadata } from "next";
import { fetchPrayerTimes, getNextPrayer } from "@/lib/prayer-times";
import { getIqamahTimes } from "@/lib/iqamah-store";
import { getJummahTimes } from "@/lib/db-jummah";
import { PRAYER_NAMES } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Gebetszeiten",
  description: "Aktuelle Gebetszeiten und Iqāmah-Zeiten für Pocking.",
};

export default async function GebetszeitenPage() {
  const prayerTimes = await fetchPrayerTimes();
  const nextPrayer = prayerTimes ? getNextPrayer(prayerTimes) : null;
  const iqamah = getIqamahTimes();
  const jummah = getJummahTimes();

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-mosque-green-700 mb-2">
        Gebetszeiten – Pocking
      </h1>
      <p className="text-gray-600 mb-8">
        Automatisch berechnete Gebetszeiten und Iqāmah-Zeiten unserer Moschee.
      </p>

      {/* Combined Prayer Times Card */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
        <div className="bg-mosque-green-700 text-white px-6 py-4">
          <h2 className="text-xl font-semibold">Gebetszeiten & Iqāmah</h2>
          <p className="text-sm text-mosque-green-100 mt-1">
            {new Date().toLocaleDateString("de-DE", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        <div className="p-6">
          {prayerTimes ? (
            <div className="space-y-3">
              {(["Fajr", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha"] as const).map(
                (key) => {
                  const isNext = nextPrayer?.name === key;
                  const isSunrise = key === "Sunrise";
                  const iqamahTime = !isSunrise && iqamah[key as keyof typeof iqamah];

                  return (
                    <div
                      key={key}
                      className={`flex justify-between items-center py-3 px-4 rounded-lg transition-colors ${
                        isNext
                          ? "bg-mosque-gold-100 border-2 border-mosque-gold-400"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {isNext && (
                          <span className="text-mosque-gold-500 text-xl">▶</span>
                        )}
                        <div>
                          <span className="font-semibold text-gray-800">
                            {PRAYER_NAMES[key].de}
                          </span>
                          <span className="text-gray-500 text-sm ml-2">
                            {PRAYER_NAMES[key].ar}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-mono text-lg font-semibold text-gray-800">
                          {prayerTimes[key]}
                        </span>
                        {iqamahTime && (
                          <span className="text-sm text-mosque-green-600 font-medium min-w-[60px] text-right">
                            {iqamahTime}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">
              Gebetszeiten konnten nicht geladen werden.
            </p>
          )}
        </div>
      </div>

      {/* Jummah Card */}
      <div className="bg-mosque-green-50 rounded-xl p-6 border-2 border-mosque-green-200">
        <h2 className="text-xl font-bold text-mosque-green-700 mb-4 flex items-center gap-2">
          🕌 Jumuʿah (Freitagsgebet)
        </h2>
        <div className="flex gap-8">
          <div>
            <span className="text-sm text-gray-600 font-medium">Khutba</span>
            <p className="text-3xl font-bold text-mosque-green-700">
              {jummah.khutba_time}
            </p>
          </div>
          <div>
            <span className="text-sm text-gray-600 font-medium">Iqāmah</span>
            <p className="text-3xl font-bold text-mosque-gold-500">
              {jummah.iqamah_time}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
