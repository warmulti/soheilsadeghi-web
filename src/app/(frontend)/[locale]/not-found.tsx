import Link from "next/link";
import { headers } from "next/headers";
import Vinyl from "@/components/Vinyl";
import { ArrowLeft } from "@/components/icons";
import { href, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";

/** 404 inside the site layout. The language comes from the x-locale header set by proxy.ts. */
export default async function NotFound() {
  const locale: Locale = (await headers()).get("x-locale") === "en" ? "en" : "fa";
  const t = getDictionary(locale);
  return (
    <section className="relative flex min-h-[100svh] items-center overflow-hidden px-5 pt-28 pb-16 md:px-8">
      <div className="pointer-events-none absolute -end-[20vw] top-1/2 w-[60vw] max-w-[700px] -translate-y-1/2 opacity-40 md:-end-[10vw]" aria-hidden="true">
        <Vinyl showArm={false} />
      </div>
      <div className="relative mx-auto w-full max-w-7xl">
        <p className="font-display text-outline text-8xl leading-none md:text-[10rem]">
          <span dir="ltr">404</span>
        </p>
        <h1 className="mt-6 text-3xl font-black text-white md:text-5xl">{t.notFoundTitle}</h1>
        <p className="mt-5 max-w-xl text-lg leading-8 text-white/60">{t.notFoundText}</p>
        <Link href={href(locale, "/")} className="btn-ghost mt-10">
          {t.backHome}
          <ArrowLeft />
        </Link>
      </div>
    </section>
  );
}
