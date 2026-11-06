import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import RevealScope from "@/components/ui/RevealScope";
import PageHero from "@/components/ui/PageHero";
import RichTextView from "@/components/ui/RichTextView";
import FaqList from "@/components/ui/FaqList";
import { href, isLocale, type Locale } from "@/i18n/config";
import { getCurrentUser, getPayloadClient, mediaUrl } from "@/lib/cms";
import { pageMeta } from "@/lib/seo";
import { embedUrl } from "@/lib/video";
import type { Page } from "@/payload-types";

type Props = { params: Promise<{ locale: string; slug: string }> };

async function findPage(locale: Locale, slug: string): Promise<Page | null> {
  const payload = await getPayloadClient();
  const res = await payload.find({
    collection: "pages",
    where: { slug: { equals: decodeURIComponent(slug) } },
    locale,
    user: await getCurrentUser(),
    overrideAccess: false,
    depth: 1,
    limit: 1,
  });
  return (res.docs[0] as Page | undefined) ?? null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const page = await findPage(locale, slug);
  return page ? pageMeta(locale, `/${page.slug}`, page.title, page.metaDescription ?? page.lead) : {};
}

/** Custom pages built in the admin panel (Content → Pages), served at /<slug>. */
export default async function CustomPage({ params }: Props) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const page = await findPage(locale, slug);
  if (!page) notFound();

  return (
    <RevealScope>
      <PageHero kicker={page.kicker} title={page.title} lead={page.lead} />
      <div className="px-5 pb-28 md:px-8">
        <div className="mx-auto max-w-4xl space-y-12">
          {(page.layout ?? []).map((block) => {
            switch (block.blockType) {
              case "content":
                return (
                  <div key={block.id} data-reveal>
                    <RichTextView data={block.content} />
                  </div>
                );
              case "image": {
                const src = mediaUrl(block.image, "card");
                return src ? (
                  <figure key={block.id} data-reveal className="glass overflow-hidden rounded-3xl">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src} alt={typeof block.image === "object" ? (block.image.alt ?? "") : ""} className="w-full" loading="lazy" />
                    {block.caption && <figcaption className="px-5 py-3 text-sm text-white/50">{block.caption}</figcaption>}
                  </figure>
                ) : null;
              }
              case "cta":
                return (
                  <div key={block.id} data-reveal className="glass rounded-[2rem] p-8 text-center md:p-12">
                    <h2 className="text-2xl font-black text-white md:text-4xl">{block.title}</h2>
                    {block.text && <p className="mx-auto mt-4 max-w-xl leading-8 text-white/60">{block.text}</p>}
                    {block.buttonLabel && block.buttonHref && (
                      <Link href={href(locale, block.buttonHref)} className="btn-neon mt-8">
                        {block.buttonLabel}
                      </Link>
                    )}
                  </div>
                );
              case "faq":
                return <FaqList key={block.id} items={block.items} />;
              case "video": {
                const src = embedUrl(block.url);
                return src ? (
                  <figure key={block.id} data-reveal>
                    <div className="glass aspect-video overflow-hidden rounded-3xl">
                      <iframe src={src} title={block.caption ?? page.title} allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen className="h-full w-full" />
                    </div>
                    {block.caption && <figcaption className="mt-3 text-sm text-white/50">{block.caption}</figcaption>}
                  </figure>
                ) : null;
              }
              default:
                return null;
            }
          })}
        </div>
      </div>
    </RevealScope>
  );
}
