import Link from "next/link";
import { href, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import type { ContactPage, Navigation, Setting } from "@/payload-types";
import { instagramUrl, telegramUrl, whatsappUrl } from "@/lib/links";
import { InstagramIcon, TelegramIcon, WhatsAppIcon } from "./icons";

type Props = {
  locale: Locale;
  settings: Setting;
  nav: Navigation;
  channels: ContactPage["channels"];
  t: Pick<Dictionary, "footerNav" | "quickLinks" | "stayInTouch" | "sendMessage" | "rights">;
};

export default function Footer({ locale, settings, nav, channels, t }: Props) {
  const socials = [
    settings.telegram && { href: telegramUrl(settings.telegram), label: channels?.telegram?.label ?? "Telegram", icon: <TelegramIcon className="h-5 w-5" /> },
    settings.whatsapp && { href: whatsappUrl(settings.whatsapp), label: channels?.whatsapp?.label ?? "WhatsApp", icon: <WhatsAppIcon className="h-5 w-5" /> },
    settings.instagram && { href: instagramUrl(settings.instagram), label: channels?.instagram?.label ?? "Instagram", icon: <InstagramIcon className="h-5 w-5" /> },
  ].filter(Boolean) as { href: string; label: string; icon: React.ReactNode }[];

  return (
    <footer className="relative z-10 border-t border-white/5 bg-ink/80 backdrop-blur">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 md:grid-cols-3 md:px-8">
        <div>
          <p className="font-display text-3xl text-white">
            <span dir="ltr">{settings.brandName}</span>
          </p>
          <p className="mt-3 max-w-xs text-sm leading-7 text-white/50">{settings.footerText}</p>
        </div>
        <nav aria-label={t.footerNav}>
          <p className="mb-4 text-sm font-bold text-white/80">{t.quickLinks}</p>
          <ul className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm text-white/50">
            {(nav.items ?? []).map((item) => (
              <li key={item.href}>
                <Link href={href(locale, item.href)} className="transition hover:text-white">
                  {item.short || item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div>
          <p className="mb-4 text-sm font-bold text-white/80">{t.stayInTouch}</p>
          <ul className="flex gap-3">
            {socials.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="grid h-11 w-11 place-items-center rounded-full text-white/70 ring-1 ring-white/15 transition hover:bg-white/5 hover:text-white hover:ring-neon/50"
                >
                  {s.icon}
                </a>
              </li>
            ))}
          </ul>
          <Link href={href(locale, "/contact")} className="btn-neon mt-6 px-6 py-3">
            {t.sendMessage}
          </Link>
        </div>
      </div>
      <div className="border-t border-white/5 py-5 text-center text-xs text-white/35">
        © {new Date().getFullYear()} {settings.brandName} — {t.rights}
      </div>
    </footer>
  );
}
