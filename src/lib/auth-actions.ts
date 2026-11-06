"use server";

import { redirect } from "next/navigation";
import { getPayload } from "payload";
import config from "@payload-config";
import { login, logout } from "@payloadcms/next/auth";
import { href, isLocale, type Locale } from "@/i18n/config";

export type AuthErrorCode = "invalid" | "locked" | "exists" | "weak" | "required" | "token" | "notReady" | "generic";
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
    const msg = err instanceof Error ? err.message : "";
    return { error: /lock/i.test(msg) ? "locked" : "invalid", values };
  }
  redirect(safeNext(str(form, "next"), locale));
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

  try {
    // overrideAccess:false applies the field rules: role/groups can't be set by the visitor.
    await payload.create({ collection: "users", data: { name, email, password, phone, role: "student" }, overrideAccess: false });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "";
    return { error: /email|unique|exist|already/i.test(msg) ? "exists" : "generic", values };
  }
  try {
    await login({ collection: "users", config, email, password });
  } catch {
    redirect(href(locale, "/login"));
  }
  redirect(href(locale, "/account"));
}

export async function forgotAction(_prev: AuthState, form: FormData): Promise<AuthState> {
  const email = str(form, "email").toLowerCase();
  if (!email) return { error: "required", values: { email } };
  try {
    const payload = await getPayload({ config });
    await payload.forgotPassword({ collection: "users", data: { email } });
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
