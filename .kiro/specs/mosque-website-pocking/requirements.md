# Anforderungsdokument – Moschee-Website Pocking

## Einleitung

Die Moschee-Gemeinde in Pocking, Deutschland, hat ein Gebäude für 60.000 € erworben und führt derzeit Renovierungs- und Instandhaltungsarbeiten durch. Diese Website dient als zentrale Plattform für Spendensammlung, Gemeindeinformation, Gebetszeiten und Transparenz. Die Website wird mit React/Next.js (App Router), TypeScript und Tailwind CSS als vollständig maßgeschneiderte Lösung entwickelt – kein WordPress. Ein zentrales Ziel ist ein einfaches Content-Management-System (CMS), das ohne Entwicklerkenntnisse bedienbar ist.

## Glossar

- **Website**: Die Next.js-Webanwendung für die Moschee Pocking
- **Admin_Dashboard**: Die geschützte Verwaltungsoberfläche zur Pflege aller Inhalte
- **Spenden_Tracker**: Die Komponente, die den aktuellen Spendenstand und Fortschritt anzeigt
- **Gebetszeiten_Modul**: Die Komponente zur Anzeige und Verwaltung von Gebets- und Iqāmah-Zeiten
- **CMS**: Das integrierte Content-Management-System zur Inhaltspflege, basierend auf einer relationalen Datenbank (Supabase/PostgreSQL) mit definiertem Datenmodell
- **Besucher**: Eine Person, die die öffentliche Website aufruft
- **Administrator**: Eine autorisierte Person, die Inhalte über das Admin_Dashboard verwaltet
- **Spender**: Eine Person, die eine Spende über die Website tätigt
- **Donation_Progress**: Der aktuelle Spendenstand berechnet als: Sum(manual_donations) + Sum(stripe_webhook_donations) + optional manual_adjustment. Angezeigt als Betrag und Prozentsatz des Zielbetrags (60.000 €)
- **Iqāmah_Zeiten**: Die vom Administrator manuell festgelegten Gebetsbeginne in der Moschee
- **DSGVO**: Datenschutz-Grundverordnung – die europäische Datenschutzrichtlinie
- **Cookie_Banner**: Das Einwilligungselement für Cookies gemäß DSGVO
- **Impressum**: Die gesetzlich vorgeschriebene Anbieterkennzeichnung nach deutschem Recht
- **QR_Code**: Ein automatisch generierter QR-Code mit den Bankdaten für Überweisungen
- **Event**: Eine Veranstaltung oder Gemeinschaftsaktion der Moschee
- **Medien_Galerie**: Die Komponente zur Anzeige von Fotos und Videos
- **Prayer_API**: Eine externe API (Aladhan) zur Berechnung der Gebetszeiten basierend auf dem Standort Pocking
- **Audit_Log**: Protokoll aller administrativen Änderungen (wer, wann, was) für Transparenz und Nachvollziehbarkeit
- **Rate_Limiter**: Mechanismus zur Begrenzung von Anfragen pro Zeiteinheit zum Schutz vor Brute-Force-Angriffen

## Entwicklungs-Roadmap

### Phase 1 – MVP (Kernfunktionalität)
- Startseite mit Moschee-Vorstellung und Spendenfortschritt
- Spendenseite mit QR-Code, IBAN, PayPal-Button
- Gebetszeiten-Seite (Prayer_API + Iqāmah)
- Rechtliche Seiten (Impressum, Datenschutz, Cookie-Banner)
- Kontaktseite mit Formular
- Responsive Design (Mobile-First)
- Basis-SEO (Meta-Tags, JSON-LD)

### Phase 2 – Admin & Medien
- Admin-Dashboard mit Authentifizierung
- Content-Management für alle Seitenabschnitte
- Medien-Upload und Galerie-Verwaltung
- Veranstaltungsseite und Event-Management
- Blog/News-Sektion
- Audit-Logging

### Phase 3 – Erweiterungen
- Stripe-Kreditkartenzahlung (optional)
- Automatische Donation-Tracking via Webhooks
- Gebetszeiten-PDF-Download
- Kalender-Integration (iCal)
- Erweiterte SEO-Schemas

## Anforderungen

---

### Anforderung 1: Seitenstruktur und Navigation

