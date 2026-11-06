import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import "vazirmatn/Vazirmatn-Variable-font-face.css";
import "@fontsource/bebas-neue";
import "lenis/dist/lenis.css";
import "../globals.css";
import Header from "@/components/Header";
import SmoothScroll from "@/components/SmoothScroll";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ChatWidget";
import { dirOf, isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getCurrentUser, getGlobal } from "@/lib/cms";
import { siteUrl } from "@/lib/seo";
import { MOTION_GATE_SCRIPT } from "@/lib/motion";
import { isStaffUser } from "@/payload/access";

// Content comes from the CMS and can change at any time, and the header shows the login state.
export const dynamic = "force-dynamic";

type Params = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const [settings, t] = [await getGlobal("settings", locale), getDictionary(locale)];
  return {
    metadataBase: new URL(siteUrl()),
    title: { default: `${settings.brandName} | ${t.siteTagline}`, template: `%s | ${settings.nameLocal}` },
    description: settings.description,
    openGraph: {
      type: "website",
      locale: locale === "fa" ? "fa_IR" : "en_US",
      siteName: settings.brandName,
      description: settings.description,
    },
  };
}

export const viewport: Viewport = { themeColor: "#07070a", colorScheme: "dark" };

export default async function LocaleLayout({ children, params }: Params & { children: React.ReactNode }) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale: Locale = raw;
  const t = getDictionary(locale);

  const [settings, nav, chat, contactPage, user] = await Promise.all([
    getGlobal("settings", locale),
    getGlobal("navigation", locale),
    getGlobal("chat-settings", locale),
    getGlobal("contact-page", locale),
    getCurrentUser(),
  ]);

  return (
    // suppressHydrationWarning: the inline gate script adds the `js` class before React hydrates.
    <html lang={locale} dir={dirOf(locale)} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: MOTION_GATE_SCRIPT }} />
      </head>
      <body>
        <SmoothScroll>
          <Header
            locale={locale}
            brand={settings.brandName}
            localName={settings.nameLocal}
            items={nav.items ?? []}
            user={user ? { name: user.name, isStaff: isStaffUser(user) } : null}
            t={t}
          />
          <main>{children}</main>
          <Footer locale={locale} settings={settings} nav={nav} channels={contactPage.channels} t={t} />
          <ChatWidget
            locale={locale}
            chat={chat}
            contact={{ telegram: settings.telegram ?? "", whatsapp: settings.whatsapp ?? "" }}
            listStyle={locale === "fa" ? "persian" : "decimal"}
          />
        </SmoothScroll>
      </body>
    </html>
  );
}
