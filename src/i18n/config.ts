/**
 * Site languages. Persian is the default and lives at the root URL (/courses/djing);
 * English lives under /en (/en/courses/djing). `proxy.ts` rewrites unprefixed URLs to /fa/…
 */
export const locales = ["fa", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "fa";

export const isLocale = (value: string | undefined): value is Locale =>
  !!value && (locales as readonly string[]).includes(value);

export const dirOf = (locale: Locale) => (locale === "fa" ? "rtl" : "ltr");

/** Locale-aware internal link: href("en", "/contact") → "/en/contact"; external links pass through. */
export function href(locale: Locale, path: string): string {
  if (!path.startsWith("/") || path.startsWith("//")) return path;
  if (locale === defaultLocale) return path;
  return path === "/" ? `/${locale}` : `/${locale}${path}`;
}

/** Strips a locale prefix from a browser pathname: "/en/contact" → "/contact". */
export function stripLocale(pathname: string): string {
  for (const l of locales) {
    if (pathname === `/${l}`) return "/";
    if (pathname.startsWith(`/${l}/`)) return pathname.slice(l.length + 1);
  }
  return pathname;
}

/** Same page in another language. */
export const switchLocale = (pathname: string, target: Locale) => href(target, stripLocale(pathname));

/** Persian or Latin digits depending on locale. */
export function fmtNum(value: number | string, locale: Locale): string {
  const s = String(value);
  return locale === "fa" ? s.replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[Number(d)]) : s;
}
