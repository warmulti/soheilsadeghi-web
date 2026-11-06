import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SearchIcon } from "@/components/icons";
import { href, isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getCurrentUser, getPayloadClient } from "@/lib/cms";
import { siteSearch } from "@/lib/search";

type Props = { params: Promise<{ locale: string }>; searchParams: Promise<{ q?: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale) ? { title: getDictionary(locale).search.title, robots: { index: false } } : {};
}

export default async function SearchPage({ params, searchParams }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const q = ((await searchParams).q ?? "").slice(0, 80).trim();
  const t = getDictionary(locale).search;
  const results = q.length >= 2 ? await siteSearch(await getPayloadClient(), q, locale, await getCurrentUser(), 50) : [];

  return (
    <section className="px-5 pt-32 pb-28 md:px-8 md:pt-40">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-black text-white md:text-5xl">{t.title}</h1>
        <form action={href(locale, "/search")} className="glass mt-8 flex items-center gap-3 rounded-full px-5" role="search">
          <SearchIcon className="h-5 w-5 shrink-0 text-neon" />
          <input name="q" defaultValue={q} placeholder={t.placeholder} aria-label={t.title} className="h-14 w-full bg-transparent text-white outline-none placeholder:text-white/35" />
          <button type="submit" className="btn-neon shrink-0 px-5 py-2">
            {t.open}
          </button>
        </form>

        {q.length >= 2 && (
          <p className="mt-8 text-sm text-white/45">
            {t.resultsFor} «<bdi>{q}</bdi>»
          </p>
        )}

        {q.length >= 2 && results.length === 0 ? (
          <p className="glass mt-6 rounded-3xl p-8 text-center text-white/55">{t.noResults}</p>
        ) : (
          <ul className="mt-6 space-y-3">
            {results.map((r) => (
              <li key={`${r.href}-${r.title}`}>
                <Link href={r.href} className="glass neon-card flex items-start gap-4 rounded-2xl p-5">
                  <span className="mt-0.5 shrink-0 rounded-full bg-neon/10 px-2.5 py-0.5 text-[11px] text-neon ring-1 ring-neon/25">{t.types[r.type]}</span>
                  <span className="min-w-0">
                    <span className="block font-bold text-white">{r.title}</span>
                    {r.snippet && <span className="mt-1 line-clamp-2 block text-sm leading-7 text-white/50">{r.snippet}</span>}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
