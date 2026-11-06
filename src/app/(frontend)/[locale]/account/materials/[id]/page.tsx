import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import RichTextView from "@/components/ui/RichTextView";
import { ArrowLeft, FileIcon } from "@/components/icons";
import { href, isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getCurrentUser, getPayloadClient } from "@/lib/cms";
import { embedUrl } from "@/lib/video";
import type { File as FileDoc, Material } from "@/payload-types";

type Props = { params: Promise<{ locale: string; id: string }> };

export const metadata: Metadata = { robots: { index: false } };

export default async function MaterialPage({ params }: Props) {
  const { locale, id } = await params;
  if (!isLocale(locale)) notFound();
  const user = await getCurrentUser();
  if (!user) redirect(`${href(locale, "/login")}?next=${encodeURIComponent(href(locale, `/account/materials/${id}`))}`);

  const payload = await getPayloadClient();
  const res = await payload.find({
    collection: "materials",
    where: { id: { equals: Number(id) } },
    locale,
    user,
    overrideAccess: false,
    depth: 1,
    limit: 1,
  });
  const m = res.docs[0] as Material | undefined;
  if (!m) notFound();

  const t = getDictionary(locale).account;
  const embed = embedUrl(m.videoUrl);
  const video = typeof m.video === "object" && m.video ? (m.video as FileDoc) : null;
  const files = (m.attachments ?? []).filter((a): a is FileDoc => typeof a === "object" && a !== null);

  return (
    <article className="px-5 pt-32 pb-28 md:px-8 md:pt-40">
      <div className="mx-auto max-w-4xl">
        <Link href={href(locale, "/account")} className="inline-flex items-center gap-2 text-sm text-white/55 hover:text-white">
          <ArrowLeft className="h-4 w-4 rotate-180" />
          {t.back}
        </Link>
        <p className="mt-8 text-sm font-bold text-cyan">{t.courses[m.course] ?? m.course}</p>
        <h1 className="mt-2 text-3xl font-black leading-[1.35] text-white md:text-5xl">{m.title}</h1>
        {m.summary && <p className="mt-5 text-lg leading-9 text-white/65">{m.summary}</p>}

        {embed ? (
          <div className="glass mt-10 aspect-video overflow-hidden rounded-3xl">
            <iframe src={embed} title={m.title} allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen className="h-full w-full" />
          </div>
        ) : video ? (
          <video controls preload="metadata" src={`/api/file/${video.id}`} className="glass mt-10 w-full rounded-3xl" controlsList="nodownload" />
        ) : null}

        <div className="mt-10">
          <RichTextView data={m.body} />
        </div>

        {files.length > 0 && (
          <div className="glass mt-10 rounded-3xl p-6">
            <h2 className="font-bold text-white">{t.attachments}</h2>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {files.map((f) => (
                <li key={f.id}>
                  <a href={`/api/file/${f.id}`} className="flex items-center gap-3 rounded-2xl bg-white/5 px-4 py-3 text-sm text-white/80 ring-1 ring-white/10 transition hover:bg-white/10">
                    <FileIcon className="h-5 w-5 shrink-0 text-cyan" />
                    <span className="truncate">
                      <bdi>{f.title || f.filename}</bdi>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </article>
  );
}
