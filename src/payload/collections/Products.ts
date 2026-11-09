import type { CollectionConfig } from "payload";
import { isStaff, publishedOrStaff } from "../access.ts";
import { area, check, group, label, num, sel, slugField, tags, text } from "../fields.ts";

/**
 * Products catalogue (merch, gear, presets…). A catalogue, not a shop: each product links out to
 * where it's sold (Instagram, a marketplace) or to the contact page — there is no online payment.
 * Fully editable from the admin panel.
 */
export const Products: CollectionConfig = {
  slug: "products",
  labels: { singular: label("محصول", "Product"), plural: label("محصولات", "Products") },
  admin: {
    group: label("فروشگاه", "Shop"),
    useAsTitle: "title",
    defaultColumns: ["title", "price", "featured", "_status", "updatedAt"],
    listSearchableFields: ["title", "slug"],
    preview: (doc) => `/products/${doc.slug}`,
  },
  versions: { drafts: true, maxPerDoc: 20 },
  access: { read: publishedOrStaff, create: isStaff, update: isStaff, delete: isStaff },
  defaultSort: ["order", "-publishedAt"],
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: label("اطلاعات", "Details"),
          fields: [
            text("title", "عنوان", "Title", { required: true, localized: true }),
            { name: "image", type: "upload", relationTo: "media", label: label("تصویر اصلی", "Main image") },
            {
              name: "gallery",
              type: "array",
              label: label("تصاویر بیشتر", "More images"),
              labels: { singular: label("تصویر", "Image"), plural: label("تصاویر", "Images") },
              fields: [{ name: "image", type: "upload", relationTo: "media", required: true, label: label("تصویر", "Image") }],
              admin: { initCollapsed: true },
            },
            area("excerpt", "خلاصه کوتاه", "Short summary", { localized: true, admin: { rows: 2 } }),
            { name: "description", type: "richText", label: label("توضیحات کامل", "Full description"), localized: true },
            tags("tags", "برچسب‌ها", "Tags"),
          ],
        },
        {
          label: label("قیمت و خرید", "Price & buying"),
          fields: [
            text("price", "قیمت (مثلاً ۲٬۵۰۰٬۰۰۰ تومان)", "Price (e.g. 2,500,000 Toman)", { localized: true }),
            text("oldPrice", "قیمت قبلی (برای تخفیف)", "Old price (for a discount)", { localized: true }),
            text("badge", "برچسب روی کارت (جدید، تخفیف…)", "Card badge (New, Sale…)", { localized: true }),
            group("buy", "دکمه خرید", "Buy button", [
              sel(
                "type",
                "نوع",
                "Type",
                [
                  ["link", "لینک خرید (فروشگاه/اینستاگرام)", "Buy link (shop/Instagram)"],
                  ["telegram", "سفارش از تلگرام", "Order via Telegram"],
                  ["whatsapp", "سفارش از واتس‌اپ", "Order via WhatsApp"],
                  ["contact", "صفحه تماس", "Contact page"],
                ],
                { defaultValue: "link", required: true },
              ),
              text("url", "لینک خرید", "Buy link", {
                admin: { condition: (_: unknown, s: Record<string, unknown>) => s?.type === "link" },
              }),
              text("buttonLabel", "متن دکمه (اختیاری)", "Button label (optional)", { localized: true }),
            ]),
          ],
        },
      ],
    },
    slugField(),
    check("featured", "ویژه (نمایش در بالای لیست)", "Featured", { admin: { position: "sidebar" } }),
    num("order", "ترتیب نمایش", "Sort order", { defaultValue: 0, admin: { position: "sidebar", description: label("کوچک‌تر، بالاتر.", "Lower shows first.") } }),
    { name: "publishedAt", type: "date", label: label("تاریخ انتشار", "Published at"), admin: { position: "sidebar" } },
  ],
  hooks: {
    beforeChange: [({ data }) => ({ ...data, publishedAt: data.publishedAt || new Date().toISOString() })],
  },
};
