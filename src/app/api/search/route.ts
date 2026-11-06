import { NextResponse } from "next/server";
import { getPayload } from "payload";
import config from "@payload-config";
import { defaultLocale, isLocale } from "@/i18n/config";
import { siteSearch } from "@/lib/search";
import type { User } from "@/payload-types";
import { clientIp, rateLimit } from "@/lib/rate-limit";

/** GET /api/search?q=…&locale=fa|en — used by the header search box. */
export async function GET(req: Request) {
  if (!rateLimit(`search:${clientIp(req)}`, 60, 60_000)) return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  const url = new URL(req.url);
  const q = (url.searchParams.get("q") ?? "").slice(0, 80);
  const loc = url.searchParams.get("locale") ?? undefined;
  const locale = isLocale(loc) ? loc : defaultLocale;
  const payload = await getPayload({ config });
  const { user } = await payload.auth({ headers: req.headers });
  const results = await siteSearch(payload, q, locale, (user as User | null) ?? null, 8);
  return NextResponse.json({ results });
}
