"use server";

import { redirect } from "next/navigation";
import { getPayload, UnverifiedEmail, type Payload } from "payload";
import config from "@payload-config";
import { login, logout } from "@payloadcms/next/auth";
import { href, isLocale, type Locale } from "@/i18n/config";
import { mailEnabled, notifyOwner, siteUrl, verificationEmail } from "@/payload/email";
import { notifyOwnerSms } from "@/lib/sms";
import { rateLimit } from "@/lib/rate-limit";

export type AuthErrorCode =
  | "invalid"
  | "locked"
  | "exists"
  | "weak"
  | "required"
  | "token"
  | "notReady"
  | "unverified"
  | "generic";
/** `values` echoes back what the visitor typed (never passwords), so a failed attempt keeps the form filled. */
export type AuthState = { error?: AuthErrorCode; done?: boolean; values?: Record<string, string> };

const str = (form: FormData, key: string) => String(form.get(key) ?? "").trim();
const localeOf = (form: FormData): Locale => {
  const l = str(form, "locale");
  return isLocale(l) ? l : "fa";
};
/** Only same-site paths are allowed as a post-login destination. */
const safeNext = (next: string, locale: Locale) => (next.startsWith("/") && !next.startsWith("//") ? next : href(locale, "/account"));

export async function loginAction(_prev: AuthState, form: FormData): Promise<AuthState> {
  const locale = localeOf(form);
  const email = str(form, "email").toLowerCase();
  const password = String(form.get("password") ?? "");
  const values = { email };
  if (!email || !password) return { error: "required", values };
  try {
    await login({ collection: "users", config, email, password });
  } catch (err) {
    if (err instanceof UnverifiedEmail || (err as Error)?.name === "UnverifiedEmail") {
      // Right password, email not confirmed yet: send the confirmation link again (at most every 10 minutes).
      await resendVerification(email, locale);
      return { error: "unverified", values };
    }
    const msg = err instanceof Error ? err.message : "";
    return { error: /lock/i.test(msg) ? "locked" : "invalid", values };
  }
  redirect(safeNext(str(form, "next"), locale));
}

/** Re-sends the confirmation email of an unconfirmed account. Only called after a correct password. */
async function resendVerification(email: string, locale: Locale) {
  if (!mailEnabled() || !rateLimit(`verify-resend:${email}`, 1, 10 * 60_000)) return;
  try {
    const payload = await getPayload({ config });
    const { docs } = await payload.find({
      collection: "users",
      where: { email: { equals: email } },
      limit: 1,
      depth: 0,
      overrideAccess: true,
      showHiddenFields: true,
    });
    const user = docs[0] as { name?: string; _verified?: boolean | null; _verificationToken?: string | null } | undefined;
    if (!user || user._verified !== false || !user._verificationToken) return;
    const { subject, html } = verificationEmail(locale, user._verificationToken, user.name);
    await payload.sendEmail({ to: email, subject, html });
  } catch (err) {
    console.error("[auth] could not resend the confirmation email:", err);
  }
}

/** Tells Soheil a student signed up, so he can add them to their course group. */
async function notifyNewStudent(payload: Payload, user: { id: number | string }, values: Record<string, string>) {
  await notifyOwner(payload, {
    subject: `هنرجوی جدید: ${values.name}`,
    title: "یک هنرجوی جدید در سایت ثبت‌نام کرد",
    lines: [
      `نام: ${values.name}`,
      `ایمیل: ${values.email}`,
      ...(values.phone ? [`تلفن: ${values.phone}`] : []),
      "برای باز شدن محتوای دوره، او را در پنل به گروه کلاسش اضافه کنید.",
    ],
    button: { label: "باز کردن در پنل مدیریت", url: `${siteUrl()}/admin/collections/users/${user.id}` },
    replyTo: values.email,
  });
  await notifyOwnerSms(`هنرجوی جدید ثبت‌نام کرد:\n${values.name}\n${values.email}${values.phone ? `\n${values.phone}` : ""}`);
}

export async function registerAction(_prev: AuthState, form: FormData): Promise<AuthState> {
  const locale = localeOf(form);
  const name = str(form, "name").slice(0, 80);
  const email = str(form, "email").toLowerCase().slice(0, 120);
  const password = String(form.get("password") ?? "");
  const phone = str(form, "phone").slice(0, 40);
  const values = { name, email, phone };
  if (!name || !email || !password) return { error: "required", values };
  if (password.length < 8) return { error: "weak", values };

  const payload = await getPayload({ config });
  // Until the owner's admin account exists, public sign-up stays closed (the first account becomes admin).
  const { totalDocs } = await payload.count({ collection: "users", overrideAccess: true });
  if (totalDocs === 0) return { error: "notReady", values };

  // With a mail server the student confirms their email first; without one the account is ready at once.
  const confirmByEmail = mailEnabled();
  let user: { id: number | string };
  try {
    // overrideAccess:false applies the field rules: role/groups can't be set by the visitor.
    user = await payload.create({
      collection: "users",
      data: { name, email, password, phone, role: "student" },
      overrideAccess: false,
      context: { siteLocale: locale },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "";
    return { error: /email|unique|exist|already/i.test(msg) ? "exists" : "generic", values };
  }
  await notifyNewStudent(payload, user, values);

  if (confirmByEmail) return { done: true, values: { email } };
  try {
    await login({ collection: "users", config, email, password });
  } catch {
    redirect(href(locale, "/login"));
  }
  redirect(href(locale, "/account"));
}

export async function forgotAction(_prev: AuthState, form: FormData): Promise<AuthState> {
  const locale = localeOf(form);
  const email = str(form, "email").toLowerCase();
  if (!email) return { error: "required", values: { email } };
  // Same answer when rate-limited, so the form can't be used to flood someone's inbox.
  if (!rateLimit(`forgot:${email}`, 3, 60 * 60_000)) return { done: true };
  try {
    const payload = await getPayload({ config });
    await payload.forgotPassword({ collection: "users", data: { email }, context: { siteLocale: locale } });
  } catch {
    // Same answer whether or not the account exists (no account enumeration).
  }
  return { done: true };
}

export async function resetAction(_prev: AuthState, form: FormData): Promise<AuthState> {
  const locale = localeOf(form);
  const token = str(form, "token");
  const password = String(form.get("password") ?? "");
  if (!token || !password) return { error: "required" };
  if (password.length < 8) return { error: "weak" };
  let email: string | undefined;
  try {
    const payload = await getPayload({ config });
    const result = await payload.resetPassword({ collection: "users", data: { token, password }, overrideAccess: true });
    email = (result.user as { email?: string } | undefined)?.email;
  } catch {
    return { error: "token" };
  }
  if (email) {
    try {
      await login({ collection: "users", config, email, password });
    } catch {
      redirect(href(locale, "/login"));
    }
  }
  redirect(href(locale, "/account"));
}

export async function logoutAction(form: FormData) {
  const locale = localeOf(form);
  await logout({ config });
  redirect(href(locale, "/"));
}
