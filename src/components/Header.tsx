"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { href, stripLocale, switchLocale, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Navigation } from "@/payload-types";
import { lockScroll } from "./SmoothScroll";
import SearchModal from "./SearchModal";
import { ChevronDown, GlobeIcon, SearchIcon, UserIcon } from "./icons";

type Props = {
  locale: Locale;
  brand: string;
  localName: string;
  items: NonNullable<Navigation["items"]>;
  user: { name: string; isStaff: boolean } | null;
  t: Pick<Dictionary, "mainNav" | "openMenu" | "closeMenu" | "switchTo" | "switchToShort" | "search" | "auth">;
};

export default function Header({ locale, brand, localName, items, user, t }: Props) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const other: Locale = locale === "fa" ? "en" : "fa";
  const current = stripLocale(pathname);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the drawer on navigation.
  useEffect(() => setOpen(false), [pathname]);

  // Ctrl/Cmd + K opens search from anywhere.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(false);
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // While the drawer is open: freeze the page, close on Esc, close if resized to desktop.
  useEffect(() => {
    if (!open) return;
    lockScroll(true);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const desktop = window.matchMedia("(min-width: 1280px)");
    const onDesktop = (e: MediaQueryListEvent) => e.matches && setOpen(false);
    window.addEventListener("keydown", onKey);
    desktop.addEventListener("change", onDesktop);
    return () => {
      lockScroll(false);
      window.removeEventListener("keydown", onKey);
      desktop.removeEventListener("change", onDesktop);
    };
  }, [open]);

  const isActive = (path: string) => (path === "/" ? current === "/" : current === path || current.startsWith(`${path}/`));
  const accountHref = href(locale, user ? "/account" : "/login");
  const accountLabel = user ? t.auth.account : t.auth.login;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled || open ? "header-solid py-3" : "border-b border-transparent py-5"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 md:px-8">
        <Link href={href(locale, "/")} className="group flex shrink-0 items-center gap-3" aria-label={localName}>
          <span className="spin-slow relative grid h-9 w-9 place-items-center rounded-full bg-[repeating-radial-gradient(circle,#18181d_0_2px,#0b0b0e_2px_4px)] ring-1 ring-white/10">
            <span className="h-3.5 w-3.5 rounded-full bg-gradient-to-br from-cyan to-neon" />
            <span className="absolute h-1 w-1 rounded-full bg-ink" />
          </span>
          <span className="font-display text-2xl text-white" dir="ltr">
            {brand}
          </span>
        </Link>

        <nav aria-label={t.mainNav} className="hidden xl:block">
          <ul className="flex items-center gap-0.5">
            {items.map((item) => {
              const active = isActive(item.href);
              const kids = item.children ?? [];
              return (
                <li key={item.href} className="group relative">
                  <Link
                    href={href(locale, item.href)}
                    aria-current={active ? "page" : undefined}
                    aria-haspopup={kids.length ? "true" : undefined}
                    title={item.short ? item.label : undefined}
                    className={`relative flex items-center gap-1 rounded-full px-3 py-2 text-[13px] transition-colors ${
                      active ? "text-white" : "text-white/60 hover:text-white"
                    }`}
                  >
                    {item.short || item.label}
                    {kids.length > 0 && <ChevronDown className="h-3.5 w-3.5 opacity-60 transition group-hover:rotate-180" />}
                    {active && <span className="absolute inset-x-3 -bottom-0.5 h-px bg-gradient-to-l from-cyan to-neon" />}
                  </Link>
                  {kids.length > 0 && (
                    <div className="invisible absolute top-full start-0 z-10 pt-3 opacity-0 transition duration-200 group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
                      <ul className="w-72 rounded-2xl border border-white/10 bg-ink-2/95 p-2 shadow-[0_24px_60px_rgba(0,0,0,.55)] backdrop-blur-xl">
                        {kids.map((c) => (
                          <li key={c.href}>
                            <Link
                              href={href(locale, c.href)}
                              className={`block rounded-xl px-4 py-3 transition hover:bg-white/5 ${isActive(c.href) ? "bg-white/5" : ""}`}
                            >
                              <span className="block text-sm font-bold text-white">{c.label}</span>
                              {c.description && <span className="mt-0.5 block text-xs text-white/50">{c.description}</span>}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            className="grid h-10 w-10 place-items-center rounded-full text-white/75 ring-1 ring-white/15 transition hover:text-white hover:ring-white/30"
            aria-label={t.search.open}
            title={`${t.search.open} (${t.search.shortcut})`}
          >
            <SearchIcon className="h-[18px] w-[18px]" />
          </button>
          <Link
            href={switchLocale(pathname, other)}
            hrefLang={other}
            lang={other}
            className="hidden h-10 items-center gap-1.5 rounded-full px-3 text-xs font-bold text-white/75 ring-1 ring-white/15 transition hover:text-white hover:ring-white/30 sm:flex"
            title={t.switchTo}
          >
            <GlobeIcon className="h-4 w-4" />
            <span dir="ltr">{t.switchToShort}</span>
          </Link>
          <Link
            href={accountHref}
            className="hidden h-10 items-center gap-2 rounded-full bg-white/5 px-4 text-xs font-bold text-white ring-1 ring-white/15 transition hover:bg-white/10 sm:flex"
          >
            <UserIcon className="h-4 w-4" />
            {accountLabel}
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="relative z-10 grid h-10 w-10 place-items-center rounded-full ring-1 ring-white/15 xl:hidden"
            aria-label={open ? t.closeMenu : t.openMenu}
            aria-expanded={open}
            aria-controls="mobile-menu"
          >
            <span className={`absolute h-0.5 w-5 bg-white transition ${open ? "rotate-45" : "-translate-y-1.5"}`} />
            <span className={`absolute h-0.5 w-5 bg-white transition ${open ? "opacity-0" : ""}`} />
            <span className={`absolute h-0.5 w-5 bg-white transition ${open ? "-rotate-45" : "translate-y-1.5"}`} />
          </button>
        </div>
      </div>

      {/* Mobile / tablet drawer */}
      <div
        id="mobile-menu"
        data-lenis-prevent
        inert={!open}
        className={`fixed inset-x-0 top-[64px] h-[calc(100dvh-64px)] overflow-y-auto bg-ink/95 backdrop-blur-xl transition-all duration-500 xl:hidden ${
          open ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
        <ul className="flex flex-col gap-1 px-6 py-8">
          {items.map((item, i) => {
            const kids = item.children ?? [];
            const style = { transitionDelay: open ? `${i * 50}ms` : "0ms" };
            const cls = `transition-all duration-500 ${open ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`;
            const linkCls = (path: string) => `block py-4 text-xl ${isActive(path) ? "text-gradient font-bold" : "text-white/80"}`;
            return (
              <li key={item.href} style={style} className={`${cls} border-b border-white/5`}>
                {kids.length ? (
                  <details className="group/sub" open={isActive(item.href)}>
                    <summary className={`flex cursor-pointer list-none items-center justify-between ${linkCls(item.href)}`}>
                      {item.label}
                      <ChevronDown className="h-5 w-5 transition group-open/sub:rotate-180" />
                    </summary>
                    <ul className="mb-3 grid grid-cols-2 gap-2">
                      {kids.map((c) => (
                        <li key={c.href}>
                          <Link
                            href={href(locale, c.href)}
                            onClick={() => setOpen(false)}
                            className={`block rounded-xl bg-white/5 px-3 py-3 text-sm ${isActive(c.href) ? "text-white ring-1 ring-neon/50" : "text-white/75"}`}
                          >
                            {c.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </details>
                ) : (
                  <Link href={href(locale, item.href)} onClick={() => setOpen(false)} aria-current={isActive(item.href) ? "page" : undefined} className={linkCls(item.href)}>
                    {item.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
        <div className="grid grid-cols-2 gap-3 px-6 pb-10">
          <Link href={accountHref} onClick={() => setOpen(false)} className="btn-neon">
            <UserIcon className="h-4 w-4" />
            {accountLabel}
          </Link>
          <Link href={switchLocale(pathname, other)} hrefLang={other} lang={other} className="btn-ghost">
            <GlobeIcon className="h-4 w-4" />
            {t.switchTo}
          </Link>
        </div>
      </div>

      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} locale={locale} t={t.search} />
    </header>
  );
}
