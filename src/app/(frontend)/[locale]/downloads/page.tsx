import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import RevealScope from "@/components/ui/RevealScope";
import PageHero from "@/components/ui/PageHero";
import DownloadCard from "@/components/downloads/DownloadCard";
import CategoryNav from "@/components/downloads/CategoryNav";
import { ArrowLeft, CategoryIcon } from "@/components/icons";
import { fmtNum, href, isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getCurrentUser } from "@/lib/cms";
import { CATEGORIES, countByCategory, findDownloads } from "@/lib/downloads";
import { pageMeta } from "@/lib/seo";
import type { Download } from "@/payload-types";

type Params = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = getDictionary(locale).downloads;
  return pageMeta(locale, "/downloads", t.title, t.lead);
}

export default async function DownloadsPage({ params }: Params) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale).downloads;
  const user = await getCurrentUser();
  const [counts, latest] = await Promise.all([countByCategory(locale, user), findDownloads({ locale, user, limit: 12 })]);

  return (
    <RevealScope>
      <PageHero kicker={t.kicker} title={t.title} lead={t.lead}>
        <CategoryNav locale={locale} t={t} counts={counts} />
      </PageHero>

      <section className="px-5 pb-16 md:px-8" aria-label={t.title}>
        <div className="mx-auto grid max-w-7xl gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {CATEGORIES.map((c) => (
            <Link key={c} href={href(locale, `/downloads/${c}`)} data-reveal className="glass neon-card group flex flex-col rounded-3xl p-6">
              <span className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-cyan/15 to-neon/20 text-cyan ring-1 ring-white/10">
                <CategoryIcon name={c} className="h-7 w-7" />
              </span>
              <p className="font-display mt-5 text-sm tracking-[0.25em] text-white/40">
                <span dir="ltr">{t.categories[c].latin}</span>
              </p>
              <h2 className="mt-1 text-xl font-black text-white">{t.categories[c].title}</h2>
              <p className="mt-2 flex-1 text-sm leading-7 text-white/55">{t.categories[c].lead}</p>
              <span className="mt-5 flex items-center justify-between text-sm text-neon">
                <span>{counts[c] > 0 ? fmtNum(counts[c], locale) : ""}</span>
                <ArrowLeft className="h-4 w-4 transition group-hover:-translate-x-1 ltr:group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="px-5 pb-28 md:px-8">
        <div className="mx-auto max-w-7xl">
          {latest.docs.length === 0 ? (
            <p data-reveal className="glass rounded-3xl p-10 text-center text-white/55">
              {t.empty}
            </p>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {(latest.docs as Download[]).map((d) => (
                <DownloadCard key={d.id} d={d} locale={locale} t={t} loggedIn={Boolean(user)} />
              ))}
            </div>
          )}
        </div>
      </section>
    </RevealScope>
  );
}
