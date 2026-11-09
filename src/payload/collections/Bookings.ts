import type { CollectionConfig } from "payload";
import { isStaff } from "../access.ts";
import { area, label, num, sel, text } from "../fields.ts";

/**
 * Performance / gig booking requests ("رزرو اجرا"), submitted from the Bookings page.
 * Created server-side by /api/bookings; staff manage them here.
 */
export const Bookings: CollectionConfig = {
  slug: "bookings",
  labels: { singular: label("رزرو اجرا", "Booking"), plural: label("رزروهای اجرا", "Performance bookings") },
  admin: {
    group: label("درخواست‌ها", "Inbox"),
    useAsTitle: "name",
    defaultColumns: ["name", "phone", "eventType", "eventDate", "status", "createdAt"],
  },
  access: { read: isStaff, create: isStaff, update: isStaff, delete: isStaff },
  defaultSort: "-createdAt",
  fields: [
    text("name", "نام", "Name", { required: true }),
    text("phone", "تلفن / تماس", "Phone / contact", { required: true }),
    text("eventType", "نوع مراسم", "Event type"),
    { name: "eventDate", type: "text", label: label("تاریخ مراسم", "Event date") },
    text("city", "شهر", "City"),
    text("venue", "محل اجرا", "Venue"),
    num("guests", "تعداد مهمان (تقریبی)", "Guests (approx.)"),
    text("budget", "بودجه", "Budget"),
    area("message", "توضیحات", "Message"),
    text("locale", "زبان", "Language", { admin: { readOnly: true, position: "sidebar" } }),
    sel(
      "status",
      "وضعیت",
      "Status",
      [
        ["new", "جدید", "New"],
        ["contacted", "تماس گرفته شد", "Contacted"],
        ["confirmed", "قطعی شد", "Confirmed"],
        ["done", "انجام شد", "Done"],
        ["cancelled", "لغو شد", "Cancelled"],
      ],
      { defaultValue: "new", admin: { position: "sidebar" } },
    ),
    area("notes", "یادداشت داخلی", "Internal notes", { admin: { position: "sidebar" } }),
  ],
};
