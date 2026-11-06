import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import AuthShell from "@/components/auth/AuthShell";
import { href, isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getPayloadClient } from "@/lib/cms";

type Props = { params: Promise<{ locale: string }>; searchParams: Promise<{ token?: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale) ? { title: getDictionary(locale).auth.verifyOkTitle, robots: { index: false } } : {};
}

/** Target of the link in the sign-up email: confirms the address, then points to the login form. */
export default async function VerifyEmailPage({ params, searchParams }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const { token = "" } = await searchParams;
  const t = getDictionary(locale).auth;

  let verified = false;
  if (/^[a-f0-9]{20,128}$/i.test(token)) {
    try {
      const payload = await getPayloadClient();
      verified = await payload.verifyEmail({ collection: "users", token });
    } catch {
      verified = false; // unknown or already used token
    }
  }

  return (
    <AuthShell title={verified ? t.verifyOkTitle : t.verifyFailTitle} lead={verified ? t.verifyOkLead : t.verifyFailLead}>
      <Link href={href(locale, "/login")} className="btn-neon w-full">
        {t.login}
      </Link>
    </AuthShell>
  );
}
