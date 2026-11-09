import { area, arr, group, text } from "../fields.ts";
import { contentGlobal } from "./shared.ts";

/** Editable intro of the Products catalogue page. */
export const ProductsPage = contentGlobal(
  "products-page",
  "صفحه محصولات",
  "Products page",
  "pages",
  [
    text("kicker", "تیتر کوچک (لاتین)", "Kicker (latin)", { localized: false }),
    text("title", "عنوان", "Title", { required: true }),
    area("lead", "توضیح کوتاه", "Lead text"),
    area("empty", "متن وقتی محصولی نیست", "Empty-state text"),
  ],
  { preview: "/products" },
);

/** Editable content of the performance-booking page ("رزرو اجرا"). */
export const BookingPage = contentGlobal(
  "booking-page",
  "صفحه رزرو اجرا",
  "Booking page",
  "pages",
  [
    text("kicker", "تیتر کوچک (لاتین)", "Kicker (latin)", { localized: false }),
    text("title", "عنوان", "Title", { required: true }),
    area("lead", "توضیح کوتاه", "Lead text"),
    { name: "intro", type: "richText", label: { fa: "متن معرفی", en: "Intro" } },
    arr("eventTypes", "نوع مراسم‌ها", "Event types", [text("name", "عنوان", "Name", { required: true })], {
      admin: { description: { fa: "گزینه‌های فهرست «نوع مراسم» در فرم.", en: "Options for the event-type field in the form." } },
    }),
    group("success", "پیام ثبت موفق", "Success message", [
      text("title", "عنوان", "Title"),
      area("text", "متن", "Text"),
    ]),
  ],
  { preview: "/bookings" },
);
