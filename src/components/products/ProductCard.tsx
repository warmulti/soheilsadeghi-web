import Link from "next/link";
import { href, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Media, Product } from "@/payload-types";
import { mediaUrl } from "@/lib/cms";
import { telegramUrl, whatsappUrl } from "@/lib/links";

type T = Dictionary["products"];

export const productPath = (p: Product) => `/products/${p.slug}`;

/** Where a product's buy button points, and whether it opens a new tab. */
export function buyLink(
  p: Product,
  locale: Locale,
  contact: { telegram?: string | null; whatsapp?: string | null },
): { href: string; external: boolean } {
  const buy = p.buy;
  switch (buy?.type) {
    case "telegram":
      return { href: contact.telegram ? telegramUrl(contact.telegram) : href(locale, "/contact"), external: Boolean(contact.telegram) };
    case "whatsapp":
      return { href: contact.whatsapp ? whatsappUrl(contact.whatsapp) : href(locale, "/contact"), external: Boolean(contact.whatsapp) };
    case "contact":
      return { href: href(locale, "/contact"), external: false };
    default:
      return buy?.url ? { href: buy.url, external: true } : { href: href(locale, "/contact"), external: false };
  }
}

export function buyLabel(p: Product, t: T): string {
  if (p.buy?.buttonLabel) return p.buy.buttonLabel;
  if (p.buy?.type === "contact") return t.contactToOrder;
  if (p.buy?.type === "telegram" || p.buy?.type === "whatsapp") return t.order;
  return t.buy;
}

export default function ProductCard({ p, locale, t }: { p: Product; locale: Locale; t: T }) {
  const image = mediaUrl(p.image as Media | number | null | undefined, "card");
  return (
    <article data-reveal className="glass neon-card flex flex-col overflow-hidden rounded-3xl">
      <Link href={href(locale, productPath(p))} className="relative block aspect-square overflow-hidden bg-gradient-to-br from-cyan/15 via-ink-2 to-neon/25">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={image} alt="" loading="lazy" className="h-full w-full object-cover transition duration-700 hover:scale-105" />
        ) : (
          <span className="grid h-full w-full place-items-center font-display text-5xl text-white/15">DJ</span>
        )}
        {p.badge && <span className="absolute start-3 top-3 rounded-full bg-gradient-to-l from-cyan to-neon px-2.5 py-1 text-[11px] font-bold text-ink">{p.badge}</span>}
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-base font-bold leading-7 text-white">
          <Link href={href(locale, productPath(p))} className="transition hover:text-cyan">
            {p.title}
          </Link>
        </h3>
        {p.excerpt && <p className="mt-2 line-clamp-2 text-sm leading-7 text-white/55">{p.excerpt}</p>}
        <div className="mt-auto flex items-end justify-between gap-3 pt-5">
          <div>
            {p.oldPrice && <span className="block text-xs text-white/35 line-through">{p.oldPrice}</span>}
            {p.price && <span className="block font-bold text-cyan">{p.price}</span>}
          </div>
          <Link href={href(locale, productPath(p))} className="btn-ghost px-4 py-2 text-[13px]">
            {t.details}
          </Link>
        </div>
      </div>
    </article>
  );
}
