import type { Metadata } from "next";
import { notFound } from "next/navigation";
import HomeExperience from "@/components/home/HomeExperience";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getGlobal, mediaUrl } from "@/lib/cms";
import { alternates } from "@/lib/seo";

type Params = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale) ? { alternates: alternates(locale, "/") } : {};
}

export default async function HomePage({ params }: Params) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const [home, settings] = await Promise.all([getGlobal("home", locale), getGlobal("settings", locale)]);
  const t = getDictionary(locale);

  return (
    <HomeExperience
      locale={locale}
      home={home}
      settings={settings}
      photo={{
        src: mediaUrl(settings.photo) ?? "/images/soheil.webp",
        alt: settings.photoAlt ?? settings.nameLocal,
        eyeLine: settings.photoEyeLine ?? 0.47,
      }}
      t={t}
    />
  );
}
