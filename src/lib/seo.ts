import type { Metadata } from "next";
import { href, type Locale } from "@/i18n/config";

/** Public site address, e.g. https://soheilsadeghi.com (from SERVER_URL). */
export const siteUrl = () => (process.env.SERVER_URL || "http://localhost:3000").replace(/\/$/, "");

/** Canonical URL + hreflang alternates for a page that exists in both languages. */
export function alternates(locale: Locale, path: string): Metadata["alternates"] {
  return {
    canonical: href(locale, path),
    languages: { fa: href("fa", path), en: href("en", path), "x-default": href("fa", path) },
  };
}

export function pageMeta(locale: Locale, path: string, title: string, description?: string | null): Metadata {
  return { title, description: description ?? undefined, alternates: alternates(locale, path) };
}
