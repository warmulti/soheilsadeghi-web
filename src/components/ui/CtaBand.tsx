import Link from "next/link";
import { href, type Locale } from "@/i18n/config";
import type { Setting } from "@/payload-types";

type Props = {
  locale: Locale;
  data: Setting["ctaBand"];
  text?: string | null;
  primaryLabel?: string | null;
  primaryHref?: string;
  secondaryLabel?: string | null;
  secondaryHref?: string;
  /** Use `data-reveal` (inner pages) or the homepage's `.reveal` class. */
  revealAttr?: boolean;
};

/** "Ready to step up to the decks?" closing band; texts edited in Site settings. */
export default function CtaBand({
  locale,
  data,
  text,
  primaryLabel,
  primaryHref = "/contact",
  secondaryLabel,
  secondaryHref = "/buying-guide",
  revealAttr = true,
}: Props) {
  const end = data?.titleEnd ?? "";
  // No space before closing punctuation ("decks?" not "decks ?").
  const titleEnd = end && /^[?!.,؟]/.test(end) ? end : end ? ` ${end}` : "";
  return (
    <section className="home-cta relative z-10 px-5 pb-32 md:px-8" aria-labelledby="cta-title">
      <div
        {...(revealAttr ? { "data-reveal": "" } : {})}
        className={`${revealAttr ? "" : "reveal"} glass relative mx-auto max-w-5xl overflow-hidden rounded-[2.5rem] px-8 py-16 text-center md:py-20`}
      >
        <div className="pointer-events-none absolute -top-24 left-1/2 h-48 w-[70%] -translate-x-1/2 rounded-full bg-neon/20 blur-3xl" aria-hidden="true" />
        <h2 id="cta-title" className="relative text-3xl font-black leading-[1.35] text-white md:text-5xl">
          {data?.title} <span className="text-gradient">{data?.titleAccent}</span>
          {titleEnd}
        </h2>
        <p className="relative mx-auto mt-5 max-w-xl leading-8 text-white/60">{text ?? data?.text}</p>
        <div className="relative mt-9 flex flex-wrap justify-center gap-3">
          <Link href={href(locale, primaryHref)} className="btn-neon px-8">
            {primaryLabel ?? data?.primary}
          </Link>
          <Link href={href(locale, secondaryHref)} className="btn-ghost px-8">
            {secondaryLabel ?? data?.secondary}
          </Link>
        </div>
      </div>
    </section>
  );
}
