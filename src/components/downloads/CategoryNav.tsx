import Link from "next/link";
import { fmtNum, href, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { CATEGORIES, type Category } from "@/lib/downloads";
import { CategoryIcon } from "@/components/icons";

/** Pills linking the download categories; `active` highlights the current one. */
export default function CategoryNav({ locale, t, active, counts }: { locale: Locale; t: Dictionary["downloads"]; active?: Category; counts?: Record<Category, number> }) {
  return (
    <nav aria-label={t.title} className="flex flex-wrap gap-2">
      <Link
        href={href(locale, "/downloads")}
        aria-current={!active ? "page" : undefined}
        className={`rounded-full px-4 py-2 text-sm transition ${!active ? "bg-gradient-to-l from-cyan to-neon font-bold text-ink" : "bg-white/5 text-white/70 ring-1 ring-white/10 hover:text-white"}`}
      >
        {t.all}
      </Link>
      {CATEGORIES.map((c) => (
        <Link
          key={c}
          href={href(locale, `/downloads/${c}`)}
          aria-current={active === c ? "page" : undefined}
          className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm transition ${
            active === c ? "bg-gradient-to-l from-cyan to-neon font-bold text-ink" : "bg-white/5 text-white/70 ring-1 ring-white/10 hover:text-white"
          }`}
        >
          <CategoryIcon name={c} className="h-4 w-4" />
          {t.categories[c].title}
          {counts && counts[c] > 0 && <span className="text-[11px] opacity-60">{fmtNum(counts[c], locale)}</span>}
        </Link>
      ))}
    </nav>
  );
}
