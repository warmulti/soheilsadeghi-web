import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarIcon, ClockIcon, InstagramIcon, TelegramIcon, WhatsAppIcon } from "@/components/icons";
import RevealScope from "@/components/ui/RevealScope";
import PageHero from "@/components/ui/PageHero";
import BookingForm from "@/components/contact/BookingForm";
import { isLocale } from "@/i18n/config";
import { getGlobal } from "@/lib/cms";
import { instagramUrl, telegramUrl, whatsappUrl } from "@/lib/links";
import { pageMeta } from "@/lib/seo";

type Params = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const c = await getGlobal("contact-page", locale);
  return pageMeta(locale, "/contact", [c.title, c.titleAccent].filter(Boolean).join(" "), c.lead);
}

export default async function ContactPage({ params }: Params) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const [c, s] = await Promise.all([getGlobal("contact-page", locale), getGlobal("settings", locale)]);
  const ch = c.channels;

  const channels = [
    s.telegram && {
      key: "telegram",
      label: ch?.telegram?.label,
      action: ch?.telegram?.action,
      handle: `@${s.telegram}`,
      href: telegramUrl(s.telegram),
      icon: <TelegramIcon className="h-7 w-7" />,
      accent: "from-cyan/25 to-cyan/5 text-cyan",
    },
    s.whatsapp && {
      key: "whatsapp",
      label: ch?.whatsapp?.label,
      action: ch?.whatsapp?.action,
      handle: `+${s.whatsapp}`,
      href: whatsappUrl(s.whatsapp),
      icon: <WhatsAppIcon className="h-7 w-7" />,
      accent: "from-emerald-400/25 to-emerald-400/5 text-emerald-300",
    },
    s.instagram && {
      key: "instagram",
      label: ch?.instagram?.label,
      action: ch?.instagram?.action,
      handle: `@${s.instagram}`,
      href: instagramUrl(s.instagram),
      icon: <InstagramIcon className="h-7 w-7" />,
      accent: "from-neon/25 to-fuchsia-400/5 text-fuchsia-300",
    },
  ].filter(Boolean) as { key: string; label?: string | null; action?: string | null; handle: string; href: string; icon: React.ReactNode; accent: string }[];

  return (
    <RevealScope>
      <PageHero kicker={c.kicker} title={c.title} accent={c.titleAccent} lead={c.lead} />

      <section className="px-5 pb-28 md:px-8" aria-labelledby="channels-title">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_1.35fr]">
          <div>
            <h2 id="channels-title" data-reveal className="text-2xl font-black text-white">
              {c.channelsTitle}
            </h2>
            <ul className="mt-6 space-y-4">
              {channels.map((x) => (
                <li key={x.key} data-reveal>
                  <a href={x.href} target="_blank" rel="noopener noreferrer" className="glass neon-card group flex items-center gap-5 rounded-3xl p-5">
                    <span className={`grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br ring-1 ring-white/10 ${x.accent}`}>{x.icon}</span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-bold text-white">{x.label}</span>
                      <span className="mt-0.5 block truncate text-sm text-white/50">
                        <bdi>{x.handle}</bdi>
                      </span>
                    </span>
                    <span className="hidden items-center gap-2 text-xs text-neon transition-all group-hover:gap-3 sm:flex">
                      {x.action}
                      <ArrowLeft />
                    </span>
                  </a>
                </li>
              ))}
            </ul>

            <dl data-reveal className="glass mt-6 grid gap-4 rounded-3xl p-6 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              {s.responseTime && (
                <div className="flex gap-3">
                  <ClockIcon className="mt-0.5 h-5 w-5 shrink-0 text-cyan" />
                  <div>
                    <dt className="text-xs text-white/45">{c.responseLabel}</dt>
                    <dd className="mt-1 text-sm leading-6 text-white/80">{s.responseTime}</dd>
                  </div>
                </div>
              )}
              {s.hours && (
                <div className="flex gap-3">
                  <CalendarIcon className="mt-0.5 h-5 w-5 shrink-0 text-cyan" />
                  <div>
                    <dt className="text-xs text-white/45">{c.hoursLabel}</dt>
                    <dd className="mt-1 text-sm leading-6 text-white/80">{s.hours}</dd>
                  </div>
                </div>
              )}
            </dl>
          </div>

          <div data-reveal className="glass rounded-[2rem] p-6 md:p-10">
            <h2 className="text-2xl font-black text-white md:text-3xl">{c.form?.title}</h2>
            <p className="mt-2 mb-8 text-sm leading-7 text-white/55">{c.form?.lead}</p>
            <BookingForm locale={locale} form={c.form ?? {}} channels={c.channels} contact={{ telegram: s.telegram ?? "", whatsapp: s.whatsapp ?? "" }} />
          </div>
        </div>
      </section>
    </RevealScope>
  );
}
