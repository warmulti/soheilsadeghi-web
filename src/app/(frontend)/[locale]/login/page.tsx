import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import AuthShell from "@/components/auth/AuthShell";
import { LoginForm } from "@/components/auth/AuthForms";
import { href, isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getCurrentUser } from "@/lib/cms";

type Props = { params: Promise<{ locale: string }>; searchParams: Promise<{ next?: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale) ? { title: getDictionary(locale).auth.loginTitle, robots: { index: false } } : {};
}

export default async function LoginPage({ params, searchParams }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const { next } = await searchParams;
  if (await getCurrentUser()) redirect(next && next.startsWith("/") && !next.startsWith("//") ? next : href(locale, "/account"));
  const t = getDictionary(locale).auth;
  return (
    <AuthShell title={t.loginTitle} lead={t.loginLead}>
      <LoginForm locale={locale} t={t} next={next} />
    </AuthShell>
  );
}
