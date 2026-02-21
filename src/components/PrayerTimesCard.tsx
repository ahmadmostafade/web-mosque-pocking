import { PrayerTimesData } from "@/lib/prayer-times";
import { PRAYER_NAMES } from "@/lib/constants";

interface IqamahTimes {
  Fajr?: string;
  Dhuhr?: string;
  Asr?: string;
  Maghrib?: string;
  Isha?: string;
}

interface Props {
  times: PrayerTimesData | null;
  nextPrayer?: { name: string; time: string } | null;
  iqamah?: IqamahTimes;
  showDate?: boolean;
}

const PRAYERS_SIMPLE = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"] as const;
const PRAYERS_FULL = ["Fajr", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha"] as const;

export default function PrayerTimesCard({ times, nextPrayer, iqamah, showDate = false }: Props) {
  const withIqamah = !!iqamah;
  const prayers = withIqamah ? PRAYERS_FULL : PRAYERS_SIMPLE;

  if (!times) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6 text-center text-gray-500">
        Gebetszeiten konnten nicht geladen werden.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      {/* Header */}
      <div className="bg-mosque-green-700 text-white px-6 py-4">
        <h3 className="text-lg font-semibold">🕌 Gebetszeiten – Pocking</h3>
        {showDate && (
          <p className="text-sm text-mosque-green-100 mt-1">
            {new Date().toLocaleDateString("de-DE", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        )}
      </div>

      {/* Table */}
      <div className="p-4 sm:p-6">
        <table className="w-full">
          {withIqamah && (
            <thead>
              <tr className="border-b-2 border-gray-100">
                <th className="text-left py-2 px-3 text-sm font-semibold text-gray-500">Gebet</th>
                <th className="text-center py-2 px-3 text-sm font-semibold text-gray-500">Adhan</th>
                <th className="text-center py-2 px-3 text-sm font-semibold text-gray-500">Iqāmah</th>
              </tr>
            </thead>
          )}
          <tbody>
            {prayers.map((key) => {
              const isNext = nextPrayer?.name === key;
              const isSunrise = key === "Sunrise";
              const iqamahTime = withIqamah && !isSunrise
                ? iqamah![key as keyof IqamahTimes]
                : undefined;

              return (
                <tr
                  key={key}
                  className={`border-b border-gray-50 last:border-0 transition-all duration-200 ${
                    isNext
                      ? "bg-mosque-green-100 border-l-4 border-l-mosque-green-600 shadow-sm"
                      : "hover:bg-gray-50 hover:translate-x-0.5"
                  }`}
                >
                  {/* Prayer name */}
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <span className={`font-medium ${isNext ? "text-mosque-green-800" : "text-gray-700"}`}>
                        {PRAYER_NAMES[key].de}
                      </span>
                      <span className="text-gray-400 text-sm hidden sm:inline">
                        {PRAYER_NAMES[key].ar}
                      </span>
                    </div>
                  </td>

                  {/* Adhan time */}
                  <td className={`py-3 px-3 ${withIqamah ? "text-center" : "text-right"}`}>
                    <span className={`font-mono font-semibold ${
                      isNext ? "text-mosque-green-700 text-base" : "text-gray-700"
                    }`}>
                      {times[key]}
                    </span>
                  </td>

                  {/* Iqamah time (full mode only) */}
                  {withIqamah && (
                    <td className="py-3 px-3 text-center">
                      {iqamahTime ? (
                        <span className="text-mosque-green-600 font-medium">{iqamahTime}</span>
                      ) : (
                        <span className="text-gray-300">—</span>
                      )}
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
