import { NextResponse } from "next/server";
import { getPayload } from "payload";
import config from "@payload-config";
import { defaultLocale, isLocale, type Locale } from "@/i18n/config";
import { buildBookingMessage, parseBooking, serviceLabel, type ContactApiResponse } from "@/lib/booking";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { notifyOwner, siteUrl } from "@/payload/email";
import { notifyOwnerSms } from "@/lib/sms";

/**
 * Booking / consultation requests.
 * Every request is saved in the admin panel (Inbox → Contact requests). Soheil is also notified by
 * email (NOTIFY_EMAIL, when a mail server is set) and/or Telegram (TELEGRAM_BOT_TOKEN + TELEGRAM_CHAT_ID).
 */
export async function POST(req: Request) {
  if (!rateLimit(`contact:${clientIp(req)}`, 5, 10 * 60_000)) {
    return NextResponse.json<ContactApiResponse>({ error: "rate_limited" }, { status: 429 });
  }

  let body: Record<string, unknown> | null;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json<ContactApiResponse>({ error: "invalid_json" }, { status: 400 });
  }
  const locale: Locale = isLocale(body?.locale as string) ? (body!.locale as Locale) : defaultLocale;

  const payload = await getPayload({ config });
  const page = await payload.findGlobal({ slug: "contact-page", locale, depth: 0 });
  const form = page.form ?? {};
  const parsed = parseBooking(body, {
    services: (form.services ?? []).map((s) => s.serviceId),
    formats: form.formats ?? [],
  });
  if (!parsed.ok) {
    return NextResponse.json<ContactApiResponse>({ error: "invalid_field", field: parsed.field }, { status: 400 });
  }
  const d = parsed.data;

  let saved = false;
  try {
    await payload.create({
      collection: "requests",
      data: { ...d, service: serviceLabel(form, d.service), locale, status: "new" },
      overrideAccess: true,
    });
    saved = true;
  } catch (err) {
    console.error("[contact] could not save request:", err);
  }

  const message = buildBookingMessage(d, form);
  let delivered = await notifyOwner(payload, {
    subject: `درخواست جدید: ${serviceLabel(form, d.service)} — ${d.name}`,
    title: "درخواست جدید از فرم تماس سایت",
    lines: message.split("\n").filter((line) => line.trim()),
    button: { label: "دیدن درخواست‌ها در پنل", url: `${siteUrl()}/admin/collections/requests` },
    replyTo: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.contact) ? d.contact : undefined,
  });

  // SMS notification for Soheil (sms.ir), independent of email/Telegram.
  if (await notifyOwnerSms(`درخواست جدید سایت:\n${d.name}\n${serviceLabel(form, d.service)}\nتماس: ${d.contact}`)) {
    delivered = true;
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (token && chatId) {
    try {
      const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ chat_id: chatId, text: message, link_preview_options: { is_disabled: true } }),
        signal: AbortSignal.timeout(10_000),
      });
      if (!res.ok) throw new Error(`Telegram API ${res.status}: ${(await res.text()).slice(0, 200)}`);
      delivered = true;
    } catch (err) {
      console.error("[contact] Telegram delivery failed:", err);
    }
  }

  return NextResponse.json<ContactApiResponse>({ delivered: delivered || saved, saved });
}