**User Story:** Als Besucher möchte ich eine klar strukturierte Website mit einfacher Navigation, damit ich schnell die gewünschten Informationen finde.

#### Akzeptanzkriterien

1. THE Website SHALL eine responsive Navigation mit folgenden Hauptseiten bereitstellen: Startseite, Über uns/Trägerverein, Gebetszeiten, Spenden/Moscheekauf, Veranstaltungen, Kontakt, Impressum und Datenschutz
2. WHEN ein Besucher die Website auf einem mobilen Gerät aufruft, THE Website SHALL eine mobile-optimierte Navigation (Hamburger-Menü) anzeigen
3. THE Website SHALL ein zweisprachiges Layout unterstützen mit Deutsch als Primärsprache und Arabisch als Sekundärsprache
4. WHEN arabische Inhalte angezeigt werden, THE Website SHALL die Textrichtung auf RTL (Right-to-Left) umschalten
5. THE Website SHALL ein visuelles Design mit moschee-gerechten Farben verwenden (Grüntöne, Gold, Weiß)

---

### Anforderung 2: Startseite (Homepage)

**User Story:** Als Besucher möchte ich auf der Startseite die wichtigsten Informationen auf einen Blick sehen, damit ich sofort über die Moschee, den Spendenstand und die nächsten Gebetszeiten informiert bin.

#### Akzeptanzkriterien

1. WHEN ein Besucher die Startseite aufruft, THE Website SHALL eine kurze Einführung der Moschee, den aktuellen Spendenfortschrittsbalken, einen Call-to-Action-Button „Jetzt spenden – Moschee kaufen", die heutigen Gebetszeiten mit nächster Gebetszeit und einen Hinweis auf die nächste Veranstaltung anzeigen
2. WHEN der Spendenstand im Admin_Dashboard aktualisiert wird, THE Spenden_Tracker SHALL den Fortschrittsbalken auf der Startseite mit dem neuen Betrag und Prozentsatz aktualisieren
3. WHEN ein Besucher auf den „Jetzt spenden"-Button klickt, THE Website SHALL den Besucher zur Spendenseite weiterleiten

---

### Anforderung 3: Projektseite „Moscheekauf – 60.000 €"

**User Story:** Als Besucher möchte ich den vollständigen Projektüberblick zum Moscheekauf sehen, damit ich verstehe, wofür die Spenden verwendet werden und wie weit das Projekt fortgeschritten ist.

#### Akzeptanzkriterien

1. THE Website SHALL auf der Projektseite eine klare Projektbeschreibung, den Zielbetrag von 60.000 €, einen Live-Spendenfortschrittsbalken mit gesammeltem Betrag und Restbetrag, eine Prozentanzeige und einen automatischen Zeitstempel der letzten Aktualisierung anzeigen
2. THE Website SHALL einen Transparenztext bereitstellen, der erklärt, wofür die Spenden verwendet werden
3. THE Website SHALL eine Fotogalerie mit chronologischer Erzählung anzeigen (leer → gereinigt → in Nutzung)
4. WHEN der Administrator den Spendenstand aktualisiert, THE Spenden_Tracker SHALL den Zeitstempel der letzten Aktualisierung automatisch setzen
5. WHEN ein Besucher die Projektseite aufruft, THE Website SHALL den Donation_Progress als Fortschrittsbalken mit Prozentanzeige, gesammeltem Betrag und Restbetrag darstellen

---

### Anforderung 4: Spendensystem und Donation-Tracking

**User Story:** Als Spender möchte ich auf verschiedene Weisen spenden können, damit ich die für mich bequemste Zahlungsmethode nutzen kann.

#### Akzeptanzkriterien

