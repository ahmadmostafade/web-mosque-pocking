export const SITE_CONFIG = {
  name: "Moschee Pocking",
  description:
    "Moschee-Gemeinde Pocking – Spenden, Gebetszeiten und Gemeinschaft",
  url: "https://moschee-pocking.de",
  locale: "de-DE",
  donationGoal: 60000,
  location: {
    city: "Pocking",
    country: "Deutschland",
    latitude: 48.4017,
    longitude: 13.3131,
  },
  bankDetails: {
    iban: "DE00 0000 0000 0000 0000 00",
    bic: "XXXXXXXX",
    bank: "Sparkasse",
    accountHolder: "Islamischer Verein Pocking e.V.",
    reference: "Moscheekauf",
  },
  contact: {
    email: "info@moschee-pocking.de",
    phone: "+49 000 0000000",
    address: "Musterstraße 1, 94060 Pocking",
  },
  prayerApi: {
    baseUrl: "https://api.aladhan.com/v1",
    method: 3, // Muslim World League
  },
} as const;

export const NAV_LINKS = [
  { href: "/", label: "Startseite", labelAr: "الرئيسية" },
  { href: "/ueber-uns", label: "Über uns", labelAr: "من نحن" },
  { href: "/gebetszeiten", label: "Gebetszeiten", labelAr: "أوقات الصلاة" },
  { href: "/spenden", label: "Spenden", labelAr: "تبرع" },
  {
    href: "/veranstaltungen",
    label: "Veranstaltungen",
    labelAr: "الفعاليات",
  },
  { href: "/kontakt", label: "Kontakt", labelAr: "اتصل بنا" },
] as const;

export const PRAYER_NAMES = {
  Fajr: { de: "Fajr", ar: "الفجر" },
  Sunrise: { de: "Sonnenaufgang", ar: "الشروق" },
  Dhuhr: { de: "Dhuhr", ar: "الظهر" },
  Asr: { de: "Asr", ar: "العصر" },
  Maghrib: { de: "Maghrib", ar: "المغرب" },
  Isha: { de: "Isha", ar: "العشاء" },
  Jummah: { de: "Jumuʿah", ar: "الجمعة" },
} as const;
