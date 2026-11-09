import type { Locale } from "@/i18n/config";
import type { Product, User } from "@/payload-types";
import { getPayloadClient } from "@/lib/cms";

/** Published products the visitor may see (draft items are hidden by the collection's read access). */
export async function findProducts(opts: { locale: Locale; user: User | null; limit?: number; page?: number }) {
  const payload = await getPayloadClient();
  return payload.find({
    collection: "products",
    locale: opts.locale,
    user: opts.user,
    overrideAccess: false,
    depth: 1,
    sort: ["order", "-publishedAt"],
    limit: opts.limit ?? 48,
    page: opts.page ?? 1,
  });
}

export async function findProduct(locale: Locale, user: User | null, slug: string): Promise<Product | null> {
  const payload = await getPayloadClient();
  const res = await payload.find({
    collection: "products",
    where: { slug: { equals: slug } },
    locale,
    user,
    overrideAccess: false,
    depth: 1,
    limit: 1,
  });
  return (res.docs[0] as Product | undefined) ?? null;
}
