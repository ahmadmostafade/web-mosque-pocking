import { Metadata } from "next";
import AnimateOnScroll from "@/components/AnimateOnScroll";

export const metadata: Metadata = {
  title: "Über uns",
  description:
    "Erfahren Sie mehr über das Islamische Bildungsforum Pocking e.V. und die Moschee Ibad ar-Rahman.",
};

export default function UeberUnsPage() {
  return (
    <div className="page-container-narrow page-section">
      <h1 className="text-3xl font-bold text-mosque-green-700 mb-8">
        Über uns
      </h1>

      <AnimateOnScroll animation="fade-up">
        <div className="bg-white rounded-xl shadow-md p-8 mb-8">
          <h2 className="text-xl font-bold text-mosque-green-700 mb-4">
            Eine einmalige Gelegenheit für unseren Verein
          </h2>
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>
              Das Islamische Bildungsforum Pocking e.V. steht vor einer
              besonderen Gelegenheit: Nach langer Suche hat sich die Möglichkeit
              ergeben, ein eigenes Gebäude für unsere Moschee Ibad ar-Rahman
              (مسجد عباد الرحمن) zu erwerben. Für unseren Verein in Pocking ist
              das ein großer Schritt und eine Chance, einen dauerhaften Ort für
              Gebet, Bildung und Gemeinschaft zu schaffen.
            </p>
            <p>
              Das Hauptgebäude wurde um 1870 errichtet, der Anbau aus dem Jahr
              1930 wird derzeit bereits als Moschee genutzt. Insgesamt umfasst
              das Objekt rund 240 m², die Grundfläche beträgt etwa 130 m².
              Damit bietet das Gebäude ausreichend Raum, um Gebet, Unterricht
              und gemeinschaftliche Aktivitäten langfristig zu ermöglichen.
            </p>
          </div>
        </div>
      </AnimateOnScroll>

      <AnimateOnScroll animation="fade-up" delay={100}>
        <div className="bg-white rounded-xl shadow-md p-8 mb-8">
          <h2 className="text-xl font-bold text-mosque-green-700 mb-4">
            Aktueller Stand des Projekts
          </h2>
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>
              Der Verkäufer hat uns bereits am 01.02.2026 die Schlüssel
              übergeben, sodass wir mit der Einrichtung beginnen und Spenden
              sammeln konnten. Damit konnten erste Vorbereitungen getroffen und
              notwendige Schritte eingeleitet werden, um das Gebäude langfristig
              nutzbar zu machen.
            </p>
            <p>
              Der Erwerb und die Herrichtung des Gebäudes sind jedoch mit
              erheblichen Kosten verbunden. Insgesamt rechnen wir derzeit mit
              einem finanziellen Bedarf von rund 60.000 €. Darin enthalten sind
              neben dem Gebäude selbst auch Nebenkosten wie notwendige
              Renovierungskosten, Notar- und Abgaben, die im Rahmen eines
              solchen Kaufs anfallen.
            </p>
          </div>
        </div>
      </AnimateOnScroll>

      <AnimateOnScroll animation="fade-up" delay={200}>
        <div className="bg-white rounded-xl shadow-md p-8 mb-8">
          <h2 className="text-xl font-bold text-mosque-green-700 mb-4">
            Notwendige bauliche Maßnahmen
          </h2>
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>
              Damit die Moschee Ibad ar-Rahman dauerhaft nutzbar und würdig
              wird, stehen noch wichtige Arbeiten an:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>
                Isolierung der Außenwände, da derzeit Feuchtigkeit eindringt
              </li>
              <li>
                Einbau einer Fußbodenheizung, da kein Keller vorhanden ist und
                der Boden stark auskühlt
              </li>
              <li>Anschaffung von Teppichen für den Gebetsraum</li>
              <li>
                Langfristig: Erweiterung und Ausbau, um mehr Platz zu schaffen
              </li>
            </ul>
            <p>
              Diese Maßnahmen sind notwendig, um einen sicheren, sauberen und
              angenehmen Gebetsraum zu gewährleisten, und sie verursachen
              zusätzliche Kosten.
            </p>
          </div>
        </div>
      </AnimateOnScroll>

      <AnimateOnScroll animation="fade-up" delay={300}>
        <div className="bg-white rounded-xl shadow-md p-8 mb-8">
          <h2 className="text-xl font-bold text-mosque-green-700 mb-4">
            Bereits geleistete Eigenarbeit
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Alhamdulillah hat der Verein bereits vieles in Eigenleistung
            umgesetzt. Renovierungsarbeiten, Vorbereitung der Räume und erste
            Gestaltungsmaßnahmen wurden mit großem Einsatz, Zeit und Engagement
            unserer Mitglieder realisiert (siehe Bilder). Dennoch liegt noch ein
            weiter Weg vor uns, bis das Gebäude vollständig finanziert und
            baulich abgeschlossen ist. Wir haben uns erst darauf vorbereitet,
            die erste Etage vorzubereiten. Die obere Etage braucht noch viel
            Arbeit, Zeit und finanzielle Mittel.
          </p>
        </div>
      </AnimateOnScroll>

      <AnimateOnScroll animation="fade-up" delay={400}>
        <div className="bg-white rounded-xl shadow-md p-8 mb-8">
          <h2 className="text-xl font-bold text-mosque-green-700 mb-4">
            Warum deine Spende wichtig ist
          </h2>
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>Mit deiner Spende unterstützt du konkret:</p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>
                den dauerhaften Erhalt der Moschee Ibad ar-Rahman (مسجد عباد
                الرحمن)
              </li>
              <li>einen festen Ort für Gebet, Qur&apos;an und Unterricht</li>
              <li>
                islamische Bildungsangebote für Kinder, Jugendliche und
                Erwachsene
              </li>
              <li>
                die langfristige Arbeit eines islamischen Vereins in Pocking
              </li>
            </ul>
            <p>
              Jede Spende – ob groß oder klein – hilft uns, dieses Ziel zu
              erreichen.
            </p>
          </div>
        </div>
      </AnimateOnScroll>

      <AnimateOnScroll animation="fade-up" delay={500}>
        <div className="bg-mosque-green-50 rounded-xl p-8">
          <h2 className="text-xl font-bold text-mosque-green-700 mb-4">
            Gemeinsam Verantwortung übernehmen
          </h2>
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>
              Wir laden dich herzlich ein, Teil dieses Projekts zu werden. Wer
              die Moschee Ibad ar-Rahman unterstützt, hilft nicht nur bei der
              Finanzierung eines Gebäudes, sondern beim Aufbau eines Ortes, der
              langfristig dem Gebet, dem Wissen und der Gemeinschaft dienen
              soll.
            </p>
            <p>
              Möge Allah jede Unterstützung annehmen, sie vervielfachen und
              dieses Vorhaben segnen. Amin.
            </p>
          </div>
        </div>
      </AnimateOnScroll>
    </div>
  );
}
