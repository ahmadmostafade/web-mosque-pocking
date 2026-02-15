export interface IqamahTimes {
  Fajr: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
  Jummah: string;
  lastUpdated: string;
}

let iqamahTimes: IqamahTimes = {
  Fajr: "06:00",
  Dhuhr: "13:00",
  Asr: "16:00",
  Maghrib: "+10 min",
  Isha: "20:00",
  Jummah: "13:45",
  lastUpdated: new Date().toISOString(),
};

export function getIqamahTimes(): IqamahTimes {
  return { ...iqamahTimes };
}

export function updateIqamahTimes(
  times: Partial<Omit<IqamahTimes, "lastUpdated">>
): IqamahTimes {
  iqamahTimes = {
    ...iqamahTimes,
    ...times,
    lastUpdated: new Date().toISOString(),
  };
  return { ...iqamahTimes };
}

export function resetIqamahStore(): void {
  iqamahTimes = {
    Fajr: "06:00",
    Dhuhr: "13:00",
    Asr: "16:00",
    Maghrib: "+10 min",
    Isha: "20:00",
    Jummah: "13:45",
    lastUpdated: new Date().toISOString(),
  };
}
