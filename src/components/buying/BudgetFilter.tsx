"use client";

import { useState } from "react";
import type { BuyingGuide } from "@/payload-types";

type BudgetTier = NonNullable<BuyingGuide["tiers"]>[number];
type GearItem = NonNullable<BudgetTier["controllers"]>[number];
import { CheckIcon, HeadphonesIcon, ServiceGlyph, SpeakerIcon } from "@/components/icons";

type Labels = {
  filterLabel?: string | null;
  budgetLabel?: string | null;
  priceNote?: string | null;
  categories?: BuyingGuide["categories"];
};

function GearCard({ item, delay }: { item: GearItem; delay: number }) {
  return (
    <article className="animate-fade-up glass neon-card flex flex-col rounded-3xl p-6" style={{ animationDelay: `${delay}ms` }}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs tracking-wide text-white/45">
            <span dir="ltr">{item.brand}</span>
          </p>
          <h4 className="font-display mt-1 text-3xl leading-none text-white">
            <span dir="ltr">{item.name}</span>
          </h4>
        </div>
        {item.kind && <span className="shrink-0 rounded-full bg-neon/10 px-3 py-1 text-[11px] text-neon ring-1 ring-neon/25">{item.kind}</span>}
      </div>
      {item.tags && item.tags.length > 0 && (
        <ul className="mt-4 flex flex-wrap gap-1.5">
          {item.tags.map((t) => (
            <li key={t} dir="ltr" className="rounded-full bg-white/5 px-2.5 py-0.5 text-[11px] text-cyan/90 ring-1 ring-white/10">
              {t}
            </li>
          ))}
        </ul>
      )}
      <ul className="mt-5 space-y-2.5">
        {(item.points ?? []).map((p) => (
          <li key={p.id ?? p.text} className="flex gap-2.5 text-sm leading-6 text-white/70">
            <CheckIcon className="mt-1 h-3.5 w-3.5 shrink-0 text-cyan" />
            {p.text}
          </li>
        ))}
      </ul>
    </article>
  );
}

export default function BudgetFilter({ tiers, labels }: { tiers: BudgetTier[]; labels: Labels }) {
  const [active, setActive] = useState(0);
  const tier = tiers[active] ?? tiers[0];
  if (!tier) return null;

  const groups = [
    { key: "controllers", title: labels.categories?.controllers, icon: <ServiceGlyph name="controller" className="h-6 w-6" />, items: tier.controllers ?? [] },
    { key: "headphones", title: labels.categories?.headphones, icon: <HeadphonesIcon className="h-5 w-5" />, items: tier.headphones ?? [] },
    { key: "monitors", title: labels.categories?.monitors, icon: <SpeakerIcon className="h-5 w-5" />, items: tier.monitors ?? [] },
  ].filter((g) => g.items.length > 0);

  return (
    <div>
      <fieldset>
        <legend className="mb-4 text-sm text-white/55">{labels.filterLabel}</legend>
        <div className="glass inline-flex w-full max-w-xl rounded-full p-1.5 sm:w-auto">
          {tiers.map((t, i) => (
            <label key={t.id ?? t.tierId} className="relative flex-1 cursor-pointer sm:flex-none">
              <input
                type="radio"
                name="budget-tier"
                value={t.tierId}
                checked={i === active}
                onChange={() => setActive(i)}
                className="peer sr-only"
              />
              <span className="flex flex-col items-center rounded-full px-4 py-2.5 text-center text-sm text-white/65 transition peer-checked:bg-gradient-to-l peer-checked:from-cyan peer-checked:to-neon peer-checked:font-bold peer-checked:text-ink peer-checked:shadow-[0_0_24px_rgba(168,85,247,.45)] peer-focus-visible:ring-2 peer-focus-visible:ring-cyan sm:px-7">
                {t.label}
                <span className="font-display text-[11px] tracking-[0.2em] opacity-70" dir="ltr">
                  {t.latin}
                </span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div key={active} aria-live="polite">
        <div className="animate-fade-up glass mt-8 grid gap-6 rounded-[2rem] p-6 md:grid-cols-[auto_1fr] md:items-center md:p-8">
          <div className="md:border-e md:border-white/10 md:pe-8">
            <p className="text-xs text-white/45">{labels.budgetLabel}</p>
            <p className="text-gradient mt-1 text-2xl font-black md:text-3xl">{tier.budget}</p>
          </div>
          <div>
            <p className="leading-8 text-white/75">{tier.who}</p>
            {tier.tip && (
              <p className="mt-3 flex gap-2 text-sm leading-7 text-cyan/90">
                <span aria-hidden="true">💡</span>
                {tier.tip}
              </p>
            )}
          </div>
        </div>

        {groups.map((g, gi) => (
          <section key={g.key} className="mt-12" aria-label={g.title ?? undefined}>
            <h3 className="flex items-center gap-3 text-xl font-bold text-white">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/5 text-cyan ring-1 ring-white/10">{g.icon}</span>
              {g.title}
            </h3>
            <div className={`mt-5 grid gap-4 sm:grid-cols-2 ${g.items.length > 2 ? "lg:grid-cols-3" : ""}`}>
              {g.items.map((item, i) => (
                <GearCard key={item.id ?? `${item.brand}-${item.name}`} item={item} delay={gi * 120 + i * 70} />
              ))}
            </div>
          </section>
        ))}

        <p className="mt-8 text-xs leading-6 text-white/40">{labels.priceNote}</p>
      </div>
    </div>
  );
}
