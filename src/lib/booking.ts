import type { ContactPage } from "@/payload-types";

export type BookingData = {
  name: string;
  contact: string;
  service: string;
  format: string;
  time: string;
  message: string;
};

export type BookingForm = NonNullable<ContactPage["form"]>;

/** Response body of POST /api/contact */
export type ContactApiResponse = { delivered: boolean; saved?: boolean } | { error: string; field?: string };

export const BOOKING_LIMITS: Record<keyof BookingData, number> = {
  name: 80,
  contact: 80,
  service: 40,
  format: 40,
  time: 80,
  message: 1200,
};

export const serviceLabel = (form: BookingForm, id: string) => form.services?.find((s) => s.serviceId === id)?.label ?? id;

/** Strips the "(optional)" suffix from a field label. */
const label = (text: string | null | undefined) => (text ?? "").replace(/\s*\(.*\)\s*$/, "");

/** Same text for the Telegram bot message and the Telegram / WhatsApp fallback links. */
export function buildBookingMessage(d: BookingData, form: BookingForm): string {
  return [
    form.messageHeader ?? "",
    "",
    `${label(form.name)}: ${d.name}`,
    `${label(form.contact)}: ${d.contact}`,
    `${label(form.service)}: ${serviceLabel(form, d.service)}`,
    ...(d.format ? [`${label(form.format)}: ${d.format}`] : []),
    ...(d.time ? [`${label(form.time)}: ${d.time}`] : []),
    ...(d.message ? [`${label(form.message)}: ${d.message}`] : []),
  ].join("\n");
}

/** Server-side validation: trims, length-caps, and checks required fields and allowed values. */
export function parseBooking(
  input: unknown,
  allowed: { services: string[]; formats: string[] },
): { ok: true; data: BookingData } | { ok: false; field: keyof BookingData } {
  const raw = (typeof input === "object" && input !== null ? input : {}) as Record<string, unknown>;
  const read = (k: keyof BookingData) => (typeof raw[k] === "string" ? (raw[k] as string) : "").trim().slice(0, BOOKING_LIMITS[k]);
  const data: BookingData = {
    name: read("name"),
    contact: read("contact"),
    service: read("service"),
    format: read("format"),
    time: read("time"),
    message: read("message"),
  };
  if (!data.name) return { ok: false, field: "name" };
  if (!data.contact) return { ok: false, field: "contact" };
  if (!allowed.services.includes(data.service)) return { ok: false, field: "service" };
  if (data.format && !allowed.formats.includes(data.format)) return { ok: false, field: "format" };
  return { ok: true, data };
}
