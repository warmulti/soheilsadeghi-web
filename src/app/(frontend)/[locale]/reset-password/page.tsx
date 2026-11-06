import type { Metadata } from "next";
import { notFound } from "next/navigation";
import AuthShell from "@/components/auth/AuthShell";
import { ResetForm } from "@/components/auth/AuthForms";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";

type Props = { params: Promise<{ locale: string }>; searchParams: Promise<{ token?: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale) ? { title: getDictionary(locale).auth.resetTitle, robots: { index: false } } : {};
}

export default async function ResetPasswordPage({ params, searchParams }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const { token = "" } = await searchParams;
  const t = getDictionary(locale).auth;
  return (
    <AuthShell title={t.resetTitle}>
      {token ? <ResetForm locale={locale} t={t} token={token} /> : <p className="text-sm text-rose-200">{t.errors.token}</p>}
    </AuthShell>
  );
}
