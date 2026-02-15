export interface Event {
  id: string;
  title: string;
  date: string;
  description: string;
  imageUrl?: string;
}

let events: Event[] = [
  {
    id: "evt-1",
    title: "Freitagsgebet",
    date: "2026-02-20",
    description: "Wöchentliches Freitagsgebet mit Khutba.",
  },
  {
    id: "evt-2",
    title: "Gemeinschaftliches Iftar",
    date: "2026-03-01",
    description: "Gemeinsames Fastenbrechen während des Ramadan.",
  },
];

export function getEvents(): Event[] {
  return [...events];
}

export function getUpcomingEvents(): Event[] {
  const today = new Date().toISOString().split("T")[0];
  return events.filter((e) => e.date >= today);
}

export function getPastEvents(): Event[] {
  const today = new Date().toISOString().split("T")[0];
  return events.filter((e) => e.date < today);
}

export function addEvent(event: Omit<Event, "id">): Event {
  const newEvent: Event = {
    ...event,
    id: `evt-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
  };
  events.push(newEvent);
  return newEvent;
}

export function resetEventsStore(): void {
  events = [];
}
