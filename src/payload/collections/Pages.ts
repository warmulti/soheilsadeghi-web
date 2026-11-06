import type { Block, CollectionConfig } from "payload";
import { isStaff, publishedOrStaff } from "../access.ts";
import { arr, area, label, slugField, text } from "../fields.ts";

const blocks: Block[] = [
  {
    slug: "content",
    labels: { singular: label("متن", "Text"), plural: label("متن", "Text") },
    fields: [{ name: "content", type: "richText", label: label("متن", "Content"), required: true }],
  },
  {
    slug: "image",
    labels: { singular: label("تصویر", "Image"), plural: label("تصویر", "Image") },
    fields: [
      { name: "image", type: "upload", relationTo: "media", required: true, label: label("تصویر", "Image") },
      text("caption", "زیرنویس", "Caption"),
    ],
  },
  {
    slug: "cta",
    labels: { singular: label("دعوت به اقدام", "Call to action"), plural: label("دعوت به اقدام", "Calls to action") },
    fields: [
      text("title", "عنوان", "Title", { required: true }),
      area("text", "متن", "Text"),
      text("buttonLabel", "متن دکمه", "Button label"),
      text("buttonHref", "لینک دکمه (مثلاً /contact)", "Button link (e.g. /contact)"),
    ],
  },
  {
    slug: "faq",
    labels: { singular: label("پرسش و پاسخ", "FAQ"), plural: label("پرسش و پاسخ", "FAQ") },
    fields: [
      arr("items", "سؤال‌ها", "Questions", [text("q", "سؤال", "Question", { required: true }), area("a", "پاسخ", "Answer", { required: true })]),
    ],
  },
  {
    slug: "video",
    labels: { singular: label("ویدیو", "Video"), plural: label("ویدیو", "Video") },
    fields: [text("url", "لینک YouTube یا آپارات", "YouTube or Aparat link", { required: true }), text("caption", "زیرنویس", "Caption")],
  },
];

/** Free-form pages built from blocks — like “Add new page” in WordPress. Served at /<slug>. */
export const Pages: CollectionConfig = {
  slug: "pages",
  labels: { singular: label("برگه", "Page"), plural: label("برگه‌ها", "Pages") },
  admin: {
    group: label("محتوا", "Content"),
    useAsTitle: "title",
    defaultColumns: ["title", "slug", "_status", "updatedAt"],
    preview: (doc) => `/${doc.slug}`,
    description: label("برگه‌های دلخواه؛ با آدرس /نامک در سایت نمایش داده می‌شوند و می‌توانید آن‌ها را به منو اضافه کنید.", "Custom pages served at /slug; add them to the menu in Navigation."),
  },
  versions: { drafts: true, maxPerDoc: 20 },
  access: { read: publishedOrStaff, create: isStaff, update: isStaff, delete: isStaff },
  fields: [
    text("title", "عنوان", "Title", { required: true, localized: true }),
    text("kicker", "برچسب بالای عنوان (انگلیسی)", "Kicker (above title)", { localized: true }),
    area("lead", "مقدمه", "Lead", { localized: true }),
    { name: "layout", type: "blocks", label: label("محتوا", "Content"), blocks, localized: true },
    area("metaDescription", "توضیحات سئو", "SEO description", { localized: true, admin: { position: "sidebar" } }),
    slugField(),
  ],
};
