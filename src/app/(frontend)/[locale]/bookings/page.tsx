import type { Metadata } from "next";
import { notFound } from "next/navigation";
import RevealScope from "@/components/ui/RevealScope";
import PageHero from "@/components/ui/PageHero";
import RichTextView from "@/components/ui/RichTextView";
import BookingForm from "@/components/bookings/BookingForm";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getGlobal } from "@/lib/cms";
import { pageMeta } from "@/lib/seo";

type Params = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = getDictionary(locale).bookings;
  const page = await getGlobal("booking-page", locale);
  return pageMeta(locale, "/bookings", page.title || t.title, page.lead || t.lead);
}

export default async function BookingsPage({ params }: Params) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale).bookings;
  const page = await getGlobal("booking-page", locale);
  const eventTypes = (page.eventTypes ?? []).map((e) => e.name).filter((n): n is string => Boolean(n));
  const success = { title: page.success?.title || t.successTitle, text: page.success?.text || t.successText };

  return (
    <RevealScope>
      <PageHero kicker={page.kicker || t.kicker} title={page.title || t.title} lead={page.lead || t.lead} />

      <section className="px-5 pb-28 md:px-8">
        <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          {page.intro && (
            <div data-reveal className="lg:pt-2">
              <RichTextView data={page.intro} />
            </div>
          )}
          <div data-reveal className={`glass rounded-[2rem] p-6 md:p-8 ${page.intro ? "" : "lg:col-span-2"}`}>
            <BookingForm locale={locale} t={t} eventTypes={eventTypes} success={success} />
          </div>
        </div>
      </section>
    </RevealScope>
  );
}
