import Link from "next/link";
import { href, fmtNum, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Download, Media } from "@/payload-types";
import { mediaUrl } from "@/lib/cms";
import { CategoryIcon, DownloadIcon, LockIcon } from "@/components/icons";

type T = Dictionary["downloads"];

const PLATFORM: Record<string, string> = { windows: "Windows", mac: "macOS", linux: "Linux" };

/** Short spec chips for a download, depending on its category. */
export function specChips(d: Download, t: T, locale: Locale): string[] {
  return [
    d.genre,
    d.bpm ? `${fmtNum(d.bpm, locale)} ${t.bpm}` : null,
    d.musicalKey ? `${t.key} ${d.musicalKey}` : null,
    d.duration,
    d.version ? `${t.version} ${d.version}` : null,
    d.platforms?.length ? d.platforms.map((p) => PLATFORM[p] ?? p).join(" / ") : null,
    d.formats?.length ? d.formats.join(" · ") : null,
    d.fileSize,
  ].filter((x): x is string => Boolean(x));
}

export const detailPath = (d: Download) => `/downloads/${d.category}/${d.slug}`;

/** Download button or "log in to download", depending on visibility and login state. */
export function DownloadAction({ d, loggedIn, locale, t, className = "" }: { d: Download; loggedIn: boolean; locale: Locale; t: T; className?: string }) {
  if (d.visibility !== "public" && !loggedIn) {
    return (
      <Link href={`${href(locale, "/login")}?next=${encodeURIComponent(href(locale, detailPath(d)))}`} className={`btn-ghost ${className}`}>
        <LockIcon />
        {t.loginToDownload}
      </Link>
    );
  }
  return (
    <a href={`/api/download/${d.id}`} className={`btn-neon ${className}`} rel={d.source === "link" ? "noopener noreferrer" : undefined} target={d.source === "link" ? "_blank" : undefined}>
      <DownloadIcon className="h-4 w-4" />
      {t.download}
    </a>
  );
}

export function AccessBadge({ d, t }: { d: Download; t: T }) {
  if (d.visibility === "public") return null;
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-amber-300/10 px-2.5 py-1 text-[11px] text-amber-200 ring-1 ring-amber-300/30">
      <LockIcon className="h-3 w-3" />
      {d.visibility === "groups" ? t.groupOnly : t.membersOnly}
    </span>
  );
}

export default function DownloadCard({ d, locale, t, loggedIn }: { d: Download; locale: Locale; t: T; loggedIn: boolean }) {
  const cover = mediaUrl(d.cover as Media | number | null | undefined, "card");
  const preview = typeof d.preview === "object" && d.preview ? d.preview.url : undefined;
  const chips = specChips(d, t, locale).slice(0, 4);

  return (
    <article data-reveal className="glass neon-card flex flex-col overflow-hidden rounded-3xl">
      <Link href={href(locale, detailPath(d))} className="relative block aspect-[16/10] overflow-hidden bg-gradient-to-br from-cyan/15 via-ink-2 to-neon/25">
        {cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={cover} alt="" loading="lazy" className="h-full w-full object-cover transition duration-700 hover:scale-105" />
        ) : (
          <span className="grid h-full w-full place-items-center text-white/30">
            <CategoryIcon name={d.category} className="h-14 w-14" />
          </span>
        )}
        <span className="absolute start-3 top-3 flex gap-2">
          {d.featured && <span className="rounded-full bg-gradient-to-l from-cyan to-neon px-2.5 py-1 text-[11px] font-bold text-ink">{t.featured}</span>}
          <AccessBadge d={d} t={t} />
        </span>
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-bold leading-7 text-white">
          <Link href={href(locale, detailPath(d))} className="transition hover:text-cyan">
            {d.title}
          </Link>
        </h3>
        {d.excerpt && <p className="mt-2 line-clamp-2 text-sm leading-7 text-white/55">{d.excerpt}</p>}
        {chips.length > 0 && (
          <ul className="mt-4 flex flex-wrap gap-1.5">
            {chips.map((c) => (
              <li key={c} className="rounded-full bg-white/5 px-2.5 py-0.5 text-[11px] text-white/60 ring-1 ring-white/10">
                <bdi>{c}</bdi>
              </li>
            ))}
          </ul>
        )}
        {preview && (
          <audio controls preload="none" src={preview} className="mt-4 h-9 w-full [color-scheme:dark]" aria-label={`${t.preview}: ${d.title}`} />
        )}
        <div className="mt-auto flex items-center justify-between gap-3 pt-5">
          <DownloadAction d={d} loggedIn={loggedIn} locale={locale} t={t} className="px-5 py-2.5 text-[13px]" />
          {(d.downloadCount ?? 0) > 0 && (
            <span className="text-xs text-white/40">
              {fmtNum(d.downloadCount ?? 0, locale)} {t.count}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
