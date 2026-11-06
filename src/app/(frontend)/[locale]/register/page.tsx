import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import AuthShell from "@/components/auth/AuthShell";
import { RegisterForm } from "@/components/auth/AuthForms";
import { href, isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getCurrentUser } from "@/lib/cms";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale) ? { title: getDictionary(locale).auth.registerTitle, robots: { index: false } } : {};
}

export default async function RegisterPage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  if (await getCurrentUser()) redirect(href(locale, "/account"));
  const t = getDictionary(locale).auth;
  return (
    <AuthShell title={t.registerTitle} lead={t.registerLead}>
      <RegisterForm locale={locale} t={t} />
    </AuthShell>
  );
}
