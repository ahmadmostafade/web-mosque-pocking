import { getAllIqamahTimes, upsertIqamahTime } from "./db-iqamah";

export interface IqamahTimes {
  Fajr: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
  lastUpdated: string;
}

export async function getIqamahTimes(): Promise<IqamahTimes> {
  const dbTimes = await getAllIqamahTimes();
  const times: Partial<IqamahTimes> = {};

  let lastUpdated = new Date(0).toISOString();

  dbTimes.forEach((time) => {
    times[time.prayer_name as keyof IqamahTimes] = `+${time.offset_minutes} min`;
    if (time.updated_at > lastUpdated) {
      lastUpdated = time.updated_at;
    }
  });

  return {
    Fajr: times.Fajr || "+30 min",
    Dhuhr: times.Dhuhr || "+10 min",
    Asr: times.Asr || "+10 min",
    Maghrib: times.Maghrib || "+5 min",
    Isha: times.Isha || "+10 min",
    lastUpdated,
  };
}

export async function updateIqamahTimes(
  times: Partial<Omit<IqamahTimes, "lastUpdated">>,
  updatedBy: string = "admin"
): Promise<IqamahTimes> {
  for (const [prayer, value] of Object.entries(times)) {
    let offsetMinutes = 15; // default
    if (typeof value === "string") {
      // Parse "+X min" format
      const match = value.match(/\+?(\d+)/);
      if (match) {
        offsetMinutes = parseInt(match[1]);
      }
    }

    await upsertIqamahTime(prayer, offsetMinutes, updatedBy);
  }

  return getIqamahTimes();
}

export async function resetIqamahStore(): Promise<void> {
  // For testing purposes
  const prayers = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];
  for (const prayer of prayers) {
    await upsertIqamahTime(prayer, prayer === "Maghrib" ? 5 : 15, "system");
  }
}
