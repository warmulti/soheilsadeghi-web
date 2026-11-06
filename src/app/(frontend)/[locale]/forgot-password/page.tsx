import type { Metadata } from "next";
import { notFound } from "next/navigation";
import AuthShell from "@/components/auth/AuthShell";
import { ForgotForm } from "@/components/auth/AuthForms";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale) ? { title: getDictionary(locale).auth.forgotTitle, robots: { index: false } } : {};
}

export default async function ForgotPasswordPage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale).auth;
  return (
    <AuthShell title={t.forgotTitle} lead={t.forgotLead}>
      <ForgotForm locale={locale} t={t} />
    </AuthShell>
  );
}
