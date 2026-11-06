import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import RevealScope from "@/components/ui/RevealScope";
import PageHero from "@/components/ui/PageHero";
import DownloadCard from "@/components/downloads/DownloadCard";
import CategoryNav from "@/components/downloads/CategoryNav";
import { fmtNum, href, isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getCurrentUser } from "@/lib/cms";
import { findDownloads, isCategory } from "@/lib/downloads";
import { pageMeta } from "@/lib/seo";
import type { Download } from "@/payload-types";

type Props = { params: Promise<{ locale: string; category: string }>; searchParams: Promise<{ page?: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, category } = await params;
  if (!isLocale(locale) || !isCategory(category)) return {};
  const c = getDictionary(locale).downloads.categories[category];
  return pageMeta(locale, `/downloads/${category}`, c.title, c.lead);
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { locale, category } = await params;
  if (!isLocale(locale) || !isCategory(category)) notFound();
  const page = Math.max(1, Number((await searchParams).page) || 1);
  const t = getDictionary(locale).downloads;
  const c = t.categories[category];
  const user = await getCurrentUser();
  const result = await findDownloads({ locale, user, category, page, limit: 24 });
  const base = href(locale, `/downloads/${category}`);

  return (
    <RevealScope>
      <PageHero kicker={c.latin} title={c.title} lead={c.lead}>
        <CategoryNav locale={locale} t={t} active={category} />
      </PageHero>

      <section className="px-5 pb-28 md:px-8">
        <div className="mx-auto max-w-7xl">
          {result.docs.length === 0 ? (
            <p data-reveal className="glass rounded-3xl p-10 text-center text-white/55">
              {t.empty}
            </p>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {(result.docs as Download[]).map((d) => (
                <DownloadCard key={d.id} d={d} locale={locale} t={t} loggedIn={Boolean(user)} />
              ))}
            </div>
          )}

          {result.totalPages > 1 && (
            <nav className="mt-12 flex flex-wrap justify-center gap-2" aria-label="pagination">
              {Array.from({ length: result.totalPages }, (_, i) => i + 1).map((p) => (
                <Link
                  key={p}
                  href={p === 1 ? base : `${base}?page=${p}`}
                  aria-current={p === page ? "page" : undefined}
                  className={`grid h-10 min-w-10 place-items-center rounded-full px-3 text-sm ${p === page ? "bg-gradient-to-l from-cyan to-neon font-bold text-ink" : "bg-white/5 text-white/70 ring-1 ring-white/10"}`}
                >
                  {fmtNum(p, locale)}
                </Link>
              ))}
            </nav>
          )}
        </div>
      </section>
    </RevealScope>
  );
}
