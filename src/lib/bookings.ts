/** Validation and shaping for performance-booking submissions (POST /api/bookings). */

export type BookingInput = {
  name: string;
  phone: string;
  eventType: string;
  eventDate: string;
  city: string;
  venue: string;
  guests: string;
  budget: string;
  message: string;
};

export type BookingApiResponse = { ok: true; saved: boolean } | { error: string };

const LIMITS: Record<keyof BookingInput, number> = {
  name: 80,
  phone: 40,
  eventType: 60,
  eventDate: 40,
  city: 40,
  venue: 80,
  guests: 10,
  budget: 40,
  message: 2000,
};

/** Trims, length-caps and checks the required fields. Returns the clean data or the first bad field. */
export function parseBooking(input: unknown): { ok: true; data: BookingInput } | { ok: false; field: keyof BookingInput } {
  const raw = (typeof input === "object" && input !== null ? input : {}) as Record<string, unknown>;
  const read = (k: keyof BookingInput) => String(raw[k] ?? "").trim().slice(0, LIMITS[k]);
  const data: BookingInput = {
    name: read("name"),
    phone: read("phone"),
    eventType: read("eventType"),
    eventDate: read("eventDate"),
    city: read("city"),
    venue: read("venue"),
    guests: read("guests"),
    budget: read("budget"),
    message: read("message"),
  };
  if (!data.name) return { ok: false, field: "name" };
  if (!data.phone) return { ok: false, field: "phone" };
  return { ok: true, data };
}

/** Readable summary for the owner notification (email / SMS). */
export function bookingSummary(d: BookingInput): string {
  return [
    `نام: ${d.name}`,
    `تماس: ${d.phone}`,
    d.eventType && `نوع مراسم: ${d.eventType}`,
    d.eventDate && `تاریخ: ${d.eventDate}`,
    d.city && `شهر: ${d.city}`,
    d.venue && `محل: ${d.venue}`,
    d.guests && `تعداد مهمان: ${d.guests}`,
    d.budget && `بودجه: ${d.budget}`,
    d.message && `توضیحات: ${d.message}`,
  ]
    .filter(Boolean)
    .join("\n");
}
