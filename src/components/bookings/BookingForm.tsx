"use client";

import { useRef, useState } from "react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import type { BookingApiResponse, BookingInput } from "@/lib/bookings";
import { CheckIcon } from "@/components/icons";

type T = Dictionary["bookings"];
type Status = "idle" | "sending" | "sent" | "error";

const EMPTY: BookingInput = { name: "", phone: "", eventType: "", eventDate: "", city: "", venue: "", guests: "", budget: "", message: "" };

export default function BookingForm({
  locale,
  t,
  eventTypes,
  success,
}: {
  locale: Locale;
  t: T;
  eventTypes: string[];
  success: { title: string; text: string };
}) {
  const [data, setData] = useState<BookingInput>(EMPTY);
  const [status, setStatus] = useState<Status>("idle");
  const [err, setErr] = useState<string>("");
  const resultRef = useRef<HTMLDivElement>(null);

  const set =
    (key: keyof BookingInput) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setData((d) => ({ ...d, [key]: e.target.value }));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!data.name.trim() || !data.phone.trim()) {
      setErr(t.errorRequired);
      return;
    }
    setErr("");
    setStatus("sending");
    try {
      const res = await fetch("/api/bookings/submit", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...data, locale }),
      });
      const json = (await res.json()) as BookingApiResponse;
      if (res.ok && "ok" in json) {
        setStatus("sent");
        requestAnimationFrame(() => resultRef.current?.focus());
      } else {
        setErr(t.errorGeneric);
        setStatus("error");
      }
    } catch {
      setErr(t.errorGeneric);
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div ref={resultRef} tabIndex={-1} className="animate-fade-up outline-none" aria-live="polite">
        <span className="grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br from-cyan to-neon text-ink">
          <CheckIcon className="h-7 w-7" />
        </span>
        <h3 className="mt-6 text-2xl font-black text-white">{success.title}</h3>
        <p className="mt-3 leading-8 text-white/65">{success.text}</p>
      </div>
    );
  }

  const field = "field";
  return (
    <form onSubmit={onSubmit} className="grid gap-5" noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className="mb-2 block text-sm text-white/70">
            {t.name} <span className="text-neon">*</span>
          </span>
          <input value={data.name} onChange={set("name")} autoComplete="name" className={field} required />
        </label>
        <label className="block">
          <span className="mb-2 block text-sm text-white/70">
            {t.phone} <span className="text-neon">*</span>
          </span>
          <input value={data.phone} onChange={set("phone")} autoComplete="tel" dir="ltr" className={field} required />
        </label>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className="mb-2 block text-sm text-white/70">{t.eventType}</span>
          {eventTypes.length > 0 ? (
            <select value={data.eventType} onChange={set("eventType")} className={field}>
              <option value="">{t.choose}</option>
              {eventTypes.map((et) => (
                <option key={et} value={et}>
                  {et}
                </option>
              ))}
            </select>
          ) : (
            <input value={data.eventType} onChange={set("eventType")} className={field} />
          )}
        </label>
        <label className="block">
          <span className="mb-2 block text-sm text-white/70">{t.date}</span>
          <input value={data.eventDate} onChange={set("eventDate")} className={field} placeholder="۱۴۰۴/۱۰/۰۱" />
        </label>
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <label className="block">
          <span className="mb-2 block text-sm text-white/70">{t.city}</span>
          <input value={data.city} onChange={set("city")} className={field} />
        </label>
        <label className="block">
          <span className="mb-2 block text-sm text-white/70">{t.venue}</span>
          <input value={data.venue} onChange={set("venue")} className={field} />
        </label>
        <label className="block">
          <span className="mb-2 block text-sm text-white/70">{t.guests}</span>
          <input value={data.guests} onChange={set("guests")} inputMode="numeric" dir="ltr" className={field} />
        </label>
      </div>

      <label className="block">
        <span className="mb-2 block text-sm text-white/70">{t.budget}</span>
        <input value={data.budget} onChange={set("budget")} className={field} />
      </label>

      <label className="block">
        <span className="mb-2 block text-sm text-white/70">{t.message}</span>
        <textarea value={data.message} onChange={set("message")} rows={4} className={field} />
      </label>

      {err && (
        <p role="alert" className="rounded-xl border border-rose-400/30 bg-rose-400/10 px-4 py-3 text-sm text-rose-100">
          {err}
        </p>
      )}

      <button type="submit" disabled={status === "sending"} className="btn-neon w-full disabled:opacity-60 sm:w-auto sm:justify-self-start sm:px-10">
        {status === "sending" ? t.sending : t.submit}
      </button>
    </form>
  );
}
