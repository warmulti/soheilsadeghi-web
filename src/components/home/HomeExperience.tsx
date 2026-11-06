"use client";

import Link from "next/link";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Vinyl from "@/components/Vinyl";
import CtaBand from "@/components/ui/CtaBand";
import { ArrowLeft, CrossfaderIcon, ServiceGlyph } from "@/components/icons";
import { href, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Home, Setting } from "@/payload-types";
import { pad2 } from "@/lib/fa";
import { markMotionReady } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const LEVEL_STYLE = {
  beginner: "text-emerald-300 ring-emerald-300/30 bg-emerald-300/5",
  intermediate: "text-amber-300 ring-amber-300/30 bg-amber-300/5",
  advanced: "text-rose-300 ring-rose-300/30 bg-rose-300/5",
} as const;

type Props = {
  locale: Locale;
  home: Home;
  settings: Setting;
  photo: { src: string; alt: string; eyeLine: number };
  t: Pick<Dictionary, "levels" | "heroIntro">;
};

/**
 * Home page scroll story:
 * 0. Intro — vinyl, portrait and text animate in on load.
 * 1–2. Hero is pinned; scrolling fades portrait / text / vignette while the vinyl glides aside.
 * 3. Service cards reveal next to the (fixed) vinyl.
 * 4. Vinyl retreats to the corner; Turntablism history as a pinned horizontal timeline, then techniques.
 *
 * Every scroll phase animates its own wrapper, so no tween ever overwrites another's transform:
 *   .vinyl-a (hero → services)  ›  .vinyl-b (→ turntablism)  ›  .vinyl-intro (load)  ›  <Vinyl/> (ticker spin)
 * Same idea for the scroll hint: .scroll-hint (intro fade-in) lives inside .scroll-hint-out (scroll fade-out).
 * In RTL (Persian) the vinyl moves left and the timeline track right; in LTR both are mirrored.
 * ScrollTriggers are created in page order so later triggers see the pin spacing of earlier pins.
 */
