"use client";

import Link from "next/link";
import { useActionState } from "react";
import { href, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { forgotAction, loginAction, registerAction, resetAction, type AuthState } from "@/lib/auth-actions";

type T = Dictionary["auth"];

function Field({
  name,
  label,
  type = "text",
  autoComplete,
  hint,
  required = true,
  dir,
  state,
}: {
  name: string;
  label: string;
  type?: string;
  autoComplete?: string;
  hint?: string;
  required?: boolean;
  dir?: "ltr";
  state?: AuthState;
}) {
  return (
    <div>
      <label htmlFor={`auth-${name}`} className="mb-2 block text-sm text-white/70">
        {label} {required && <span className="text-neon">*</span>}
      </label>
      <input
        id={`auth-${name}`}
        name={name}
        type={type}
        autoComplete={autoComplete}
        required={required}
        minLength={type === "password" ? 8 : undefined}
        dir={dir}
        // React resets forms after an action; the default comes back from the server so input survives errors.
        defaultValue={type === "password" ? undefined : state?.values?.[name]}
        key={type === "password" ? undefined : `${name}-${state?.values?.[name] ?? ""}`}
        className="field"
      />
      {hint && <p className="mt-1.5 text-xs text-white/40">{hint}</p>}
    </div>
  );
}

function ErrorBox({ state, t }: { state: AuthState; t: T }) {
  if (!state.error) return null;
  return (
    <p role="alert" className="rounded-xl border border-rose-400/30 bg-rose-400/10 px-4 py-3 text-sm text-rose-100">
      {t.errors[state.error]}
    </p>
  );
}

function Submit({ pending, label, t }: { pending: boolean; label: string; t: T }) {
  return (
    <button type="submit" disabled={pending} className="btn-neon w-full disabled:opacity-60">
      {pending ? t.working : label}
    </button>
  );
}

export function LoginForm({ locale, t, next }: { locale: Locale; t: T; next?: string }) {
  const [state, action, pending] = useActionState(loginAction, {});
  return (
    <form action={action} className="grid gap-5">
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="next" value={next ?? ""} />
      <Field name="email" label={t.email} type="email" autoComplete="email" dir="ltr" state={state} />
      <Field name="password" label={t.password} type="password" autoComplete="current-password" />
      <ErrorBox state={state} t={t} />
      <Submit pending={pending} label={t.submitLogin} t={t} />
      <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
        <Link href={href(locale, "/forgot-password")} className="text-white/55 hover:text-white">
          {t.forgot}
        </Link>
        <span className="text-white/45">
          {t.noAccount}{" "}
          <Link href={href(locale, "/register")} className="font-bold text-neon hover:underline">
            {t.register}
          </Link>
        </span>
      </div>
    </form>
  );
}

export function RegisterForm({ locale, t }: { locale: Locale; t: T }) {
  const [state, action, pending] = useActionState(registerAction, {});
  return (
    <form action={action} className="grid gap-5">
      <input type="hidden" name="locale" value={locale} />
      <Field name="name" label={t.name} autoComplete="name" state={state} />
      <Field name="email" label={t.email} type="email" autoComplete="email" dir="ltr" state={state} />
      <Field name="password" label={t.password} type="password" autoComplete="new-password" hint={t.passwordHint} />
      <Field name="phone" label={t.phone} type="tel" autoComplete="tel" required={false} dir="ltr" state={state} />
      <ErrorBox state={state} t={t} />
      <Submit pending={pending} label={t.submitRegister} t={t} />
      <p className="text-center text-sm text-white/45">
        {t.haveAccount}{" "}
        <Link href={href(locale, "/login")} className="font-bold text-neon hover:underline">
          {t.login}
        </Link>
      </p>
    </form>
  );
}

export function ForgotForm({ locale, t }: { locale: Locale; t: T }) {
  const [state, action, pending] = useActionState(forgotAction, {});
  if (state.done) {
    return (
      <p role="status" className="rounded-xl border border-cyan/30 bg-cyan/10 px-4 py-4 text-sm leading-7 text-cyan-50">
        {t.forgotSent}
      </p>
    );
  }
  return (
    <form action={action} className="grid gap-5">
      <input type="hidden" name="locale" value={locale} />
      <Field name="email" label={t.email} type="email" autoComplete="email" dir="ltr" />
      <ErrorBox state={state} t={t} />
      <Submit pending={pending} label={t.forgotSubmit} t={t} />
    </form>
  );
}

export function ResetForm({ locale, t, token }: { locale: Locale; t: T; token: string }) {
  const [state, action, pending] = useActionState(resetAction, {});
  return (
    <form action={action} className="grid gap-5">
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="token" value={token} />
      <Field name="password" label={t.password} type="password" autoComplete="new-password" hint={t.passwordHint} />
      <ErrorBox state={state} t={t} />
      <Submit pending={pending} label={t.resetSubmit} t={t} />
    </form>
  );
}
