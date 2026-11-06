import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarIcon, CheckIcon, ClockIcon, FormatIcon } from "@/components/icons";
import RevealScope from "@/components/ui/RevealScope";
import PageHero from "@/components/ui/PageHero";
import SectionHeading from "@/components/ui/SectionHeading";
import StatRow from "@/components/ui/StatRow";
import ModuleTabs from "@/components/ui/ModuleTabs";
import FaqList from "@/components/ui/FaqList";
import CtaBand from "@/components/ui/CtaBand";
import { fmtNum, href, isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getGlobal } from "@/lib/cms";
import { pageMeta } from "@/lib/seo";
import { pad2 } from "@/lib/fa";

type Params = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const c = await getGlobal("djing-course", locale);
  return pageMeta(locale, "/courses/djing", [c.title, c.titleAccent].filter(Boolean).join(" "), c.lead);
}

export default async function DjingCoursePage({ params }: Params) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const [c, settings] = await Promise.all([getGlobal("djing-course", locale), getGlobal("settings", locale)]);
  const t = getDictionary(locale);
  const n = (v: number | string) => fmtNum(v, locale);
  const tiers = c.tiers ?? [];
  const totalSessions = tiers.reduce((s, x) => s + x.sessions, 0);
  const totalHours = Math.round(tiers.reduce((s, x) => s + x.sessions * x.minutes, 0) / 60);
  const firstService = tiers[0]?.serviceId ?? "djing-beginner";

  return (
    <RevealScope>
      <PageHero kicker={c.kicker} title={c.title} accent={c.titleAccent} lead={c.lead}>
        <div className="flex flex-wrap gap-3">
          <Link href={`${href(locale, "/contact")}?service=${firstService}`} className="btn-neon">
            {c.primaryCta}
          </Link>
          <a href="#tiers" className="btn-ghost">
            {c.secondaryCta}
          </a>
        </div>
        <div className="mt-10">
          <StatRow
            items={[
              { label: t.levelsCount, value: n(tiers.length) },
              { label: t.totalSessions, value: n(totalSessions) },
              { label: t.totalHours, value: `${n(totalHours)}+` },
              { label: t.classFormat, value: tiers[0]?.format ?? "" },
            ]}
          />
        </div>
      </PageHero>

      {/* ── Levels ── */}
      <section id="tiers" className="scroll-mt-24 px-5 py-20 md:px-8 md:py-28" aria-labelledby="tiers-title">
        <div className="mx-auto max-w-7xl">
          <SectionHeading id="tiers-title" kicker={c.tiersKicker} title={c.tiersTitle} lead={c.tiersLead} />
          <div className="mt-14 grid gap-6 lg:grid-cols-3">
            {tiers.map((x) => (
              <article
                key={x.id ?? x.serviceId}
                data-reveal
                className={`glass neon-card flex flex-col rounded-[2rem] p-7 md:p-8 ${x.featured ? "border-neon/40 shadow-[0_0_60px_rgba(168,85,247,.18)]" : ""}`}
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="font-display text-lg tracking-[0.3em] text-cyan">
                    <span dir="ltr">{x.latin}</span>
                  </p>
                  {x.featured && c.featuredBadge && (
                    <span className="rounded-full bg-gradient-to-l from-cyan to-neon px-3 py-1 text-[11px] font-bold text-ink">{c.featuredBadge}</span>
                  )}
                </div>
                <h3 className="mt-3 text-2xl font-black text-white">{x.title}</h3>
                {x.audience && <p className="mt-3 text-sm leading-7 text-white/55">{x.audience}</p>}

                <dl className="mt-6 grid grid-cols-3 gap-2 rounded-2xl bg-white/[0.03] p-3 ring-1 ring-white/5">
                  {[
                    { icon: <CalendarIcon className="h-4 w-4" />, label: t.sessions, value: `${n(x.sessions)} ${t.session}` },
                    { icon: <ClockIcon className="h-4 w-4" />, label: t.perSession, value: `${n(x.minutes)} ${t.minute}` },
                    { icon: <FormatIcon className="h-4 w-4" />, label: t.level, value: x.level ?? "" },
                  ].map((d) => (
                    <div key={d.label} className="text-center">
                      <dt className="flex items-center justify-center gap-1 text-[11px] text-white/40">
                        <span className="text-neon">{d.icon}</span>
                        {d.label}
                      </dt>
                      <dd className="mt-1 text-xs font-bold leading-5 text-white/85">{d.value}</dd>
                    </div>
                  ))}
                </dl>
                {x.format && <p className="mt-3 text-center text-xs text-white/45">{x.format}</p>}

                <ul className="mt-6 flex-1 space-y-3">
                  {(x.highlights ?? []).map((h) => (
                    <li key={h.id ?? h.text} className="flex gap-3 text-sm leading-7 text-white/75">
                      <span className="mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-neon/15 text-neon">
                        <CheckIcon className="h-3 w-3" />
                      </span>
                      {h.text}
                    </li>
                  ))}
                </ul>

                <div className="mt-8 flex items-center justify-between gap-3 border-t border-white/5 pt-6">
                  <span className="text-sm text-white/50">{x.price}</span>
                  <Link href={`${href(locale, "/contact")}?service=${x.serviceId}`} className={x.featured ? "btn-neon px-5" : "btn-ghost px-5"}>
                    {c.bookLabel}
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── Syllabus ── */}
      <section className="px-5 py-20 md:px-8 md:py-28" aria-labelledby="syllabus-title">
        <div className="mx-auto max-w-7xl">
          <SectionHeading id="syllabus-title" kicker={c.syllabusKicker} title={c.syllabusTitle} />
          <div data-reveal className="mt-12">
            <ModuleTabs groups={c.syllabus ?? []} label={c.syllabusTitle ?? ""} />
          </div>
        </div>
      </section>

      {/* ── Method ── */}
      {(c.method ?? []).length > 0 && (
        <section className="px-5 py-20 md:px-8 md:py-28" aria-labelledby="method-title">
          <div className="mx-auto max-w-7xl">
            <SectionHeading id="method-title" kicker={c.methodKicker} title={c.methodTitle} />
            <ol className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {(c.method ?? []).map((m, i) => (
                <li key={m.id ?? m.title} data-reveal className="glass relative rounded-3xl p-6">
                  <span className="font-display text-gradient text-5xl leading-none" dir="ltr">
                    {pad2(i + 1)}
                  </span>
                  <h3 className="mt-4 text-lg font-bold text-white">{m.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-white/60">{m.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}

      {/* ── FAQ ── */}
      {(c.faq ?? []).length > 0 && (
        <section className="px-5 py-20 md:px-8 md:py-28" aria-labelledby="faq-title">
          <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1fr_1.6fr]">
            <SectionHeading id="faq-title" kicker="FAQ" title={t.faqTitle} accent={t.faqAccent} />
            <FaqList items={c.faq} />
          </div>
        </section>
      )}

      <CtaBand
        locale={locale}
        data={settings.ctaBand}
        primaryHref={`/contact?service=${firstService}`}
        secondaryLabel={t.toAbleton}
        secondaryHref="/courses/ableton"
      />
    </RevealScope>
  );
}
