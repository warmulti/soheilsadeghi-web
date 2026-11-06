/**
 * Site emails: account confirmation, password reset and notifications for Soheil.
 * Sent through the SMTP server in SMTP_HOST (on the production server: the local Postfix).
 * Imported by the Payload config (relative .ts imports only) and by Next code.
 */
import type { Payload, PayloadRequest } from "payload";
import { href, isLocale, type Locale } from "../i18n/config.ts";

export const siteUrl = () => (process.env.SERVER_URL || "http://localhost:3000").replace(/\/$/, "");

/** True when a real mail server is configured. Without it, accounts skip email confirmation. */
export const mailEnabled = () => Boolean(process.env.SMTP_HOST);

/** Where notifications for Soheil go (new students, booking requests). */
export const notifyAddress = () => process.env.NOTIFY_EMAIL || process.env.ADMIN_EMAIL || "";

/** The visitor's site language, passed to Payload operations as `context.siteLocale`. */
export function localeOfReq(req?: Partial<PayloadRequest>): Locale {
  const l = (req?.context as { siteLocale?: string } | undefined)?.siteLocale;
  return isLocale(l) ? l : "fa";
}

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] as string);

type Email = {
  title: string;
  paragraphs: string[];
  button?: { label: string; url: string };
  /** Small grey line under the button. */
  note?: string;
};

const fallbackLine = { fa: "اگر دکمه کار نکرد، این آدرس را در مرورگر باز کنید:", en: "If the button doesn't work, open this address:" };

/** Branded, table-based HTML that renders the same in Gmail, Outlook and phone mail apps. */
export function renderEmail(locale: Locale, email: Email): string {
  const rtl = locale === "fa";
  const align = rtl ? "right" : "left";
  const font = rtl ? "Vazirmatn,Tahoma,Arial,sans-serif" : "Arial,Helvetica,sans-serif";
  const p = (text: string) => `<p style="margin:0 0 14px">${esc(text)}</p>`;
  const button = email.button
    ? `<p style="margin:22px 0 10px"><a href="${esc(email.button.url)}" style="display:inline-block;padding:13px 28px;border-radius:999px;background:#22d3ee;color:#07070a;font-weight:bold;text-decoration:none">${esc(email.button.label)}</a></p>
       <p style="margin:0 0 14px;font-size:12px;color:#8b8b9e">${fallbackLine[locale]}<br><a href="${esc(email.button.url)}" dir="ltr" style="color:#67e8f9;word-break:break-all">${esc(email.button.url)}</a></p>`
    : "";
  const note = email.note ? `<p style="margin:18px 0 0;font-size:12px;color:#8b8b9e">${esc(email.note)}</p>` : "";

  return `<!doctype html>
<html lang="${locale}" dir="${rtl ? "rtl" : "ltr"}">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(email.title)}</title></head>
<body style="margin:0;padding:0;background:#07070a">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#07070a;padding:28px 12px">
<tr><td align="center">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:540px;background:#111118;border:1px solid #2b2b3a;border-radius:18px">
    <tr><td style="padding:26px 28px 0;font:bold 22px/1 Arial,sans-serif;letter-spacing:3px;color:#22d3ee;text-align:${align}" dir="ltr">DJ SOHEIL</td></tr>
    <tr><td dir="${rtl ? "rtl" : "ltr"}" style="padding:18px 28px 28px;font-family:${font};font-size:15px;line-height:1.9;color:#e4e4ee;text-align:${align}">
      <h1 style="margin:0 0 14px;font-size:19px;line-height:1.6;color:#ffffff">${esc(email.title)}</h1>
      ${email.paragraphs.map(p).join("")}
      ${button}
      ${note}
    </td></tr>
  </table>
  <p style="margin:16px 0 0;font:12px Arial,sans-serif;color:#5c5c70"><a href="${siteUrl()}" style="color:#5c5c70;text-decoration:none">soheilsadeghi.com</a></p>
</td></tr>
</table>
</body>
</html>`;
}

const pageUrl = (locale: Locale, path: string, token: string) =>
  `${siteUrl()}${href(locale, path)}?token=${encodeURIComponent(token)}`;

export function verificationEmail(locale: Locale, token: string, name?: string | null) {
  const url = pageUrl(locale, "/verify-email", token);
  return locale === "fa"
    ? {
        subject: "تأیید ایمیل حساب | DJ Soheil",
        html: renderEmail("fa", {
          title: name ? `${name} عزیز، خوش آمدید!` : "خوش آمدید!",
          paragraphs: ["حساب هنرجویی شما در سایت DJ Soheil ساخته شد. برای فعال شدن حساب، ایمیل خود را تأیید کنید."],
          button: { label: "تأیید ایمیل", url },
          note: "اگر شما در سایت ثبت‌نام نکرده‌اید، این ایمیل را نادیده بگیرید.",
        }),
      }
    : {
        subject: "Confirm your email | DJ Soheil",
        html: renderEmail("en", {
          title: name ? `Welcome, ${name}!` : "Welcome!",
          paragraphs: ["Your DJ Soheil student account has been created. Please confirm your email to activate it."],
          button: { label: "Confirm email", url },
          note: "If you didn't sign up on the site, you can ignore this email.",
        }),
      };
}

export function resetPasswordEmail(locale: Locale, token: string) {
  const url = pageUrl(locale, "/reset-password", token);
  return locale === "fa"
    ? {
        subject: "بازیابی رمز عبور | DJ Soheil",
        html: renderEmail("fa", {
          title: "تعیین رمز عبور جدید",
          paragraphs: ["درخواست تغییر رمز عبور حساب شما در سایت DJ Soheil ثبت شد. این لینک تا یک ساعت معتبر است."],
          button: { label: "تعیین رمز جدید", url },
          note: "اگر این درخواست را شما نداده‌اید، این ایمیل را نادیده بگیرید؛ رمز فعلی‌تان تغییر نمی‌کند.",
        }),
      }
    : {
        subject: "Reset your password | DJ Soheil",
        html: renderEmail("en", {
          title: "Set a new password",
          paragraphs: ["Someone asked to reset the password of your DJ Soheil account. This link works for one hour."],
          button: { label: "Set new password", url },
          note: "If you didn't ask for this, ignore this email — your current password stays the same.",
        }),
      };
}

/**
 * Notification for Soheil (Persian). Never throws: a mail problem must not break the visitor's action.
 */
export async function notifyOwner(
  payload: Payload,
  message: { subject: string; title: string; lines: string[]; button?: Email["button"]; replyTo?: string },
): Promise<boolean> {
  const to = notifyAddress();
  if (!mailEnabled() || !to) return false;
  try {
    await payload.sendEmail({
      to,
      subject: message.subject,
      replyTo: message.replyTo,
      html: renderEmail("fa", { title: message.title, paragraphs: message.lines, button: message.button }),
    });
    return true;
  } catch (err) {
    payload.logger.error({ err }, "[email] owner notification failed");
    return false;
  }
}
