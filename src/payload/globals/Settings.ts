import { area, arr, group, num, tab, tabs, tags, text } from "../fields.ts";
import { contentGlobal } from "./shared.ts";

export const Settings = contentGlobal(
  "settings",
  "تنظیمات عمومی",
  "General settings",
  "settings",
  [
    tabs(
      tab("برند و معرفی", "Brand", [
        text("brandName", "نام برند (لاتین)", "Brand name", { required: true, localized: false }),
        text("nameLocal", "نام به زبان این نسخه", "Localized name", { required: true }),
        tags("roles", "نقش‌ها (زیر عنوان هیرو)", "Roles (hero kicker)", { localized: false }),
        area("bioShort", "بیوگرافی کوتاه صفحه اصلی", "Short bio (homepage)", { required: true }),
        area("description", "توضیحات سئو (گوگل)", "SEO description", { required: true }),
        area("footerText", "متن فوتر", "Footer text"),
      ]),
      tab("عکس", "Photo", [
        {
          name: "photo",
          type: "upload",
          relationTo: "media",
          localized: false,
          label: { fa: "عکس هیرو (پس‌زمینه شفاف)", en: "Hero photo (transparent background)" },
        },
        text("photoAlt", "توضیح عکس", "Photo alt text"),
        num("photoEyeLine", "محل خط چشم در عکس (۰ تا ۱)", "Eye line in photo (0–1)", {
          localized: false,
          min: 0,
          max: 1,
          defaultValue: 0.47,
          admin: {
            step: 0.01,
            description: {
              fa: "کسری از ارتفاع عکس که چشم‌ها در آن قرار دارند؛ برای اینکه صورت بالای عنوان صفحه اصلی بماند.",
              en: "Fraction of the photo height where the eyes are, so the face stays above the hero title.",
            },
          },
        }),
      ]),
      tab("راه‌های ارتباطی", "Contact", [
        text("telegram", "آیدی تلگرام (بدون @)", "Telegram username (no @)", { localized: false }),
        text("instagram", "آیدی اینستاگرام (بدون @)", "Instagram username (no @)", { localized: false }),
        text("whatsapp", "شماره واتس‌اپ (مثلاً 989121234567)", "WhatsApp number (e.g. 989121234567)", { localized: false }),
        text("email", "ایمیل", "Email", { localized: false }),
        text("responseTime", "زمان پاسخ‌گویی", "Response time"),
        text("hours", "ساعات کاری", "Working hours"),
      ]),
      tab("باکس دعوت انتهای صفحات", "Closing call-to-action", [
        group("ctaBand", "باکس دعوت", "Call-to-action band", [
          text("title", "عنوان (قبل از کلمه رنگی)", "Title (before accent)"),
          text("titleAccent", "کلمه رنگی", "Accent word"),
          text("titleEnd", "ادامه عنوان", "Title end"),
          area("text", "متن", "Text"),
          text("primary", "دکمه اصلی", "Primary button"),
          text("secondary", "دکمه دوم", "Secondary button"),
        ]),
      ]),
    ),
  ],
  { preview: "/" },
);

export const Navigation = contentGlobal(
  "navigation",
  "منوی سایت",
  "Navigation",
  "settings",
  [
    arr(
      "items",
      "آیتم‌های منو",
      "Menu items",
      [
        text("label", "عنوان", "Label", { required: true }),
        text("short", "عنوان کوتاه (برای منوی دسکتاپ)", "Short label (desktop)"),
        text("href", "لینک (مثلاً /contact)", "Link (e.g. /contact)", { required: true }),
        arr("children", "زیرمنو (کشویی)", "Submenu (dropdown)", [
          text("label", "عنوان", "Label", { required: true }),
          text("href", "لینک", "Link", { required: true }),
          text("description", "توضیح کوتاه", "Short description"),
        ]),
      ],
      { admin: { initCollapsed: false } },
    ),
  ],
  { description: ["لینک‌ها بدون پیشوند زبان نوشته شوند؛ نسخه انگلیسی خودکار /en می‌گیرد.", "Write links without a language prefix; English gets /en automatically."] },
);
