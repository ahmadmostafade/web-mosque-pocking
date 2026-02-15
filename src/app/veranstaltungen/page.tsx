import { Metadata } from "next";
import { getEventSchema } from "@/lib/structured-data";
import { getUpcomingEvents, getPastEvents } from "@/lib/events-store";

export const metadata: Metadata = {
  title: "Veranstaltungen",
  description: "Aktuelle und kommende Veranstaltungen der Moschee Pocking.",
};

export default function VeranstaltungenPage() {
  const upcoming = getUpcomingEvents();
  const past = getPastEvents();

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {upcoming.map((event) => (
        <script
          key={`ld-${event.id}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(getEventSchema(event)),
          }}
        />
      ))}
      <h1 className="text-3xl font-bold text-mosque-green-700 mb-8">
        Veranstaltungen
      </h1>

      {upcoming.length === 0 && past.length === 0 ? (
        <p className="text-gray-500">Noch keine Veranstaltungen vorhanden.</p>
      ) : null}

      {upcoming.length > 0 && (
        <div className="space-y-4">
          {upcoming.map((event) => (
            <div
              key={event.id}
              className="bg-white rounded-xl shadow-md p-6 border-l-4 border-mosque-green-500"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-lg font-bold text-mosque-green-700">
                    {event.title}
                  </h2>
                  <p className="text-gray-600 mt-1">{event.description}</p>
                </div>
                <span className="text-sm text-gray-500 whitespace-nowrap ml-4">
                  {new Date(event.date).toLocaleDateString("de-DE", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {past.length > 0 && (
        <div className="mt-12">
          <h2 className="text-xl font-bold text-gray-500 mb-4">
            Vergangene Veranstaltungen
          </h2>
          <div className="space-y-4 opacity-70">
            {past.map((event) => (
              <div
                key={event.id}
                className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-gray-300"
              >
                <h3 className="font-bold text-gray-600">{event.title}</h3>
                <p className="text-gray-500 text-sm mt-1">
                  {new Date(event.date).toLocaleDateString("de-DE")}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
