"use client";

import { useId, useRef, useState } from "react";
import type { DjingCourse } from "@/payload-types";
import { pad2 } from "@/lib/fa";

export type ModuleGroup = NonNullable<DjingCourse["syllabus"]>[number];

/** Tabbed syllabus / curriculum: one tab per level or track, module cards below. */
export default function ModuleTabs({ groups, label }: { groups: ModuleGroup[]; label: string }) {
  if (!groups.length) return null;
  return <Tabs groups={groups} label={label} />;
}

function Tabs({ groups, label }: { groups: ModuleGroup[]; label: string }) {
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const uid = useId();
  const group = groups[active];

  const focusTab = (i: number) => {
    const next = (i + groups.length) % groups.length;
    setActive(next);
    tabs.current[next]?.focus();
  };

  // Arrow keys follow the reading direction: in RTL ArrowLeft moves forward.
  const onKeyDown = (e: React.KeyboardEvent) => {
    const forward = document.documentElement.dir === "rtl" ? "ArrowLeft" : "ArrowRight";
    const back = forward === "ArrowLeft" ? "ArrowRight" : "ArrowLeft";
    if (e.key === forward) focusTab(active + 1);
    else if (e.key === back) focusTab(active - 1);
    else if (e.key === "Home") focusTab(0);
    else if (e.key === "End") focusTab(groups.length - 1);
    else return;
    e.preventDefault();
  };

  return (
    <div>
      <div role="tablist" aria-label={label} className="flex flex-wrap gap-2" onKeyDown={onKeyDown}>
        {groups.map((g, i) => (
          <button
            key={g.id ?? g.label}
            ref={(el) => {
              tabs.current[i] = el;
            }}
            type="button"
            role="tab"
            id={`${uid}-tab-${i}`}
            aria-selected={i === active}
            aria-controls={`${uid}-panel`}
            tabIndex={i === active ? 0 : -1}
            onClick={() => setActive(i)}
            className={`rounded-full px-5 py-2.5 text-sm transition ${
              i === active
                ? "bg-gradient-to-l from-cyan to-neon font-bold text-ink shadow-[0_0_24px_rgba(168,85,247,.4)]"
                : "bg-white/5 text-white/70 ring-1 ring-white/10 hover:bg-white/10 hover:text-white"
            }`}
          >
            {g.label}
          </button>
        ))}
      </div>

      <div
        role="tabpanel"
        id={`${uid}-panel`}
        aria-labelledby={`${uid}-tab-${active}`}
        tabIndex={0}
        className="mt-8 focus-visible:outline-offset-8"
      >
        <p key={`s-${active}`} className="animate-fade-up max-w-2xl leading-8 text-white/60">
          <span className="font-display me-3 tracking-[0.25em] text-neon" dir="ltr">
            {group.latin}
          </span>
          {group.summary}
        </p>

        <div key={active} className="mt-8 grid gap-4 md:grid-cols-2">
          {(group.modules ?? []).map((m, i) => (
            <article
              key={m.id ?? m.title}
              className="animate-fade-up glass neon-card rounded-3xl p-6 md:p-7"
              style={{ animationDelay: `${i * 70}ms` }}
            >
              <div className="flex items-center justify-between gap-4">
                <span className="font-display text-outline text-5xl leading-none" dir="ltr">
                  {pad2(i + 1)}
                </span>
                <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-white/55 ring-1 ring-white/10">
                  {m.sessions}
                </span>
              </div>
              <h3 className="mt-5 text-lg font-bold text-white">{m.title}</h3>
              <ul className="mt-4 space-y-2.5">
                {(m.topics ?? []).map((t) => (
                  <li key={t.id ?? t.text} className="flex gap-3 text-sm leading-7 text-white/65">
                    <span className="mt-[0.7rem] h-1.5 w-1.5 shrink-0 rounded-full bg-cyan shadow-[0_0_10px_#22d3ee]" />
                    {t.text}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
