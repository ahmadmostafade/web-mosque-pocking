"use client";

import { useState, useEffect } from "react";

type CookieConsent = "accepted" | "rejected" | "custom" | null;

export default function CookieBanner() {
  const [consent, setConsent] = useState<CookieConsent>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("cookie-consent") as CookieConsent;
    if (!stored) {
      setVisible(true);
    } else {
      setConsent(stored);
    }
  }, []);

  function handleConsent(choice: "accepted" | "rejected") {
    localStorage.setItem("cookie-consent", choice);
    setConsent(choice);
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50 p-4"
      role="dialog"
      aria-label="Cookie-Einwilligung"
    >
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-gray-700">
          Diese Website verwendet nur essenzielle Cookies. Weitere Informationen
          finden Sie in unserer{" "}
          <a href="/datenschutz" className="underline text-mosque-green-600">
            Datenschutzerklärung
          </a>
          .
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => handleConsent("rejected")}
            className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Ablehnen
          </button>
          <button
            onClick={() => handleConsent("accepted")}
            className="px-4 py-2 text-sm bg-mosque-green-600 text-white rounded-lg hover:bg-mosque-green-700 transition-colors"
          >
            Akzeptieren
          </button>
        </div>
      </div>
    </div>
  );
}
