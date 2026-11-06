"use client";

import { useTranslation } from "@payloadcms/ui";

/** فارسی ⇄ English switch for the admin panel. The choice is remembered in the `payload-lng` cookie. */
export function LanguageToggle() {
  const { i18n, switchLanguage } = useTranslation();
  const next = i18n.language === "fa" ? "en" : "fa";
  return (
    <button
      type="button"
      className="dj-lang-toggle"
      lang={next}
      dir={next === "fa" ? "rtl" : "ltr"}
      title={next === "fa" ? "نمایش پنل به فارسی" : "Show the panel in English"}
      onClick={() => void switchLanguage?.(next)}
    >
      <span aria-hidden="true">🌐</span> {next === "fa" ? "فارسی" : "English"}
    </button>
  );
}

/** Same switch above the login form, so the panel can be read in either language from the first screen. */
export function LoginLanguageToggle() {
  return (
    <div className="dj-lang-login">
      <LanguageToggle />
    </div>
  );
}