export default function HomeExperience({ locale, home, settings, photo, t }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const L = (path: string) => href(locale, path);

  useGSAP(
    () => {
      markMotionReady();
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();
      // -1 in RTL: the vinyl leaves to the left; +1 in LTR: to the right.
      const side = document.documentElement.dir === "rtl" ? -1 : 1;

      mm.add(
        {
          desktop: "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
          mobile: "(max-width: 1023px) and (prefers-reduced-motion: no-preference)",
          reduce: "(prefers-reduced-motion: reduce)",
        },
        (ctx) => {
          const { desktop, reduce } = ctx.conditions as { desktop: boolean; mobile: boolean; reduce: boolean };

          if (reduce) {
            gsap.set(q(".vinyl-a"), { opacity: 0.25 });
            return;
          }

          const W = () => window.innerWidth;
          const H = () => window.innerHeight;

          const reveal = (scope: string) =>
            q(`${scope} .reveal`).forEach((el: Element) => {
              gsap.from(el, { y: 50, opacity: 0, duration: 1, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 85%" } });
            });

          const batchCards = (scope: string) => {
            const cards = q(`${scope} .stagger-card`);
            gsap.set(cards, { opacity: 0 });
            ScrollTrigger.batch(cards, {
              start: "top 88%",
              onEnter: (batch) =>
                gsap.fromTo(
                  batch,
                  { y: 70, opacity: 0, rotateX: -12 },
                  { y: 0, opacity: 1, rotateX: 0, duration: 1, stagger: 0.14, ease: "power3.out", overwrite: true },
                ),
            });
          };

          /* ---------- 0. Intro on load (elements start hidden via the html.js CSS gate) ---------- */
          gsap
            .timeline({ defaults: { ease: "power3.out" } })
            .fromTo(q(".vinyl-intro"), { scale: 0.6, opacity: 0, rotation: -120 }, { scale: 1, opacity: 1, rotation: 0, duration: 1.8, ease: "expo.out" })
            .fromTo(q(".hero-photo-inner"), { y: 80, opacity: 0, filter: "blur(12px)" }, { y: 0, opacity: 1, filter: "blur(0px)", duration: 1.4 }, 0.25)
            .fromTo(q(".hero-line"), { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 1, stagger: 0.12 }, 0.7)
            .fromTo(q(".scroll-hint"), { opacity: 0 }, { opacity: 1, duration: 0.8 }, 1.4);

          /* ---------- 1–2. Hero pinned → fade out, vinyl glides aside ---------- */
          gsap
            .timeline({
              scrollTrigger: { trigger: q(".hero")[0], start: "top top", end: "+=110%", pin: true, scrub: 1, invalidateOnRefresh: true },
            })
            .to(q(".scroll-hint-out"), { opacity: 0, duration: 0.1 }, 0)
            .to(q(".hero-text"), { opacity: 0, y: -70, filter: "blur(10px)", duration: 0.5 }, 0)
            .to(q(".hero-vignette, .hero-fade"), { opacity: 0, duration: 0.6 }, 0.05)
            .to(q(".hero-photo-wrap"), { opacity: 0, scale: 1.08, y: -40, duration: 0.6 }, 0.1)
            .to(
              q(".vinyl-a"),
              desktop
                ? { x: () => side * W() * 0.29, scale: 0.62, duration: 1, ease: "power2.inOut" }
                : { y: () => -H() * 0.06, scale: 0.85, opacity: 0.22, duration: 1, ease: "power2.inOut" },
              0.15,
            );

          /* ---------- 3. Services ---------- */
          reveal("#services");
          batchCards("#services");

          /* ---------- 4a. Vinyl retreats to the top corner ---------- */
          gsap.to(q(".vinyl-b"), {
            ...(desktop ? { x: () => side * W() * 0.21, y: () => -H() * 0.44, scale: 0.45, opacity: 0.35 } : { opacity: 0.5 }),
            ease: "none",
            scrollTrigger: { trigger: q(".tt-section")[0], start: "top 80%", end: "top 10%", scrub: 1, invalidateOnRefresh: true },
          });
          reveal(".tt-intro");

          /* ---------- 4b. Horizontal timeline (RTL → track moves right, LTR → left) ---------- */
          const pinEl = q(".tt-pin")[0] as HTMLElement;
          const track = q(".tt-track")[0] as HTMLElement;
          const distance = () => Math.max(0, track.offsetWidth - pinEl.clientWidth);

          ScrollTrigger.create({
            trigger: pinEl,
            start: "top top",
            end: () => "+=" + distance(),
            pin: true,
            scrub: 1,
            animation: gsap
              .timeline()
              .to(track, { x: () => -side * distance(), ease: "none" }, 0)
              .fromTo(q(".tt-progress"), { scaleX: 0 }, { scaleX: 1, ease: "none" }, 0),
            invalidateOnRefresh: true,
          });

          /* ---------- 4c. Techniques + CTA ---------- */
          reveal(".tt-techniques");
          batchCards(".tt-techniques");
          reveal(".home-cta");
        },
      );

      document.fonts?.ready.then(() => ScrollTrigger.refresh());
    },
    { scope: root },
  );

  const roles = (settings.roles ?? []).join(" • ").toUpperCase();

  return (
    <div ref={root}>
      {/* Fixed vinyl stage — sits behind all homepage content */}
      <div className="pointer-events-none fixed inset-0 z-0 flex items-center justify-center" aria-hidden="true">
        <div className="vinyl-a" style={{ width: "min(84vh, 92vw)" }}>
          <div className="vinyl-b">
            <div className="vinyl-intro">
              <Vinyl label={settings.brandName} />
            </div>
          </div>
        </div>
      </div>

      {/* ================= HERO ================= */}
      <section className="hero relative z-10 h-[100svh] overflow-hidden" aria-label={t.heroIntro}>
        <div
          className="hero-photo-wrap absolute inset-0 flex items-start justify-center"
          style={{ "--eye-line": photo.eyeLine } as React.CSSProperties}
        >
          <div className="hero-photo-inner">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={photo.src} alt={photo.alt} className="hero-photo" decoding="async" />
          </div>
        </div>

        <div className="hero-vignette pointer-events-none absolute inset-0" />
        <div className="hero-fade pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-ink via-ink/70 to-transparent" />

        <div className="hero-text absolute inset-x-0 bottom-0 px-5 pb-24 text-center md:pb-28">
          {roles && (
            <p className="hero-line font-display text-sm tracking-[0.45em] text-cyan md:text-base" dir="ltr">
              {roles}
            </p>
          )}
          <h1 className="hero-line mt-2">
            <span
              className="font-display block text-[22vw] leading-[0.85] text-white drop-shadow-[0_0_40px_rgba(168,85,247,.45)] md:text-[min(10rem,18svh)]"
              dir="ltr"
            >
              {settings.brandName}
            </span>
            <span className="sr-only">{settings.nameLocal}</span>
          </h1>
          <p className="hero-line mx-auto mt-5 max-w-xl text-base leading-8 text-white/75 md:text-lg">{settings.bioShort}</p>
          <div className="hero-line mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link href={L("/courses/djing")} className="btn-neon px-7 py-3">
              {home.heroPrimary}
            </Link>
            <Link href={L("/biography")} className="btn-ghost px-7 py-3">
              {home.heroSecondary}
            </Link>
          </div>
        </div>

        <div className="scroll-hint-out absolute bottom-6 left-1/2 -translate-x-1/2">
          <div className="scroll-hint flex flex-col items-center gap-2 text-[11px] text-white/45">
            <span className="flex h-9 w-5 justify-center rounded-full border border-white/30 pt-2">
              <span className="scroll-wheel h-2 w-0.5 rounded-full bg-white/70" />
            </span>
            {home.scrollHint}
          </div>
        </div>
      </section>

      {/* ================= SERVICES ================= */}
      <section id="services" className="relative z-10 px-5 py-28 md:px-8 md:py-36" aria-labelledby="services-title">
        <div className="mx-auto max-w-7xl lg:pe-[42%]">
          <div className="reveal">
            <p className="font-display text-base tracking-[0.35em] text-cyan">
              <span dir="ltr">{home.servicesKicker}</span>
            </p>
            <h2 id="services-title" className="mt-3 text-3xl font-black text-white md:text-5xl">
              {home.servicesTitle} <span className="text-gradient">{home.servicesAccent}</span>
            </h2>
            <p className="mt-5 max-w-lg leading-8 text-white/60">{home.servicesLead}</p>
          </div>

          <div className="mt-14 grid gap-5 [perspective:1200px] sm:grid-cols-2">
            {(home.services ?? []).map((s, i) => (
              <Link key={s.id ?? s.title} href={L(s.href)} className="stagger-card glass neon-card group flex flex-col rounded-3xl p-7">
                <div className="flex items-start justify-between">
                  <span className="grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-cyan/15 to-neon/20 text-cyan ring-1 ring-white/10 transition group-hover:text-white">
                    <ServiceGlyph name={s.icon} className="h-10 w-10" />
                  </span>
                  <span className="font-display text-4xl text-white/10" dir="ltr">
                    {pad2(i + 1)}
                  </span>
                </div>
                <h3 className="mt-6 text-xl font-bold leading-8 text-white">{s.title}</h3>
                <p className="mt-3 flex-1 text-sm leading-7 text-white/60">{s.description}</p>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {(s.tags ?? []).map((tag) => (
                    <li key={tag} dir="ltr" className="rounded-full bg-white/5 px-3 py-1 text-[11px] text-white/60 ring-1 ring-white/10">
                      {tag}
                    </li>
                  ))}
                </ul>
                <span className="mt-6 inline-flex items-center gap-2 text-sm text-neon transition-all group-hover:gap-3">
                  {home.moreInfo} <ArrowLeft />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ================= TURNTABLISM ================= */}
      <section className="tt-section relative z-10" aria-labelledby="tt-title">
        <div className="tt-intro mx-auto max-w-7xl px-5 pt-16 pb-10 md:px-8">
          <div className="reveal max-w-3xl">
            <p className="font-display text-base tracking-[0.35em] text-cyan">
              <span dir="ltr">{home.ttKicker}</span>
            </p>
            <h2 id="tt-title" className="mt-3 text-3xl font-black text-white md:text-5xl">
              {home.ttTitle} <span className="text-gradient">{home.ttTitleAccent}</span>
            </h2>
            <p className="mt-6 text-lg leading-9 text-white/65">{home.ttIntro}</p>
          </div>
        </div>

        <div className="tt-pin relative flex h-[100svh] items-center overflow-hidden">
          <div className="tt-track relative flex w-max gap-6 px-[6vw] md:gap-8">
            <div
              className="absolute inset-x-0 top-[58px] h-px from-cyan/60 via-neon/60 to-transparent ltr:bg-gradient-to-r rtl:bg-gradient-to-l"
              aria-hidden="true"
            />
            {(home.timeline ?? []).map((e) => (
              <article key={e.id ?? e.year} className="relative w-[78vw] shrink-0 sm:w-[360px]">
                <p className="font-display text-outline text-start text-7xl leading-none">{e.year}</p>
                <span className="absolute start-2 top-[52px] h-3 w-3 rounded-full bg-neon shadow-[0_0_20px_#a855f7]" />
                <div className="glass mt-8 rounded-3xl p-6">
                  <h3 className="text-lg font-bold text-white">{e.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-white/60">{e.text}</p>
                </div>
              </article>
            ))}
          </div>
          <div className="tt-progress-bar absolute inset-x-[6vw] bottom-10 h-0.5 overflow-hidden rounded-full bg-white/10">
            <div className="tt-progress h-full from-cyan to-neon ltr:origin-left ltr:bg-gradient-to-r rtl:origin-right rtl:bg-gradient-to-l" />
          </div>
        </div>

        <div className="tt-techniques mx-auto max-w-7xl px-5 py-28 md:px-8">
          <div className="reveal max-w-2xl">
            <h3 className="text-2xl font-black text-white md:text-4xl">
              {home.techniquesTitle} <span className="text-gradient">{home.techniquesAccent}</span>
            </h3>
            <p className="mt-4 leading-8 text-white/60">{home.techniquesLead}</p>
          </div>
          <div className="mt-12 grid gap-5 [perspective:1200px] sm:grid-cols-2 lg:grid-cols-3">
            {(home.techniques ?? []).map((x) => (
              <article key={x.id ?? x.name} className="stagger-card glass neon-card rounded-3xl p-6">
                <div className="flex items-center justify-between">
                  <CrossfaderIcon className="h-6 w-12 text-cyan" />
                  <span className={`rounded-full px-3 py-1 text-[11px] ring-1 ${LEVEL_STYLE[x.level]}`}>{t.levels[x.level]}</span>
                </div>
                <h4 className="font-display mt-5 text-3xl text-white">
                  <span dir="ltr">{x.name}</span>
                </h4>
                {x.subtitle && <p className="text-sm text-white/40">{x.subtitle}</p>}
                <p className="mt-4 text-sm leading-7 text-white/60">{x.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <CtaBand locale={locale} data={settings.ctaBand} revealAttr={false} />
    </div>
  );
}
