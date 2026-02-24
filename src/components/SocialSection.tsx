import { FaFacebook, FaInstagram, FaTiktok } from "react-icons/fa6";

const PLATFORMS = [
  {
    name: "Facebook",
    handle: "IBF Pocking e.V.",
    description: "Neuigkeiten, Veranstaltungen und Ankündigungen aus unserer Gemeinschaft.",
    href: "https://www.facebook.com/people/Islamisches-Bildungsforum-Pocking-eV/61588383008330/",
    icon: FaFacebook,
    gradient: "from-blue-600 to-blue-800",
    iconColor: "text-blue-400",
    borderColor: "border-blue-500/30",
    hoverBorder: "hover:border-blue-400/60",
    buttonBg: "bg-blue-600 hover:bg-blue-500",
  },
  {
    name: "Instagram",
    handle: "@lrhmn.msjdbd",
    description: "Bilder und Einblicke aus unserem Alltag und unseren Veranstaltungen.",
    href: "https://www.instagram.com/lrhmn.msjdbd",
    icon: FaInstagram,
    gradient: "from-pink-600 via-purple-600 to-orange-500",
    iconColor: "text-pink-400",
    borderColor: "border-pink-500/30",
    hoverBorder: "hover:border-pink-400/60",
    buttonBg: "bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500",
  },
  {
    name: "TikTok",
    handle: "@ibf.pocking.e.v",
    description: "Kurzvideos und Highlights aus unserem Vereinsleben.",
    href: "https://www.tiktok.com/@ibf.pocking.e.v",
    icon: FaTiktok,
    gradient: "from-gray-800 to-gray-900",
    iconColor: "text-white",
    borderColor: "border-gray-500/30",
    hoverBorder: "hover:border-gray-300/40",
    buttonBg: "bg-gray-700 hover:bg-gray-600",
  },
];

export default function SocialSection() {
  return (
    <section className="bg-gray-950 py-16 sm:py-20">
      <div className="page-container">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-semibold text-white">
            Folge uns
          </h2>
          <p className="mt-2 text-gray-400 text-sm sm:text-base">
            Bleib auf dem Laufenden – folge uns auf unseren Kanälen.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {PLATFORMS.map(({ name, handle, description, href, icon: Icon, iconColor, borderColor, hoverBorder, buttonBg }) => (
            <a
              key={name}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className={`group flex flex-col gap-4 rounded-2xl border ${borderColor} ${hoverBorder} bg-white/5 backdrop-blur-sm p-6 transition-all duration-300 hover:bg-white/10 hover:-translate-y-1`}
            >
              <div className="flex items-center gap-3">
                <Icon size={28} className={iconColor} />
                <div>
                  <p className="text-white font-semibold text-sm">{name}</p>
                  <p className="text-gray-400 text-xs">{handle}</p>
                </div>
              </div>

              <p className="text-gray-300 text-sm leading-relaxed flex-grow">
                {description}
              </p>

              <span className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold text-white transition-colors duration-200 ${buttonBg}`}>
                <Icon size={13} />
                Jetzt folgen
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
