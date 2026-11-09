import { NextResponse } from "next/server";
import { getPayload } from "payload";
import config from "@payload-config";
import { defaultLocale, isLocale, type Locale } from "@/i18n/config";
import { bookingSummary, parseBooking, type BookingApiResponse } from "@/lib/bookings";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { notifyOwner, siteUrl } from "@/payload/email";
import { notifyOwnerSms } from "@/lib/sms";

/**
 * Performance-booking requests ("رزرو اجرا"). Saved in the admin (Inbox → Performance bookings),
 * and Soheil is notified by email and SMS (whichever is configured).
 */
export async function POST(req: Request) {
  if (!rateLimit(`booking:${clientIp(req)}`, 5, 10 * 60_000)) {
    return NextResponse.json<BookingApiResponse>({ error: "rate_limited" }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json<BookingApiResponse>({ error: "invalid_json" }, { status: 400 });
  }
  const locale: Locale = isLocale((body as { locale?: string })?.locale) ? ((body as { locale: string }).locale as Locale) : defaultLocale;

  const parsed = parseBooking(body);
  if (!parsed.ok) return NextResponse.json<BookingApiResponse>({ error: `invalid_${parsed.field}` }, { status: 400 });
  const d = parsed.data;

  const payload = await getPayload({ config });
  let saved = false;
  try {
    await payload.create({
      collection: "bookings",
      data: {
        name: d.name,
        phone: d.phone,
        eventType: d.eventType,
        eventDate: d.eventDate,
        city: d.city,
        venue: d.venue,
        guests: d.guests ? Number(d.guests.replace(/[^\d]/g, "")) || undefined : undefined,
        budget: d.budget,
        message: d.message,
        locale,
        status: "new",
      },
      overrideAccess: true,
    });
    saved = true;
  } catch (err) {
    console.error("[bookings] could not save:", err);
  }

  const summary = bookingSummary(d);
  await notifyOwner(payload, {
    subject: `رزرو اجرا: ${d.name}${d.eventType ? ` — ${d.eventType}` : ""}`,
    title: "درخواست رزرو اجرای جدید",
    lines: summary.split("\n"),
    button: { label: "دیدن رزروها در پنل", url: `${siteUrl()}/admin/collections/bookings` },
    replyTo: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.phone) ? d.phone : undefined,
  });
  await notifyOwnerSms(`درخواست رزرو اجرا:\n${d.name}\n${d.phone}${d.eventType ? `\n${d.eventType}` : ""}${d.eventDate ? `\n${d.eventDate}` : ""}`);

  return NextResponse.json<BookingApiResponse>({ ok: true, saved });
}
