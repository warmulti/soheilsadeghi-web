import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckIcon } from "@/components/icons";
import RevealScope from "@/components/ui/RevealScope";
import PageHero from "@/components/ui/PageHero";
import SectionHeading from "@/components/ui/SectionHeading";
import CtaBand from "@/components/ui/CtaBand";
import BudgetFilter from "@/components/buying/BudgetFilter";
import { fmtNum, href, isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getGlobal } from "@/lib/cms";
import { pageMeta } from "@/lib/seo";

type Params = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const g = await getGlobal("buying-guide", locale);
  return pageMeta(locale, "/buying-guide", [g.title, g.titleAccent].filter(Boolean).join(" "), g.lead);
}

function TipList({ title, tips, locale }: { title?: string | null; tips?: { text: string; id?: string | null }[] | null; locale: Locale }) {
  if (!tips?.length) return null;
  return (
    <div data-reveal className="glass rounded-[2rem] p-7 md:p-8">
      <h3 className="text-xl font-bold text-white">{title}</h3>
      <ol className="mt-6 space-y-4">
        {tips.map((tip, i) => (
          <li key={tip.id ?? tip.text} className="flex gap-4 text-sm leading-7 text-white/70">
            <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-neon/15 text-xs font-bold text-neon">{fmtNum(i + 1, locale)}</span>
            {tip.text}
          </li>
        ))}
      </ol>
    </div>
  );
}

export default async function BuyingGuidePage({ params }: Params) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const [g, settings] = await Promise.all([getGlobal("buying-guide", locale), getGlobal("settings", locale)]);
  const t = getDictionary(locale);
  const l = g.laptop;

  return (
    <RevealScope>
      <PageHero kicker={g.kicker} title={g.title} accent={g.titleAccent} lead={g.lead} />

      <section className="px-5 pb-20 md:px-8 md:pb-28" aria-label={g.filterLabel ?? undefined}>
        <div data-reveal className="mx-auto max-w-7xl">
          <BudgetFilter tiers={g.tiers ?? []} labels={{ filterLabel: g.filterLabel, budgetLabel: g.budgetLabel, priceNote: g.priceNote, categories: g.categories }} />
        </div>
      </section>

      {l && (
        <section className="px-5 py-20 md:px-8 md:py-28" aria-labelledby="laptop-title">
          <div className="mx-auto max-w-7xl">
            <SectionHeading id="laptop-title" kicker={l.kicker} title={l.title} lead={l.lead} />

            {(l.rows ?? []).length > 0 && (
              <div data-reveal role="table" aria-labelledby="laptop-title" className="glass mt-12 overflow-hidden rounded-[2rem]">
                <div role="row" className="hidden grid-cols-[200px_1fr_1fr] gap-6 border-b border-white/10 px-8 py-4 text-sm md:grid">
                  <span role="columnheader" className="text-white/40" />
                  <span role="columnheader" className="font-bold text-white/60">
                    {l.minLabel}
                  </span>
                  <span role="columnheader" className="text-gradient font-bold">
                    {l.recLabel}
                  </span>
                </div>
                {(l.rows ?? []).map((r) => (
                  <div
                    key={r.id ?? r.label}
                    role="row"
                    className="grid grid-cols-2 gap-x-4 gap-y-2 border-b border-white/5 px-6 py-5 last:border-b-0 md:grid-cols-[200px_1fr_1fr] md:gap-6 md:px-8"
                  >
                    <span role="rowheader" className="col-span-2 font-bold text-white md:col-span-1">
                      {r.label}
                    </span>
                    <span role="cell" className="text-sm leading-7 text-white/60">
                      <span className="block text-[11px] text-white/35 md:hidden">{l.minLabel}</span>
                      {r.min}
                    </span>
                    <span role="cell" className="text-sm leading-7 text-white/85">
                      <span className="block text-[11px] text-neon/80 md:hidden">{l.recLabel}</span>
                      {r.rec}
                    </span>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-8 grid gap-5 lg:grid-cols-2">
              <TipList title={l.windowsTitle} tips={l.windowsTips} locale={locale} />
              <TipList title={l.macTitle} tips={l.macTips} locale={locale} />
            </div>
          </div>
        </section>
      )}

      {(g.checklist ?? []).length > 0 && (
        <section className="px-5 py-20 md:px-8 md:py-24" aria-labelledby="checklist-title">
          <div className="mx-auto max-w-7xl">
            <h2 id="checklist-title" data-reveal className="text-2xl font-black text-white md:text-4xl">
              {g.checklistTitle}
            </h2>
            <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {(g.checklist ?? []).map((c) => (
                <li key={c.id ?? c.text} data-reveal className="glass flex gap-3 rounded-2xl p-5 text-sm leading-7 text-white/75">
                  <span className="mt-1 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-cyan/15 text-cyan">
                    <CheckIcon className="h-3.5 w-3.5" />
                  </span>
                  {c.text}
                </li>
              ))}
            </ul>
            <div data-reveal className="mt-10">
              <Link href={`${href(locale, "/contact")}?service=gear`} className="btn-neon">
                {g.consultCta}
              </Link>
            </div>
          </div>
        </section>
      )}

      <CtaBand
        locale={locale}
        data={settings.ctaBand}
        primaryLabel={g.consultCta}
        primaryHref="/contact?service=gear"
        secondaryLabel={t.toDjing}
        secondaryHref="/courses/djing"
      />
    </RevealScope>
  );
}