1. THE Website SHALL einen PayPal-Spenden-Button bereitstellen
2. THE Website SHALL die Bankverbindung (IBAN) sichtbar anzeigen und einen automatisch generierten QR_Code für Banküberweisungen bereitstellen
3. WHEN ein Besucher den QR_Code scannt, THE QR_Code SHALL die vollständigen Bankdaten inklusive Verwendungszweck „Moscheekauf" enthalten
4. THE Website SHALL ein Spendenformular mit folgenden Feldern bereitstellen: freie Betragseingabe, Verwendungszweck „Moscheekauf" und Option für anonyme Spende
5. IF ein Spender eine ungültige Eingabe im Spendenformular macht (z.B. negativer Betrag, leeres Pflichtfeld), THEN THE Website SHALL eine verständliche Fehlermeldung anzeigen und die Übermittlung verhindern
6. THE Website SHALL alle Spendenprozesse DSGVO-konform gestalten und keine personenbezogenen Daten ohne Einwilligung speichern
7. THE Donation_Progress SHALL berechnet werden als: Sum(manual_donations) + Sum(stripe_webhook_donations) + manual_adjustment, wobei jede Quelle separat nachvollziehbar gespeichert wird
8. WHEN eine Stripe-Zahlung erfolgreich verarbeitet wird (Phase 3), THE Website SHALL den Betrag automatisch via Webhook zum Donation_Progress addieren
9. WHEN der Administrator eine manuelle Spende (z.B. Banküberweisung) im Admin_Dashboard einträgt, THE CMS SHALL den Betrag, das Datum und optional den Spendernamen speichern und den Donation_Progress aktualisieren
10. THE Admin_Dashboard SHALL eine Übersicht aller Spendenquellen (manuell, Stripe) mit Einzelbeträgen und Gesamtsumme anzeigen

---

### Anforderung 5: Spendenmotivation

**User Story:** Als Besucher möchte ich eine würdevolle und sachliche Motivation zum Spenden sehen, damit ich den religiösen und gemeinschaftlichen Wert meiner Spende verstehe.

#### Akzeptanzkriterien

1. THE Website SHALL einen kurzen islamischen Motivationstext anzeigen, der würdevoll und sachlich formuliert ist
2. THE Website SHALL ein Hadith oder einen Qurʾān-Vers anzeigen, ohne Übertreibung
3. THE Website SHALL eine Erklärung des Konzepts Ṣadaqa Jāriya bereitstellen
4. THE Website SHALL einen klaren Hinweis anzeigen, dass jede Spende zählt
5. THE Website SHALL einen wiederholten „Jetzt spenden"-Button in der Motivationssektion bereitstellen

---

### Anforderung 6: Gebetszeiten und Iqāmah

**User Story:** Als Besucher möchte ich die aktuellen Gebetszeiten und Iqāmah-Zeiten für Pocking sehen, damit ich meine Gebete planen kann.

#### Akzeptanzkriterien

1. WHEN ein Besucher die Gebetszeiten-Seite aufruft, THE Gebetszeiten_Modul SHALL die automatisch berechneten Gebetszeiten für den Standort Pocking anzeigen
2. THE Gebetszeiten_Modul SHALL die Iqāmah_Zeiten neben den berechneten Gebetszeiten anzeigen
3. WHEN der Administrator Iqāmah_Zeiten im Admin_Dashboard ändert, THE Gebetszeiten_Modul SHALL die aktualisierten Zeiten anzeigen
4. THE Gebetszeiten_Modul SHALL die Jumuʿah-Zeit (Freitagsgebet) separat und hervorgehoben anzeigen
5. THE Gebetszeiten_Modul SHALL auf mobilen Geräten optimiert dargestellt werden
6. IF die Prayer_API nicht erreichbar ist, THEN THE Gebetszeiten_Modul SHALL eine Fehlermeldung anzeigen und die zuletzt bekannten Gebetszeiten als Fallback verwenden
7. WHEN ein Besucher die Gebetszeiten-Seite aufruft, THE Gebetszeiten_Modul SHALL einen Link zur Mawaqit-App bereitstellen

---

### Anforderung 7: Veranstaltungen und Gemeinschaft

**User Story:** Als Besucher möchte ich über aktuelle und kommende Veranstaltungen informiert werden, damit ich am Gemeindeleben teilnehmen kann.

#### Akzeptanzkriterien

1. THE Website SHALL eine Veranstaltungsseite mit einer Liste aktueller und kommender Events bereitstellen
2. WHEN der Administrator ein neues Event im Admin_Dashboard erstellt, THE Website SHALL das Event mit Titel, Datum, Beschreibung und optionalem Bild auf der Veranstaltungsseite anzeigen
3. THE Website SHALL eine Fotogalerie von Veranstaltungen anzeigen (ohne Personenabbildungen, z.B. Essen, Aufbau)
4. WHEN ein Event-Datum in der Vergangenheit liegt, THE Website SHALL das Event als vergangen markieren und in einem Archivbereich anzeigen

