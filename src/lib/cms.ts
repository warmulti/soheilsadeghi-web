/**
 * Server-side access to the CMS (Payload Local API — in-process, no HTTP round-trip).
 * Everything is wrapped in React `cache`, so each global is read once per request.
 */
import { cache } from "react";
import { headers } from "next/headers";
import { getPayload } from "payload";
import config from "@payload-config";
import type { Config, Media, User } from "@/payload-types";
import type { Locale } from "@/i18n/config";

export const getPayloadClient = cache(() => getPayload({ config }));

type Globals = Config["globals"];
export type GlobalKey = keyof Globals;

export const getGlobal = cache(async <S extends GlobalKey>(slug: S, locale: Locale): Promise<Globals[S]> => {
  const payload = await getPayloadClient();
  return (await payload.findGlobal({ slug, locale, depth: 1 })) as Globals[S];
});

/** The visitor's account (student / editor / admin) from the Payload auth cookie, or null. */
export const getCurrentUser = cache(async (): Promise<User | null> => {
  const payload = await getPayloadClient();
  const { user } = await payload.auth({ headers: await headers() });
  return (user as User | null) ?? null;
});

/** URL of an upload field value (populated object or id). */
export function mediaUrl(value: number | Media | null | undefined, size?: "thumb" | "card"): string | undefined {
  if (!value || typeof value !== "object") return undefined;
  const sized = size ? value.sizes?.[size]?.url : undefined;
  return sized || value.url || undefined;
}
