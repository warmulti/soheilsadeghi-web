import type { CollectionConfig } from "payload";
import { isStaff } from "../access.ts";
import { area, label, sel, text } from "../fields.ts";

/** Booking / consultation requests from the contact form. */
export const Requests: CollectionConfig = {
  slug: "requests",
  labels: { singular: label("درخواست", "Request"), plural: label("درخواست‌های فرم تماس", "Contact requests") },
  admin: {
    group: label("درخواست‌ها", "Inbox"),
    useAsTitle: "name",
    defaultColumns: ["name", "contact", "service", "status", "createdAt"],
  },
  // Created only by /api/contact (server side); staff manage them here.
  access: { read: isStaff, create: isStaff, update: isStaff, delete: isStaff },
  defaultSort: "-createdAt",
  fields: [
    text("name", "نام", "Name", { required: true }),
    text("contact", "تماس / تلگرام", "Phone / Telegram", { required: true }),
    text("service", "موضوع", "Topic"),
    text("format", "نوع کلاس", "Class type"),
    text("time", "زمان مناسب", "Preferred time"),
    area("message", "توضیحات", "Message"),
    text("locale", "زبان", "Language", { admin: { readOnly: true, position: "sidebar" } }),
    sel(
      "status",
      "وضعیت",
      "Status",
      [
        ["new", "جدید", "New"],
        ["contacted", "تماس گرفته شد", "Contacted"],
        ["done", "انجام شد", "Done"],
      ],
      { defaultValue: "new", admin: { position: "sidebar" } },
    ),
    area("notes", "یادداشت داخلی", "Internal notes", { admin: { position: "sidebar" } }),
  ],
};
