import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { QuoteIcon } from "@/components/icons";
import Vinyl from "@/components/Vinyl";
import Portrait from "@/components/Portrait";
import RevealScope from "@/components/ui/RevealScope";
import SectionHeading, { Kicker } from "@/components/ui/SectionHeading";
import CtaBand from "@/components/ui/CtaBand";
import { href, isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getGlobal, mediaUrl } from "@/lib/cms";
import { pageMeta } from "@/lib/seo";
import { pad2 } from "@/lib/fa";

type Params = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const b = await getGlobal("biography", locale);
  return pageMeta(locale, "/biography", b.title, b.lead);
}

export default async function BiographyPage({ params }: Params) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const [b, settings] = await Promise.all([getGlobal("biography", locale), getGlobal("settings", locale)]);
  const t = getDictionary(locale);
  const photo = mediaUrl(settings.photo) ?? "/images/soheil.webp";

  return (
    <RevealScope>
      <section className="relative overflow-hidden px-5 pt-32 pb-16 md:px-8 md:pt-40 md:pb-24">
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <div data-reveal>
              <Kicker>{b.kicker}</Kicker>
            </div>
            <h1 data-reveal className="mt-4 text-4xl font-black leading-[1.3] text-white md:text-6xl">
              {b.title}{" "}
              <span className="font-display text-gradient tracking-wide" dir="ltr">
                {settings.brandName}
              </span>
            </h1>
            {b.lead && (
              <p data-reveal className="mt-6 max-w-xl text-lg leading-9 text-white/65">
                {b.lead}
              </p>
            )}
            <ul data-reveal className="mt-8 flex flex-wrap gap-2">
              {(settings.roles ?? []).map((r) => (
                <li key={r} className="font-display rounded-full bg-white/5 px-4 py-1.5 text-lg tracking-[0.2em] text-white/80 ring-1 ring-white/10" dir="ltr">
                  {r}
                </li>
              ))}
            </ul>
          </div>

          <div data-reveal className="relative mx-auto aspect-square w-full max-w-[520px]">
            <div className="absolute inset-[6%] opacity-80" aria-hidden="true">
              <Vinyl showArm={false} label={settings.brandName} />
            </div>
            {/* Glow lives on the wrapper: a filter on the masked <img> itself gets clipped to its box. */}
            <div className="absolute inset-0 flex items-end justify-center drop-shadow-[-8px_0_22px_rgba(34,211,238,.22)] drop-shadow-[8px_-6px_26px_rgba(168,85,247,.4)]">
              <Portrait
                src={photo}
                alt={settings.photoAlt ?? settings.nameLocal}
                className="relative h-full w-auto max-w-none object-contain [mask-image:linear-gradient(to_top,transparent,#000_22%)]"
              />
            </div>
          </div>
        </div>
      </section>

      {(b.story ?? []).length > 0 && (
        <section className="px-5 py-16 md:px-8 md:py-24" aria-labelledby="story-title">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_1.6fr]">
            <h2 id="story-title" data-reveal className="text-3xl font-black leading-[1.35] text-white md:text-5xl">
              {b.storyTitle}
            </h2>
            <div className="space-y-6">
              {(b.story ?? []).map((p) => (
                <p key={p.id ?? p.text.slice(0, 24)} data-reveal className="text-lg leading-9 text-white/70">
                  {p.text}
                </p>
              ))}
            </div>
          </div>
        </section>
      )}

      {(b.chapters ?? []).length > 0 && (
        <section className="px-5 py-20 md:px-8 md:py-28" aria-labelledby="journey-title">
          <div className="mx-auto max-w-4xl">
            <SectionHeading id="journey-title" kicker={b.chaptersKicker} title={b.chaptersTitle} />
            <ol className="relative mt-14 space-y-6 border-s border-white/10 ps-8 md:ps-12">
              {(b.chapters ?? []).map((ch, i) => (
                <li key={ch.id ?? ch.title} data-reveal className="relative">
                  <span className="absolute -start-[39px] top-7 h-3.5 w-3.5 rounded-full bg-neon shadow-[0_0_18px_#a855f7] ring-4 ring-ink md:-start-[55px]" />
                  <div className="glass neon-card rounded-3xl p-6 md:p-7">
                    <div className="flex items-center gap-3">
                      <span className="font-display text-outline text-4xl leading-none" dir="ltr">
                        {pad2(i + 1)}
                      </span>
                      {ch.tag && <span className="rounded-full bg-cyan/10 px-3 py-1 text-xs text-cyan ring-1 ring-cyan/25">{ch.tag}</span>}
                    </div>
                    <h3 className="mt-4 text-xl font-bold text-white">{ch.title}</h3>
                    <p className="mt-2 text-sm leading-7 text-white/60">{ch.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}

      {b.quote && (
        <section className="px-5 py-20 md:px-8 md:py-28" aria-labelledby="philosophy-title">
          <div data-reveal className="glass relative mx-auto max-w-5xl overflow-hidden rounded-[2.5rem] px-7 py-14 md:px-16 md:py-20">
            <div className="pointer-events-none absolute -top-20 -left-20 h-64 w-64 rounded-full bg-cyan/10 blur-3xl" aria-hidden="true" />
            <Kicker>{b.philosophyKicker}</Kicker>
            <h2 id="philosophy-title" className="sr-only">
              {b.philosophyTitle}
            </h2>
            <QuoteIcon className="mt-8 h-10 w-10 text-neon/60" />
            <blockquote className="mt-4 text-3xl font-black leading-[1.5] text-white md:text-5xl">
              <span className="text-gradient">{b.quote}</span>
            </blockquote>
            <div className="mt-10 grid gap-6 md:grid-cols-2">
              {(b.philosophy ?? []).map((p) => (
                <p key={p.id ?? p.text.slice(0, 24)} className="leading-8 text-white/65">
                  {p.text}
                </p>
              ))}
            </div>
          </div>
        </section>
      )}

      {(b.stage ?? []).length > 0 && (
        <section className="px-5 py-20 md:px-8 md:py-28" aria-labelledby="stage-title">
          <div className="mx-auto max-w-7xl">
            <SectionHeading id="stage-title" kicker={b.stageKicker} title={b.stageTitle} lead={b.stageLead} />
            <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {(b.stage ?? []).map((s, i) => (
                <article key={s.id ?? s.title} data-reveal className="glass neon-card rounded-3xl p-6">
                  <span className="font-display text-gradient text-5xl leading-none" dir="ltr">
                    {pad2(i + 1)}
                  </span>
                  <h3 className="mt-5 text-lg font-bold text-white">{s.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-white/60">{s.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {(b.teaching ?? []).length > 0 && (
        <section className="px-5 py-20 md:px-8 md:py-28" aria-labelledby="teaching-title">
          <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1fr_1.5fr]">
            <div>
              <SectionHeading id="teaching-title" kicker={b.teachingKicker} title={b.teachingTitle} />
              <div data-reveal className="mt-8 flex flex-wrap gap-3">
                <Link href={href(locale, "/courses/djing")} className="btn-neon">
                  {t.toDjing}
                </Link>
                <Link href={href(locale, "/courses/ableton")} className="btn-ghost">
                  {t.toAbleton}
                </Link>
              </div>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              {(b.teaching ?? []).map((x) => (
                <article key={x.id ?? x.title} data-reveal className="glass rounded-3xl p-6">
                  <span className="block h-1 w-10 rounded-full bg-gradient-to-l from-cyan to-neon" />
                  <h3 className="mt-5 text-lg font-bold text-white">{x.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-white/60">{x.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {(b.setup ?? []).length > 0 && (
        <section className="px-5 py-20 md:px-8 md:py-28" aria-labelledby="setup-title">
          <div className="mx-auto max-w-7xl">
            <SectionHeading id="setup-title" kicker={b.setupKicker} title={b.setupTitle} lead={b.setupNote} />
            <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {(b.setup ?? []).map((s) => (
                <div key={s.id ?? s.group} data-reveal className="glass rounded-3xl p-6">
                  <p className="font-display text-xl tracking-[0.2em] text-cyan">
                    <span dir="ltr">{s.group}</span>
                  </p>
                  <ul className="mt-4 space-y-2">
                    {(s.items ?? []).map((it) => (
                      <li key={it} className="text-sm text-white/80">
                        <bdi>{it}</bdi>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <CtaBand locale={locale} data={settings.ctaBand} />
    </RevealScope>
  );
}
