export const SITE_CONFIG = {
  name: "Islamisches Bildungsforum Pocking e.V.",
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
    iban: "DE79 7405 0000 0031 4021 00",
    bic: "BYLADEM1PAS",
    bank: "Sparkasse Passau",
    accountHolder: "Islamisches Bildungsforum Pocking e.V.",
    reference: "Moscheekauf",
  },
  paypal: {
    hostedButtonId: "5UE27E84TA9L4",
    email: "2saad2hashem@gmail.com",
    currency: "EUR",
    itemName: "Moscheekauf Pocking",
  },
  contact: {
    email: "info@ibf-pocking.de",
    address: "Tettenweiser Str. 16, 94060 Pocking",
    legalRepAddress: "Passauer Str. 25, 94060 Pocking",
  },
  prayerApi: {
    baseUrl: "https://api.aladhan.com/v1",
    method: 3, // Muslim World League
  },
  legalInfo: {
    legalForm: "Verein e.V.",
    registrationCourt: "Amtsgericht Passau",
    registrationNumber: "VR 201235",
    registrationDate: "04.11.2025",
    chairman: "Saad, Hashem",
    viceChairman: "Putta, Luca",
    treasurer: "Aamer, Kazala",
  },
} as const;

export const NAV_LINKS = [
  { href: "/", label: "Startseite", labelAr: "الرئيسية" },
  { href: "/ueber-uns", label: "Über uns", labelAr: "من نحن" },
  { href: "/gebetszeiten", label: "Gebetszeiten", labelAr: "أوقات الصلاة" },
  { href: "/spenden", label: "Spenden", labelAr: "تبرع" },
  { href: "/galerie", label: "Galerie", labelAr: "معرض الصور" },
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
