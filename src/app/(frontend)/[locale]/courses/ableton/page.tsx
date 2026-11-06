import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckIcon, ServiceGlyph } from "@/components/icons";
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
  const c = await getGlobal("ableton-course", locale);
  return pageMeta(locale, "/courses/ableton", [c.title, c.titleAccent].filter(Boolean).join(" "), c.lead);
}

export default async function AbletonCoursePage({ params }: Params) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const [c, settings] = await Promise.all([getGlobal("ableton-course", locale), getGlobal("settings", locale)]);
  const t = getDictionary(locale);
  const n = (v: number | string | null | undefined) => (v === null || v === undefined ? "" : fmtNum(v, locale));
  const pipeline = c.pipeline ?? [];

  return (
    <RevealScope>
      <PageHero kicker={c.kicker} title={c.title} accent={c.titleAccent} lead={c.lead}>
        <div className="flex flex-wrap gap-3">
          <Link href={`${href(locale, "/contact")}?service=ableton`} className="btn-neon">
            {c.primaryCta}
          </Link>
          <a href="#curriculum" className="btn-ghost">
            {c.secondaryCta}
          </a>
        </div>
        <div className="mt-10">
          <StatRow
            items={[
              { label: t.sessionCount, value: `${n(c.meta?.sessions)} ${t.session}` },
              { label: t.sessionLength, value: `${n(c.meta?.minutes)} ${t.minute}` },
              { label: t.classFormat, value: c.meta?.format ?? "" },
              { label: t.prerequisite, value: c.meta?.level ?? "" },
            ]}
          />
        </div>
      </PageHero>

      {pipeline.length > 0 && (
        <section className="px-5 md:px-8" aria-label={t.coursePath}>
          <div data-reveal className="glass mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-3 gap-y-4 rounded-3xl px-6 py-6">
            {pipeline.map((step, i) => (
              <span key={step} className="flex items-center gap-3">
                <span className="font-display rounded-full bg-white/5 px-4 py-1.5 text-xl tracking-wider text-white ring-1 ring-white/10" dir="ltr">
                  <span className="text-neon">{pad2(i + 1)}</span> {step}
                </span>
                {i < pipeline.length - 1 && <span className="h-px w-6 bg-gradient-to-l from-cyan to-neon" aria-hidden="true" />}
              </span>
            ))}
          </div>
        </section>
      )}

      <section id="curriculum" className="scroll-mt-24 px-5 py-20 md:px-8 md:py-28" aria-labelledby="curriculum-title">
        <div className="mx-auto max-w-7xl">
          <SectionHeading id="curriculum-title" kicker={c.curriculumKicker} title={c.curriculumTitle} lead={c.curriculumLead} />
          <div data-reveal className="mt-12">
            <ModuleTabs groups={c.tracks ?? []} label={c.curriculumTitle ?? ""} />
          </div>
        </div>
      </section>

      {(c.outcomes ?? []).length > 0 && (
        <section className="px-5 py-20 md:px-8 md:py-28" aria-labelledby="outcomes-title">
          <div className="mx-auto max-w-7xl">
            <SectionHeading id="outcomes-title" kicker={c.outcomesKicker} title={c.outcomesTitle} />
            <div className="mt-14 grid gap-5 md:grid-cols-3">
              {(c.outcomes ?? []).map((o, i) => (
                <article key={o.id ?? o.title} data-reveal className="glass neon-card rounded-3xl p-7">
                  <span className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-cyan/15 to-neon/20 text-cyan ring-1 ring-white/10">
                    <ServiceGlyph name={i === 2 ? "masterclass" : "ableton"} className="h-8 w-8" />
                  </span>
                  <h3 className="mt-6 text-xl font-bold text-white">{o.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-white/60">{o.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="px-5 py-20 md:px-8 md:py-28" aria-labelledby="req-title">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2">
          <div data-reveal className="glass rounded-[2rem] p-7 md:p-9">
            <h2 id="req-title" className="text-2xl font-black text-white md:text-3xl">
              {c.requirementsTitle}
            </h2>
            <ul className="mt-7 space-y-4">
              {(c.requirements ?? []).map((r) => (
                <li key={r.id ?? r.text} className="flex gap-3 text-sm leading-7 text-white/75">
                  <span className="mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-cyan/15 text-cyan">
                    <CheckIcon className="h-3 w-3" />
                  </span>
                  {r.text}
                </li>
              ))}
            </ul>
            <Link href={href(locale, "/buying-guide")} className="mt-8 inline-flex text-sm text-neon underline-offset-4 hover:underline">
              {t.gearGuideLink} {t.dirArrow}
            </Link>
          </div>
          {(c.faq ?? []).length > 0 && (
            <div>
              <h2 data-reveal className="mb-6 text-2xl font-black text-white md:text-3xl">
                {t.faqTitle} <span className="text-gradient">{t.faqAccent}</span>
              </h2>
              <FaqList items={c.faq} />
            </div>
          )}
        </div>
      </section>

      <CtaBand
        locale={locale}
        data={settings.ctaBand}
        primaryLabel={c.primaryCta}
        primaryHref="/contact?service=ableton"
        secondaryLabel={t.toDjing}
        secondaryHref="/courses/djing"
      />
    </RevealScope>
  );
}