---

### Anforderung 8: Vertrauen und Transparenz

**User Story:** Als Besucher möchte ich vollständige Informationen über den Trägerverein und die Verwendung der Spenden sehen, damit ich Vertrauen in die Organisation habe.

#### Akzeptanzkriterien

1. THE Website SHALL den vollständigen Vereinsnamen, die Ansprechperson mit Name und Funktion sowie die Zweckbindung der Spenden auf der Über-uns-Seite anzeigen
2. THE Website SHALL eine optionale Blog/News-Sektion für regelmäßige Projektaktualisierungen bereitstellen
3. WHEN der Administrator einen neuen Blog-Beitrag erstellt, THE Website SHALL den Beitrag mit Titel, Datum und Inhalt auf der News-Seite anzeigen

---

### Anforderung 9: Rechtliche Anforderungen (Deutsches Recht)

**User Story:** Als Websitebetreiber möchte ich alle gesetzlichen Anforderungen erfüllen, damit die Website rechtskonform betrieben wird.

#### Akzeptanzkriterien

1. THE Website SHALL ein DSGVO-konformes Cookie_Banner beim ersten Besuch anzeigen
2. WHEN ein Besucher das Cookie_Banner sieht, THE Cookie_Banner SHALL Optionen zum Akzeptieren, Ablehnen und individuellen Konfigurieren von Cookies bereitstellen
3. WHEN ein Besucher Cookies ablehnt, THE Website SHALL keine nicht-essentiellen Cookies setzen und keine Tracking-Dienste laden
4. THE Website SHALL eine vollständige Impressum-Seite mit allen gesetzlich vorgeschriebenen Angaben bereitstellen
5. THE Website SHALL eine vollständige Datenschutzerklärung bereitstellen, die alle verwendeten Dienste (PayPal, Prayer_API, etc.) auflistet
6. THE Website SHALL einen Hinweis über die Nutzung externer Zahlungsdienste (PayPal) in der Datenschutzerklärung enthalten

---

### Anforderung 10: Admin-Dashboard und Content-Management

**User Story:** Als Administrator möchte ich alle Inhalte der Website einfach und ohne Entwicklerkenntnisse verwalten können, damit die Website stets aktuell ist.

#### Akzeptanzkriterien

1. THE Admin_Dashboard SHALL eine geschützte Anmeldeseite mit Benutzername und Passwort bereitstellen
2. IF ein nicht autorisierter Benutzer versucht, auf das Admin_Dashboard zuzugreifen, THEN THE Website SHALL den Zugriff verweigern und zur Anmeldeseite weiterleiten
3. WHEN ein Administrator angemeldet ist, THE Admin_Dashboard SHALL Verwaltungsbereiche für folgende Inhalte bereitstellen: Spendenstand, Gebetszeiten/Iqāmah, Veranstaltungen, Fotos/Videos, Blog/News-Beiträge und statische Seiteninhalte
4. WHEN ein Administrator den Spendenstand im Admin_Dashboard ändert, THE CMS SHALL den neuen Betrag speichern und den Donation_Progress auf allen Seiten aktualisieren
5. WHEN ein Administrator Iqāmah_Zeiten im Admin_Dashboard ändert, THE CMS SHALL die neuen Zeiten speichern und im Gebetszeiten_Modul anzeigen
6. WHEN ein Administrator ein Foto oder Video hochlädt, THE CMS SHALL die Datei speichern und in der Medien_Galerie verfügbar machen
7. THE Admin_Dashboard SHALL eine intuitive Benutzeroberfläche bereitstellen, die einfacher zu bedienen ist als WordPress
8. WHEN ein Administrator Inhalte im Admin_Dashboard bearbeitet, THE CMS SHALL die Änderungen validieren und bei Erfolg eine Bestätigungsmeldung anzeigen
9. IF ein Administrator ungültige Daten eingibt (z.B. negativer Spendenbetrag, ungültiges Datumsformat), THEN THE CMS SHALL eine verständliche Fehlermeldung anzeigen und die Speicherung verhindern

---

### Anforderung 11: Sicherheit

