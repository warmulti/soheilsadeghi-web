import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import RevealScope from "@/components/ui/RevealScope";
import RichTextView from "@/components/ui/RichTextView";
import { buyLabel, buyLink } from "@/components/products/ProductCard";
import { ArrowLeft } from "@/components/icons";
import { href, isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getCurrentUser, getGlobal, mediaUrl } from "@/lib/cms";
import { findProduct } from "@/lib/products";
import { pageMeta } from "@/lib/seo";
import type { Media } from "@/payload-types";

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const p = await findProduct(locale, await getCurrentUser(), decodeURIComponent(slug));
  if (!p) return {};
  const meta = pageMeta(locale, `/products/${p.slug}`, p.title, p.excerpt);
  const image = mediaUrl(p.image, "card");
  return image ? { ...meta, openGraph: { images: [image] } } : meta;
}

export default async function ProductPage({ params }: Props) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const user = await getCurrentUser();
  const p = await findProduct(locale, user, decodeURIComponent(slug));
  if (!p) notFound();

  const t = getDictionary(locale).products;
  const settings = await getGlobal("settings", locale);
  const main = mediaUrl(p.image, "card");
  const gallery = (p.gallery ?? []).map((g) => mediaUrl(g.image as Media | number | null | undefined, "card")).filter(Boolean) as string[];
  const link = buyLink(p, locale, { telegram: settings.telegram, whatsapp: settings.whatsapp });

  return (
    <RevealScope>
      <section className="px-5 pt-32 pb-28 md:px-8 md:pt-40">
        <div className="mx-auto max-w-6xl">
          <Link data-reveal href={href(locale, "/products")} className="inline-flex items-center gap-2 text-sm text-white/55 hover:text-white">
            <ArrowLeft className="h-4 w-4 rotate-180" />
            {t.back}
          </Link>

          <div className="mt-8 grid gap-10 lg:grid-cols-2">
            <div data-reveal className="grid gap-4">
              <div className="glass overflow-hidden rounded-[2rem]">
                <div className="aspect-square bg-gradient-to-br from-cyan/15 via-ink-2 to-neon/25">
                  {main ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={main} alt={p.title} className="h-full w-full object-cover" />
                  ) : (
                    <span className="grid h-full w-full place-items-center font-display text-7xl text-white/15">DJ</span>
                  )}
                </div>
              </div>
              {gallery.length > 0 && (
                <div className="grid grid-cols-4 gap-3">
                  {gallery.map((src) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img key={src} src={src} alt="" className="aspect-square w-full rounded-xl object-cover ring-1 ring-white/10" />
                  ))}
                </div>
              )}
            </div>

            <div>
              {p.badge && <span data-reveal className="inline-block rounded-full bg-neon/10 px-3 py-1 text-xs text-neon ring-1 ring-neon/25">{p.badge}</span>}
              <h1 data-reveal className="mt-4 text-3xl font-black leading-[1.35] text-white md:text-5xl">
                {p.title}
              </h1>
              {p.excerpt && (
                <p data-reveal className="mt-5 text-lg leading-9 text-white/65">
                  {p.excerpt}
                </p>
              )}

              <div data-reveal className="mt-6 flex items-end gap-3">
                {p.oldPrice && <span className="text-lg text-white/35 line-through">{p.oldPrice}</span>}
                {p.price && <span className="text-2xl font-black text-cyan">{p.price}</span>}
              </div>

              <div data-reveal className="mt-8">
                <a
                  href={link.href}
                  target={link.external ? "_blank" : undefined}
                  rel={link.external ? "noopener noreferrer" : undefined}
                  className="btn-neon px-10"
                >
                  {buyLabel(p, t)}
                </a>
              </div>

              {p.description && (
                <div data-reveal className="mt-10">
                  <RichTextView data={p.description} />
                </div>
              )}

              {p.tags && p.tags.length > 0 && (
                <ul data-reveal className="mt-8 flex flex-wrap gap-2">
                  {p.tags.map((tag) => (
                    <li key={tag} className="rounded-full bg-white/5 px-3 py-1 text-xs text-white/60 ring-1 ring-white/10">
                      <bdi>{tag}</bdi>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </section>
    </RevealScope>
  );
}
