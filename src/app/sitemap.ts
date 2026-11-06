import type { MetadataRoute } from "next";
import { getPayload } from "payload";
import config from "@payload-config";
import { href, locales } from "@/i18n/config";
import { siteUrl } from "@/lib/seo";

export const dynamic = "force-dynamic";

const STATIC = ["/", "/courses/djing", "/courses/ableton", "/buying-guide", "/biography", "/contact", "/downloads", ...["mashups", "podcasts", "tracks", "software", "plugins"].map((c) => `/downloads/${c}`)];

/** /sitemap.xml — every public page in both languages, with hreflang alternates. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();
  const entry = (path: string, lastModified?: string | null): MetadataRoute.Sitemap[number][] =>
    locales.map((l) => ({
      url: `${base}${href(l, path)}`,
      lastModified: lastModified ? new Date(lastModified) : undefined,
      alternates: { languages: Object.fromEntries(locales.map((x) => [x, `${base}${href(x, path)}`])) },
    }));

  const payload = await getPayload({ config });
  const [downloads, pages] = await Promise.all([
    // Anonymous view: only what search engines may see.
    payload.find({ collection: "downloads", overrideAccess: false, depth: 0, limit: 2000, pagination: false }),
    payload.find({ collection: "pages", overrideAccess: false, depth: 0, limit: 500, pagination: false }),
  ]);

  return [
    ...STATIC.flatMap((p) => entry(p)),
    ...downloads.docs.flatMap((d) => entry(`/downloads/${d.category}/${d.slug}`, d.updatedAt)),
    ...pages.docs.flatMap((p) => entry(`/${p.slug}`, p.updatedAt)),
  ];
}
