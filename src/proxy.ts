import { NextResponse, type NextRequest } from "next/server";

/**
 * Language routing:
 *   /             → Persian (internally /fa)
 *   /en/…         → English
 *   /fa/…         → redirected to the unprefixed URL, so every page has one canonical address
 *   /admin/…      → untouched, except that the panel opens in Persian until someone picks English
 * API, Next internals and files (anything with a dot) are left alone by the matcher.
 */
const ADMIN_LANG_COOKIE = "payload-lng";

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    if (request.cookies.has(ADMIN_LANG_COOKIE)) return NextResponse.next();
    // Payload otherwise follows the browser's language (often English even for Persian speakers).
    const headers = new Headers(request.headers);
    headers.set("accept-language", "fa");
    const response = NextResponse.next({ request: { headers } });
    response.cookies.set(ADMIN_LANG_COOKIE, "fa", { path: "/", maxAge: 60 * 60 * 24 * 365, sameSite: "lax" });
    return response;
  }

  if (pathname === "/fa" || pathname.startsWith("/fa/")) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.slice(3) || "/";
    return NextResponse.redirect(url, 308);
  }

  // Tell server components which language this request is in (used by the 404 page).
  const headers = new Headers(request.headers);

  if (pathname === "/en" || pathname.startsWith("/en/")) {
    headers.set("x-locale", "en");
    return NextResponse.next({ request: { headers } });
  }

  headers.set("x-locale", "fa");
  const url = request.nextUrl.clone();
  url.pathname = `/fa${pathname === "/" ? "" : pathname}`;
  url.search = search;
  return NextResponse.rewrite(url, { request: { headers } });
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
