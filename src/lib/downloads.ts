import type { Where } from "payload";
import type { Locale } from "@/i18n/config";
import type { Download, User } from "@/payload-types";
import { getPayloadClient } from "@/lib/cms";

export const CATEGORIES = ["mashups", "podcasts", "tracks", "software", "plugins"] as const;
export type Category = (typeof CATEGORIES)[number];
export const isCategory = (v: string): v is Category => (CATEGORIES as readonly string[]).includes(v);

/** Downloads the visitor may see (the collection's read access does the filtering). */
export async function findDownloads(opts: { locale: Locale; user: User | null; category?: Category; page?: number; limit?: number }) {
  const payload = await getPayloadClient();
  const where: Where = opts.category ? { category: { equals: opts.category } } : {};
  return payload.find({
    collection: "downloads",
    where,
    locale: opts.locale,
    user: opts.user,
    overrideAccess: false,
    depth: 1,
    sort: ["-featured", "-publishedAt"],
    limit: opts.limit ?? 24,
    page: opts.page ?? 1,
  });
}

export async function findDownload(locale: Locale, user: User | null, category: Category, slug: string): Promise<Download | null> {
  const payload = await getPayloadClient();
  const res = await payload.find({
    collection: "downloads",
    where: { and: [{ category: { equals: category } }, { slug: { equals: slug } }] },
    locale,
    user,
    overrideAccess: false,
    depth: 1,
    limit: 1,
  });
  return (res.docs[0] as Download | undefined) ?? null;
}

/** Number of visible items per category (for the category cards). */
export async function countByCategory(locale: Locale, user: User | null): Promise<Record<Category, number>> {
  const payload = await getPayloadClient();
  const counts = await Promise.all(
    CATEGORIES.map((c) =>
      payload.count({ collection: "downloads", where: { category: { equals: c } }, locale, user, overrideAccess: false }).then((r) => r.totalDocs),
    ),
  );
  return Object.fromEntries(CATEGORIES.map((c, i) => [c, counts[i]])) as Record<Category, number>;
}
