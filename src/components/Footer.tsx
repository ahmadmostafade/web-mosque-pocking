import Link from "next/link";
import { SITE_CONFIG } from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="bg-mosque-green-800 text-white py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-3">🕌 {SITE_CONFIG.name}</h3>
            <p className="text-sm text-gray-300">
              {SITE_CONFIG.contact.address}
            </p>
            <p className="text-sm text-gray-300 mt-1">
              {SITE_CONFIG.contact.email}
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Links</h3>
            <ul className="space-y-1 text-sm text-gray-300">
              <li>
                <Link href="/impressum" className="hover:text-mosque-gold-300">
                  Impressum
                </Link>
              </li>
              <li>
                <Link
                  href="/datenschutz"
                  className="hover:text-mosque-gold-300"
                >
                  Datenschutz
                </Link>
              </li>
              <li>
                <Link href="/kontakt" className="hover:text-mosque-gold-300">
                  Kontakt
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Spenden</h3>
            <p className="text-sm text-gray-300">
              {SITE_CONFIG.bankDetails.accountHolder}
            </p>
            <p className="text-sm text-gray-300 mt-1">
              IBAN: {SITE_CONFIG.bankDetails.iban}
            </p>
            <p className="text-sm text-gray-300">
              BIC: {SITE_CONFIG.bankDetails.bic}
            </p>
            <p className="text-sm text-gray-300 mt-1">
              Verwendungszweck: {SITE_CONFIG.bankDetails.reference}
            </p>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-mosque-green-600 text-center text-sm text-gray-400">
          © {new Date().getFullYear()} {SITE_CONFIG.bankDetails.accountHolder}.
          Alle Rechte vorbehalten.
        </div>
      </div>
    </footer>
  );
}