**User Story:** Als Websitebetreiber möchte ich, dass die Website und das Admin-Dashboard gegen unbefugten Zugriff und Angriffe geschützt sind, damit Spenderdaten und Verwaltungsfunktionen sicher bleiben.

#### Akzeptanzkriterien

1. THE Admin_Dashboard SHALL Rate_Limiter auf der Login-Seite implementieren (max. 5 Versuche pro Minute pro IP)
2. IF ein Benutzer das Rate-Limit überschreitet, THEN THE Website SHALL den Zugang temporär sperren und eine Wartemeldung anzeigen
3. THE CMS SHALL alle Passwörter mit bcrypt (min. 10 Salt-Rounds) hashen und niemals im Klartext speichern
4. THE Admin_Dashboard SHALL CSRF-Schutz für alle zustandsändernden Operationen implementieren
5. THE Admin_Dashboard SHALL eine Session-Expiry von maximal 24 Stunden implementieren, nach der eine erneute Anmeldung erforderlich ist
6. WHEN ein Administrator eine zustandsändernde Aktion durchführt (Spendenstand ändern, Inhalt bearbeiten, Medien hochladen), THE CMS SHALL einen Audit_Log-Eintrag mit Administrator-Name, Zeitstempel, Aktion und geänderten Werten erstellen
7. THE Admin_Dashboard SHALL eine Audit_Log-Übersicht bereitstellen, in der alle administrativen Änderungen chronologisch einsehbar sind
8. THE Website SHALL alle API-Endpunkte mit Input-Validierung und Sanitization gegen Injection-Angriffe schützen
9. THE Website SHALL HTTP-Security-Headers setzen (Content-Security-Policy, X-Frame-Options, X-Content-Type-Options, Strict-Transport-Security)

---

### Anforderung 12: Medien-Galerie

**User Story:** Als Besucher möchte ich Fotos und Videos der Moschee und der Renovierungsarbeiten sehen, damit ich den Fortschritt visuell verfolgen kann.

#### Akzeptanzkriterien

