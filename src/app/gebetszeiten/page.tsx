import { Metadata } from "next";
import { fetchPrayerTimes, getNextPrayer } from "@/lib/prayer-times";
import { getIqamahTimes } from "@/lib/iqamah-store";
import { getJummahTimes } from "@/lib/db-jummah";
import PrayerTimesCard from "@/components/PrayerTimesCard";

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
    <div className="page-container-narrow page-section">
      <h1 className="text-3xl font-bold text-mosque-green-700 mb-2">
        Gebetszeiten – Pocking
      </h1>
      <p className="text-gray-600 mb-8">
        Automatisch berechnete Gebetszeiten und Iqāmah-Zeiten unserer Moschee.
      </p>

      <div className="mb-8">
        <PrayerTimesCard
          times={prayerTimes}
          nextPrayer={nextPrayer}
          iqamah={iqamah}
          showDate
        />
      </div>

      {/* Jummah Card */}
      <div className="bg-mosque-green-50 rounded-xl p-6 border-2 border-mosque-green-200">
        <h2 className="text-xl font-bold text-mosque-green-700 mb-4">
          🕌 Jumuʿah (Freitagsgebet)
        </h2>
        <div>
          <span className="text-sm text-gray-600 font-medium">Khutba</span>
          <p className="text-3xl font-bold text-mosque-green-700">
            {jummah.khutba_time}
          </p>
        </div>
      </div>
    </div>
  );
}
