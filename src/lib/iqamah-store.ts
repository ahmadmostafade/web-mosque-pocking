import { getAllIqamahTimes, upsertIqamahTime } from "./db-iqamah";

export interface IqamahTimes {
  Fajr: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
  Jummah: string;
  lastUpdated: string;
}

export function getIqamahTimes(): IqamahTimes {
  const dbTimes = getAllIqamahTimes();
  const times: Partial<IqamahTimes> = {
    Jummah: "13:45", // Fixed time for Jummah
  };

  let lastUpdated = new Date(0).toISOString();

  dbTimes.forEach((time) => {
    if (time.prayer_name === "Maghrib") {
      times[time.prayer_name] = `+${time.offset_minutes} min`;
    } else {
      // For other prayers, we store offset but display as fixed time
      // In a real implementation, you'd calculate from prayer times API
      times[time.prayer_name as keyof IqamahTimes] = formatOffsetAsTime(
        time.offset_minutes
      );
    }
    if (time.updated_at > lastUpdated) {
      lastUpdated = time.updated_at;
    }
  });

  return {
    Fajr: times.Fajr || "06:00",
    Dhuhr: times.Dhuhr || "13:00",
    Asr: times.Asr || "16:00",
    Maghrib: times.Maghrib || "+10 min",
    Isha: times.Isha || "20:00",
    Jummah: times.Jummah || "13:45",
    lastUpdated,
  };
}

function formatOffsetAsTime(offsetMinutes: number): string {
  // This is a simplified version - in production, calculate from actual prayer times
  const baseHours: Record<string, number> = {
    Fajr: 6,
    Dhuhr: 13,
    Asr: 16,
    Isha: 20,
  };
  return `${offsetMinutes} min after`;
}

export function updateIqamahTimes(
  times: Partial<Omit<IqamahTimes, "lastUpdated">>,
  updatedBy: string = "admin"
): IqamahTimes {
  Object.entries(times).forEach(([prayer, value]) => {
    if (prayer === "Jummah") return; // Skip Jummah, it's fixed

    let offsetMinutes = 15; // default
    if (typeof value === "string") {
      if (value.includes("+")) {
        offsetMinutes = parseInt(value.replace(/\D/g, "")) || 10;
      } else {
        // Parse time string to offset (simplified)
        offsetMinutes = 15;
      }
    }

    upsertIqamahTime(prayer, offsetMinutes, updatedBy);
  });

  return getIqamahTimes();
}

export function resetIqamahStore(): void {
  // For testing purposes
  const prayers = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];
  prayers.forEach((prayer) => {
    upsertIqamahTime(prayer, prayer === "Maghrib" ? 10 : 15, "system");
  });
}
