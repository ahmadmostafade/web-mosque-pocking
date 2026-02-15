import { PrayerTimesData } from "@/lib/prayer-times";
import { PRAYER_NAMES } from "@/lib/constants";

interface Props {
  times: PrayerTimesData | null;
  nextPrayer?: { name: string; time: string } | null;
  compact?: boolean;
}

const displayPrayers = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"] as const;

export default function PrayerTimesCard({
  times,
  nextPrayer,
  compact = false,
}: Props) {
  if (!times) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6 text-center text-gray-500">
        Gebetszeiten konnten nicht geladen werden.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="bg-mosque-green-700 text-white px-6 py-3">
        <h3 className="text-lg font-semibold">
          🕌 Gebetszeiten – Pocking
        </h3>
      </div>

      <div className={compact ? "p-4" : "p-6"}>
        <div className="space-y-2">
          {displayPrayers.map((key) => {
            const isNext = nextPrayer?.name === key;
            return (
              <div
                key={key}
                className={`flex justify-between items-center py-2 px-3 rounded-lg ${
                  isNext
                    ? "bg-mosque-gold-100 border border-mosque-gold-400"
                    : "hover:bg-gray-50"
                }`}
              >
                <span className="font-medium text-gray-700">
                  {PRAYER_NAMES[key].de}
                  <span className="text-gray-400 text-sm ml-2">
                    {PRAYER_NAMES[key].ar}
                  </span>
                </span>
                <span
                  className={`font-mono ${
                    isNext
                      ? "text-mosque-green-700 font-bold"
                      : "text-gray-600"
                  }`}
                >
                  {times[key]}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
