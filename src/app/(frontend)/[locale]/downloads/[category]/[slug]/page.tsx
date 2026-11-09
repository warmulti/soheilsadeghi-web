import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import RevealScope from "@/components/ui/RevealScope";
import RichTextView from "@/components/ui/RichTextView";
import { AccessBadge, DownloadAction, specChips } from "@/components/downloads/DownloadCard";
import VideoPlayer from "@/components/media/VideoPlayer";
import { ArrowLeft, CategoryIcon } from "@/components/icons";
import { fmtNum, href, isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getCurrentUser, mediaUrl } from "@/lib/cms";
import { findDownload, isCategory } from "@/lib/downloads";
import { pageMeta } from "@/lib/seo";

type Props = { params: Promise<{ locale: string; category: string; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, category, slug } = await params;
  if (!isLocale(locale) || !isCategory(category)) return {};
  const d = await findDownload(locale, await getCurrentUser(), category, decodeURIComponent(slug));
  if (!d) return {};
  const meta = pageMeta(locale, `/downloads/${category}/${d.slug}`, d.title, d.excerpt);
  const cover = mediaUrl(d.cover, "card");
  return cover ? { ...meta, openGraph: { images: [cover] } } : meta;
}

export default async function DownloadPage({ params }: Props) {
  const { locale, category, slug } = await params;
  if (!isLocale(locale) || !isCategory(category)) notFound();
  const user = await getCurrentUser();
  const d = await findDownload(locale, user, category, decodeURIComponent(slug));
  if (!d) notFound();

  const t = getDictionary(locale).downloads;
  const cat = t.categories[category];
  const cover = mediaUrl(d.cover, "card");
  const preview = typeof d.preview === "object" && d.preview ? d.preview.url : undefined;
  const specs = specChips(d, t, locale);
  // Videos play inline when the viewer may access them (external links aren't proxied).
  const accessible = d.visibility === "public" || Boolean(user);
  const videoSrc = category === "videos" && d.source === "file" && accessible ? `/api/stream/${d.id}` : undefined;

  return (
    <RevealScope>
      <section className="px-5 pt-32 pb-28 md:px-8 md:pt-40">
        <div className="mx-auto max-w-6xl">
          <Link data-reveal href={href(locale, `/downloads/${category}`)} className="inline-flex items-center gap-2 text-sm text-white/55 hover:text-white">
            <ArrowLeft className="h-4 w-4 rotate-180" />
            {t.back} {cat.title}
          </Link>

          <div className={`mt-8 grid gap-10 ${videoSrc ? "" : "lg:grid-cols-[1fr_1.2fr]"}`}>
            {videoSrc ? (
              <div data-reveal>
                <VideoPlayer src={videoSrc} poster={cover} title={d.title} />
              </div>
            ) : (
            <div data-reveal className="glass overflow-hidden rounded-[2rem]">
              <div className="relative aspect-square bg-gradient-to-br from-cyan/15 via-ink-2 to-neon/25">
                {cover ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={cover} alt={d.title} className="h-full w-full object-cover" />
                ) : (
                  <span className="grid h-full w-full place-items-center text-white/25">
                    <CategoryIcon name={category} className="h-24 w-24" />
                  </span>
                )}
              </div>
              {preview && (
                <div className="p-5">
                  <p className="mb-2 text-xs text-white/45">{t.preview}</p>
                  <audio controls preload="metadata" src={preview} className="w-full [color-scheme:dark]" />
                </div>
              )}
            </div>
            )}

            <div>
              <div data-reveal className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-neon/10 px-3 py-1 text-xs text-neon ring-1 ring-neon/25">{cat.title}</span>
                <AccessBadge d={d} t={t} />
              </div>
              <h1 data-reveal className="mt-4 text-3xl font-black leading-[1.35] text-white md:text-5xl">
                {d.title}
              </h1>
              {d.excerpt && (
                <p data-reveal className="mt-5 text-lg leading-9 text-white/65">
                  {d.excerpt}
                </p>
              )}

              {specs.length > 0 && (
                <ul data-reveal className="mt-6 flex flex-wrap gap-2">
                  {specs.map((s) => (
                    <li key={s} className="rounded-full bg-white/5 px-3 py-1 text-xs text-white/70 ring-1 ring-white/10">
                      <bdi>{s}</bdi>
                    </li>
                  ))}
                  {d.license && (
                    <li className="rounded-full bg-white/5 px-3 py-1 text-xs text-white/70 ring-1 ring-white/10">
                      {t.license}: <bdi>{d.license}</bdi>
                    </li>
                  )}
                </ul>
              )}

              <div data-reveal className="mt-8 flex flex-wrap items-center gap-4">
                <DownloadAction d={d} loggedIn={Boolean(user)} locale={locale} t={t} className="px-8" />
                {(d.downloadCount ?? 0) > 0 && (
                  <span className="text-sm text-white/45">
                    {fmtNum(d.downloadCount ?? 0, locale)} {t.count}
                  </span>
                )}
                {d.source === "link" && <span className="text-xs text-white/35">{t.externalNote}</span>}
              </div>

              <div data-reveal className="mt-10">
                <RichTextView data={d.description} />
              </div>

              {d.tracklist && (
                <div data-reveal className="glass mt-8 rounded-3xl p-6">
                  <h2 className="font-bold text-white">{t.tracklist}</h2>
                  <pre className="mt-4 font-sans text-sm leading-8 whitespace-pre-wrap text-white/65">{d.tracklist}</pre>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </RevealScope>
  );
}