1. THE Medien_Galerie SHALL Fotos in einem responsiven Grid-Layout anzeigen
2. WHEN ein Besucher auf ein Foto klickt, THE Medien_Galerie SHALL das Foto in einer Lightbox-Ansicht vergrößert anzeigen
3. THE Medien_Galerie SHALL Videos eingebettet und abspielbar anzeigen
4. WHEN der Administrator Medien im Admin_Dashboard kategorisiert (z.B. „Vorher", „Nachher", „Veranstaltungen"), THE Medien_Galerie SHALL die Medien nach Kategorien filterbar anzeigen
5. THE Medien_Galerie SHALL Bilder in optimierten Formaten (WebP) und mit Lazy Loading laden, um die Ladezeit zu minimieren

---

### Anforderung 13: Kontaktseite

**User Story:** Als Besucher möchte ich die Moschee kontaktieren können, damit ich Fragen stellen oder Informationen erhalten kann.

#### Akzeptanzkriterien

1. THE Website SHALL auf der Kontaktseite die Adresse der Moschee, Telefonnummer, E-Mail-Adresse und eine eingebettete Karte (OpenStreetMap, DSGVO-konform) anzeigen
2. THE Website SHALL ein Kontaktformular mit den Feldern Name, E-Mail, Betreff und Nachricht bereitstellen
3. IF ein Besucher das Kontaktformular mit ungültigen Daten absendet (z.B. ungültige E-Mail-Adresse, leere Pflichtfelder), THEN THE Website SHALL eine verständliche Fehlermeldung anzeigen und das Absenden verhindern
4. WHEN ein Besucher das Kontaktformular erfolgreich absendet, THE Website SHALL eine Bestätigungsmeldung anzeigen und die Nachricht an die hinterlegte E-Mail-Adresse weiterleiten
5. THE Website SHALL das Kontaktformular mit einem Spam-Schutz (Honeypot-Feld) versehen

---

### Anforderung 14: Performance und SEO

**User Story:** Als Websitebetreiber möchte ich, dass die Website schnell lädt und in Suchmaschinen gut gefunden wird, damit möglichst viele Menschen die Moschee und das Spendenprojekt finden.

#### Akzeptanzkriterien

1. THE Website SHALL Server-Side Rendering (SSR) oder Static Site Generation (SSG) für alle öffentlichen Seiten verwenden
2. THE Website SHALL strukturierte Daten (JSON-LD) bereitstellen für: LocalBusiness Schema, Organization Schema, Event Schema und FAQ Schema (für Spenden-FAQ)
3. THE Website SHALL Meta-Tags (Title, Description, Open Graph) für alle Seiten bereitstellen
4. THE Website SHALL einen Lighthouse-Score von mindestens 95 für Performance erreichen
5. THE Website SHALL eine Time to First Byte (TTFB) von unter 500ms erreichen
6. THE Website SHALL einen Largest Contentful Paint (LCP) von unter 2 Sekunden erreichen
7. THE Website SHALL einen First Contentful Paint (FCP) von unter 1,5 Sekunden erreichen
8. THE Website SHALL eine sitemap.xml und robots.txt bereitstellen
9. THE Website SHALL für lokale Suchmaschinenoptimierung optimiert sein (Google Maps Listing kompatibel)

---

### Anforderung 15: CMS-Datenarchitektur

**User Story:** Als Websitebetreiber möchte ich, dass alle Inhalte in einer strukturierten Datenbank gespeichert werden, damit die Daten sicher, konsistent und einfach zu verwalten sind.

#### Akzeptanzkriterien

1. THE CMS SHALL eine relationale Datenbank (PostgreSQL via Supabase) als Datenspeicher verwenden
2. THE CMS SHALL ein definiertes Datenbankmodell mit folgenden Entitäten bereitstellen: donations (Einzelspenden mit Quelle, Betrag, Datum), donation_settings (Zielbetrag, manueller Anpassungswert), prayer_iqamah (Iqāmah-Zeiten), events (Veranstaltungen), media (Fotos/Videos mit Kategorien), blog_posts (News-Beiträge), page_content (statische Seiteninhalte), audit_logs (Änderungsprotokoll), users (Admin-Benutzer)
3. THE CMS SHALL Mediendateien in einem Cloud-Speicher (Supabase Storage) ablegen und nur Referenzen in der Datenbank speichern
4. THE CMS SHALL eine automatische Backup-Strategie unterstützen (Supabase automatische Backups)
5. WHEN der Administrator Inhalte ändert, THE CMS SHALL die Änderungen atomar speichern und bei Fehlern einen Rollback durchführen

---

### Anforderung 16: Optionale Erweiterungen (Stripe-Zahlung)

**User Story:** Als Spender möchte ich optional per Kreditkarte spenden können, damit ich eine weitere Zahlungsmöglichkeit habe.

#### Akzeptanzkriterien

1. WHERE die Stripe-Integration aktiviert ist, THE Website SHALL einen Kreditkarten-Zahlungsbutton auf der Spendenseite anzeigen
2. WHERE die Stripe-Integration aktiviert ist, WHEN ein Spender eine Kreditkartenzahlung abschließt, THE Website SHALL die Zahlung über die Stripe-API verarbeiten und eine Bestätigung anzeigen
3. WHERE die Stripe-Integration aktiviert ist, WHEN eine Stripe-Zahlung erfolgreich ist, THE Website SHALL den Betrag automatisch via Webhook zum Donation_Progress addieren und in der Datenbank als stripe_donation speichern
4. WHERE die Stripe-Integration aktiviert ist, IF eine Kreditkartenzahlung fehlschlägt, THEN THE Website SHALL eine verständliche Fehlermeldung anzeigen und den Spender auffordern, es erneut zu versuchen oder eine andere Zahlungsmethode zu wählen

---

### Anforderung 17: Optionale Erweiterungen (Gebetszeiten-PDF und Kalender)

**User Story:** Als Besucher möchte ich die monatlichen Gebetszeiten als PDF herunterladen und Veranstaltungen in meinen Kalender übernehmen können.

#### Akzeptanzkriterien

1. WHERE die PDF-Funktion aktiviert ist, THE Gebetszeiten_Modul SHALL einen Download-Button für die monatlichen Gebetszeiten als PDF bereitstellen
2. WHERE die Kalender-Funktion aktiviert ist, THE Website SHALL für jedes Event einen „Zum Kalender hinzufügen"-Button (iCal-Format) bereitstellen
