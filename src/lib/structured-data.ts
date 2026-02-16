import { SITE_CONFIG } from "./constants";

export function getOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_CONFIG.bankDetails.accountHolder,
    url: SITE_CONFIG.url,
    email: SITE_CONFIG.contact.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Passauer Str. 25",
      addressLocality: SITE_CONFIG.location.city,
      postalCode: "94060",
      addressCountry: "DE",
    },
  };
}

export function getLocalBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Mosque",
    name: SITE_CONFIG.name,
    url: SITE_CONFIG.url,
    email: SITE_CONFIG.contact.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Passauer Str. 25",
      addressLocality: SITE_CONFIG.location.city,
      postalCode: "94060",
      addressCountry: "DE",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: SITE_CONFIG.location.latitude,
      longitude: SITE_CONFIG.location.longitude,
    },
  };
}

export function getFaqSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Wie kann ich für die Moschee spenden?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Sie können per Banküberweisung (IBAN), PayPal oder QR-Code spenden. Alle Informationen finden Sie auf unserer Spendenseite.",
        },
      },
      {
        "@type": "Question",
        name: "Wofür werden die Spenden verwendet?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Alle Spenden werden ausschließlich für den Kauf und die Renovierung des Moschee-Gebäudes in Pocking verwendet.",
        },
      },
      {
        "@type": "Question",
        name: "Kann ich anonym spenden?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Ja, anonyme Spenden sind möglich. Sie können dies bei der Spende angeben.",
        },
      },
    ],
  };
}
