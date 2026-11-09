import type { Metadata } from "next";
import { notFound } from "next/navigation";
import RevealScope from "@/components/ui/RevealScope";
import PageHero from "@/components/ui/PageHero";
import ProductCard from "@/components/products/ProductCard";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getCurrentUser, getGlobal } from "@/lib/cms";
import { findProducts } from "@/lib/products";
import { pageMeta } from "@/lib/seo";
import type { Product } from "@/payload-types";

type Params = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = getDictionary(locale).products;
  const page = await getGlobal("products-page", locale);
  return pageMeta(locale, "/products", page.title || t.title, page.lead || t.lead);
}

export default async function ProductsPage({ params }: Params) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale).products;
  const user = await getCurrentUser();
  const [page, result] = await Promise.all([getGlobal("products-page", locale), findProducts({ locale, user })]);

  return (
    <RevealScope>
      <PageHero kicker={page.kicker || t.kicker} title={page.title || t.title} lead={page.lead || t.lead} />

      <section className="px-5 pb-28 md:px-8">
        <div className="mx-auto max-w-7xl">
          {result.docs.length === 0 ? (
            <p data-reveal className="glass rounded-3xl p-10 text-center text-white/55">
              {page.empty || t.empty}
            </p>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {(result.docs as Product[]).map((p) => (
                <ProductCard key={p.id} p={p} locale={locale} t={t} />
              ))}
            </div>
          )}
        </div>
      </section>
    </RevealScope>
  );
}
