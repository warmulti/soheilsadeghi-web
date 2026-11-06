"use client";

import { useEffect, useRef, useState } from "react";
import type { Locale } from "@/i18n/config";
import { BOOKING_LIMITS, buildBookingMessage, type BookingData, type BookingForm as FormLabels, type ContactApiResponse } from "@/lib/booking";
import { telegramUrl, whatsappUrl } from "@/lib/links";
import type { ContactPage } from "@/payload-types";
import { CheckIcon, TelegramIcon, WhatsAppIcon } from "@/components/icons";

type Status = "idle" | "sending" | "sent" | "fallback";

type Props = {
  locale: Locale;
  form: FormLabels;
  channels: ContactPage["channels"];
  contact: { telegram: string; whatsapp: string };
};

export default function BookingForm({ locale, form: f, channels, contact }: Props) {
  const services = f.services ?? [];
  const formats = f.formats ?? [];
  const empty: BookingData = { name: "", contact: "", service: services[0]?.serviceId ?? "", format: formats[0] ?? "", time: "", message: "" };

  const [data, setData] = useState<BookingData>(empty);
  const [errors, setErrors] = useState<{ name?: boolean; contact?: boolean }>({});
  const [status, setStatus] = useState<Status>("idle");
  const nameRef = useRef<HTMLInputElement>(null);
  const contactRef = useRef<HTMLInputElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  // Pre-select the topic from links like /contact?service=djing-pro (keeps the page cacheable).
  useEffect(() => {
    const service = new URLSearchParams(window.location.search).get("service");
    if (service && services.some((s) => s.serviceId === service)) setData((d) => ({ ...d, service }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (status === "sent" || status === "fallback") resultRef.current?.focus();
  }, [status]);

  const set =
    (key: keyof BookingData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setData((d) => ({ ...d, [key]: e.target.value }));
      if (key === "name" || key === "contact") setErrors((er) => ({ ...er, [key]: false }));
    };

  const trimmed = (): BookingData => ({
    name: data.name.trim(),
    contact: data.contact.trim(),
    service: data.service,
    format: data.format,
    time: data.time.trim(),
    message: data.message.trim(),
  });

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const d = trimmed();
    const next = { name: !d.name, contact: !d.contact };
    setErrors(next);
    if (next.name) return nameRef.current?.focus();
    if (next.contact) return contactRef.current?.focus();

    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...d, locale }),
      });
      const json = (await res.json()) as ContactApiResponse;
      setStatus(res.ok && "delivered" in json && json.delivered ? "sent" : "fallback");
    } catch {
      setStatus("fallback");
    }
  }

  if (status === "sent" || status === "fallback") {
    const message = buildBookingMessage(trimmed(), f);
    return (
      <div ref={resultRef} tabIndex={-1} className="animate-fade-up outline-none" aria-live="polite">
        <span className="grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br from-cyan to-neon text-ink">
          <CheckIcon className="h-7 w-7" />
        </span>
        <h3 className="mt-6 text-2xl font-black text-white">{status === "sent" ? f.successTitle : f.fallbackTitle}</h3>
        <p className="mt-3 leading-8 text-white/65">{status === "sent" ? f.successText : f.fallbackText}</p>

        {status === "fallback" && (
          <>
            <pre
              className="mt-6 max-h-60 overflow-auto rounded-2xl bg-black/30 p-4 font-sans text-sm leading-7 whitespace-pre-wrap text-white/75 ring-1 ring-white/10"
              data-lenis-prevent
            >
              {message}
            </pre>
            <div className="mt-6 flex flex-wrap gap-3">
              {contact.telegram && (
                <a href={telegramUrl(contact.telegram, message)} target="_blank" rel="noopener noreferrer" className="btn-neon">
                  <TelegramIcon className="h-5 w-5" />
                  {channels?.telegram?.action}
                </a>
              )}
              {contact.whatsapp && (
                <a href={whatsappUrl(contact.whatsapp, message)} target="_blank" rel="noopener noreferrer" className="btn-ghost">
                  <WhatsAppIcon className="h-5 w-5" />
                  {channels?.whatsapp?.action}
                </a>
              )}
            </div>
          </>
        )}

        <button
          type="button"
          onClick={() => {
            setData({ ...empty, service: data.service });
            setStatus("idle");
          }}
          className="mt-8 text-sm text-neon underline-offset-4 hover:underline"
        >
          {f.newRequest}
        </button>
      </div>
    );
  }

  const errorId = (k: string) => `booking-${k}-error`;

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="booking-name" className="mb-2 block text-sm text-white/70">
            {f.name} <span className="text-neon">*</span>
          </label>
          <input
            ref={nameRef}
            id="booking-name"
            className="field"
            value={data.name}
            onChange={set("name")}
            maxLength={BOOKING_LIMITS.name}
            autoComplete="name"
            required
            aria-invalid={errors.name || undefined}
            aria-describedby={errors.name ? errorId("name") : undefined}
          />
          {errors.name && (
            <p id={errorId("name")} className="mt-1.5 text-xs text-rose-300">
              {f.required}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="booking-contact" className="mb-2 block text-sm text-white/70">
            {f.contact} <span className="text-neon">*</span>
          </label>
          <input
            ref={contactRef}
            id="booking-contact"
            className="field"
            value={data.contact}
            onChange={set("contact")}
            maxLength={BOOKING_LIMITS.contact}
            placeholder={f.contactHint ?? ""}
            autoComplete="tel"
            required
            aria-invalid={errors.contact || undefined}
            aria-describedby={errors.contact ? errorId("contact") : undefined}
          />
          {errors.contact && (
            <p id={errorId("contact")} className="mt-1.5 text-xs text-rose-300">
              {f.required}
            </p>
          )}
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="booking-service" className="mb-2 block text-sm text-white/70">
            {f.service}
          </label>
          <select id="booking-service" className="field" value={data.service} onChange={set("service")}>
            {services.map((s) => (
              <option key={s.serviceId} value={s.serviceId}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
        {formats.length > 0 && (
          <fieldset>
            <legend className="mb-2 block text-sm text-white/70">{f.format}</legend>
            <div className="flex gap-2">
              {formats.map((fmt) => (
                <label key={fmt} className="relative flex-1 cursor-pointer">
                  <input type="radio" name="booking-format" value={fmt} checked={data.format === fmt} onChange={set("format")} className="peer sr-only" />
                  <span className="block rounded-xl bg-white/[0.04] px-2 py-3 text-center text-xs text-white/60 ring-1 ring-white/10 transition peer-checked:bg-neon/15 peer-checked:text-white peer-checked:ring-neon/60 peer-focus-visible:ring-2 peer-focus-visible:ring-cyan sm:text-sm">
                    {fmt}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
        )}
      </div>

      <div>
        <label htmlFor="booking-time" className="mb-2 block text-sm text-white/70">
          {f.time}
        </label>
        <input id="booking-time" className="field" value={data.time} onChange={set("time")} maxLength={BOOKING_LIMITS.time} />
      </div>

      <div>
        <label htmlFor="booking-message" className="mb-2 block text-sm text-white/70">
          {f.message}
        </label>
        <textarea
          id="booking-message"
          className="field min-h-32 resize-y leading-7"
          value={data.message}
          onChange={set("message")}
          maxLength={BOOKING_LIMITS.message}
          placeholder={f.messageHint ?? ""}
          data-lenis-prevent
        />
      </div>

      <button type="submit" disabled={status === "sending"} className="btn-neon mt-2 w-full disabled:opacity-60 sm:w-auto sm:justify-self-start">
        {status === "sending" ? f.sending : f.submit}
      </button>
    </form>
  );
}
