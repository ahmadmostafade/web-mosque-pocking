import { SITE_CONFIG } from "./constants";

export interface PrayerTimesData {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
}

export interface PrayerApiResponse {
  code: number;
  status: string;
  data: {
    timings: Record<string, string>;
    date: {
      readable: string;
      hijri: { date: string; month: { en: string; ar: string } };
    };
  };
}

export async function fetchPrayerTimes(
  date?: Date
): Promise<PrayerTimesData | null> {
  const d = date || new Date();
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();

  const { latitude, longitude } = SITE_CONFIG.location;
  const method = SITE_CONFIG.prayerApi.method;

  const url = `${SITE_CONFIG.prayerApi.baseUrl}/timings/${dd}-${mm}-${yyyy}?latitude=${latitude}&longitude=${longitude}&method=${method}`;

  try {
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) return null;

    const json: PrayerApiResponse = await res.json();
    const t = json.data.timings;

    return {
      Fajr: t.Fajr,
      Sunrise: t.Sunrise,
      Dhuhr: t.Dhuhr,
      Asr: t.Asr,
      Maghrib: t.Maghrib,
      Isha: t.Isha,
    };
  } catch {
    return null;
  }
}

export function getNextPrayer(
  times: PrayerTimesData
): { name: string; time: string } | null {
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const prayers = (
    ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"] as const
  ).map((name) => {
    const [h, m] = times[name].split(":").map(Number);
    return { name, time: times[name], minutes: h * 60 + m };
  });

  const next = prayers.find((p) => p.minutes > currentMinutes);
  return next ? { name: next.name, time: next.time } : null;
}
