import Link from "next/link";
import { FaFacebook, FaInstagram, FaTiktok } from "react-icons/fa6";
import { SITE_CONFIG } from "@/lib/constants";

const SOCIAL_LINKS = [
  {
    href: "https://www.facebook.com/people/Islamisches-Bildungsforum-Pocking-eV/61588383008330/",
    icon: FaFacebook,
    label: "Facebook",
    color: "hover:text-blue-400",
  },
  {
    href: "https://www.instagram.com/lrhmn.msjdbd",
    icon: FaInstagram,
    label: "Instagram",
    color: "hover:text-pink-400",
  },
  {
    href: "https://www.tiktok.com/@ibf.pocking.e.v",
    icon: FaTiktok,
    label: "TikTok",
    color: "hover:text-white",
  },
];

export default function Footer() {
  return (
    <footer className="bg-mosque-green-800 text-white py-14 sm:py-16">
      <div className="page-container">
        <div className="grid grid-cols-1 md:grid-cols-[2fr_2fr_1fr] gap-10 lg:gap-16">
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
            <h3 className="text-lg font-semibold mb-3">Spenden</h3>
            <p className="text-sm text-gray-300">
              IBAN: {SITE_CONFIG.bankDetails.iban}
            </p>
            <p className="text-sm text-gray-300">
              BIC: {SITE_CONFIG.bankDetails.bic}
            </p>
            <p className="text-sm text-gray-300 mt-1">
              Verwendungszweck: {SITE_CONFIG.bankDetails.reference}
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
        </div>

        <div className="mt-10 pt-8 border-t border-mosque-green-600">
          <div className="flex flex-col items-center gap-4 mb-6">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-gray-300">
              Folge uns
            </h3>
            <div className="flex items-center gap-5">
              {SOCIAL_LINKS.map(({ href, icon: Icon, label, color }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className={`text-gray-400 transition-colors duration-200 ${color}`}
                >
                  <Icon size={26} />
                </a>
              ))}
            </div>
          </div>
          <p className="text-center text-sm text-gray-400">
            © {new Date().getFullYear()} {SITE_CONFIG.bankDetails.accountHolder}.
            Alle Rechte vorbehalten.
          </p>
        </div>
      </div>
    </footer>
  );
}
