import type { Field } from "payload";
import { arr, area, group, lines, sel, tab, tabs, tags, text } from "../fields.ts";
import { faqField } from "./Courses.ts";
import { contentGlobal } from "./shared.ts";

const gear = (name: string, fa: string, en: string): Field =>
  arr(name, fa, en, [
    text("name", "نام مدل", "Model", { required: true }),
    text("brand", "برند", "Brand", { required: true }),
    text("kind", "نوع", "Type"),
    tags("tags", "نرم‌افزارهای سازگار", "Compatible software"),
    lines("points", "ویژگی‌ها", "Highlights"),
  ]);

export const BuyingGuide = contentGlobal(
  "buying-guide",
  "راهنمای خرید",
  "Buying guide",
  "pages",
  [
    tabs(
      tab("هیرو", "Hero", [
        text("kicker", "برچسب بالا", "Kicker"),
        text("title", "عنوان", "Title", { required: true }),
        text("titleAccent", "کلمه رنگی", "Accent word"),
        area("lead", "مقدمه", "Lead"),
      ]),
      tab("سطح‌ها و تجهیزات", "Budget levels & gear", [
        text("filterLabel", "عنوان فیلتر", "Filter label"),
        text("budgetLabel", "برچسب بودجه", "Budget label"),
        area("priceNote", "توضیح قیمت‌ها", "Price note"),
        group("categories", "عنوان دسته‌ها", "Category titles", [
          text("controllers", "کنترلر", "Controllers"),
          text("headphones", "هدفون", "Headphones"),
          text("monitors", "اسپیکر", "Monitors"),
        ]),
        arr("tiers", "سطح‌های بودجه", "Budget levels", [
          sel("tierId", "شناسه", "Id", [
            ["beginner", "مبتدی", "Beginner"],
            ["intermediate", "متوسط", "Intermediate"],
            ["pro", "حرفه‌ای", "Pro"],
          ], { required: true }),
          text("label", "عنوان", "Label", { required: true }),
          text("latin", "برچسب لاتین", "Latin tag"),
          text("budget", "بودجه تقریبی", "Approx. budget"),
          area("who", "مناسب برای", "Who it's for"),
          area("tip", "نکته", "Tip"),
          gear("controllers", "کنترلرها و دستگاه‌ها", "Controllers"),
          gear("headphones", "هدفون‌ها", "Headphones"),
          gear("monitors", "اسپیکرها", "Monitors"),
        ]),
      ]),
      tab("لپ‌تاپ", "Laptop", [
        group("laptop", "لپ‌تاپ", "Laptop", [
          text("kicker", "برچسب بالا", "Kicker"),
          text("title", "عنوان", "Title"),
          area("lead", "مقدمه", "Lead"),
          text("minLabel", "عنوان ستون حداقل", "“Minimum” column"),
          text("recLabel", "عنوان ستون پیشنهادی", "“Recommended” column"),
          arr("rows", "ردیف‌های جدول", "Table rows", [
            text("label", "مشخصه", "Spec", { required: true }),
            text("min", "حداقل", "Minimum"),
            text("rec", "پیشنهادی", "Recommended"),
          ]),
          text("windowsTitle", "عنوان نکات ویندوز", "Windows tips title"),
          lines("windowsTips", "نکات ویندوز", "Windows tips"),
          text("macTitle", "عنوان نکات مک", "Mac tips title"),
          lines("macTips", "نکات مک", "Mac tips"),
        ]),
      ]),
      tab("چک‌لیست", "Checklist", [
        text("checklistTitle", "عنوان", "Title"),
        lines("checklist", "موارد", "Items"),
        text("consultCta", "دکمه مشاوره", "Consultation button"),
      ]),
    ),
  ],
  { preview: "/buying-guide" },
);

export const Biography = contentGlobal(
  "biography",
  "بیوگرافی",
  "Biography",
  "pages",
  [
    tabs(
      tab("هیرو و داستان", "Hero & story", [
        text("kicker", "برچسب بالا", "Kicker"),
        text("title", "عنوان", "Title", { required: true }),
        area("lead", "مقدمه", "Lead"),
        text("storyTitle", "عنوان داستان", "Story title"),
        lines("story", "پاراگراف‌های داستان", "Story paragraphs"),
      ]),
      tab("مسیر", "Journey", [
        text("chaptersKicker", "برچسب بالا", "Kicker"),
        text("chaptersTitle", "عنوان", "Title"),
        arr("chapters", "مراحل", "Chapters", [
          text("tag", "برچسب", "Tag"),
          text("title", "عنوان", "Title", { required: true }),
          area("text", "متن", "Text"),
        ]),
      ]),
      tab("فلسفه هنری", "Philosophy", [
        text("philosophyKicker", "برچسب بالا", "Kicker"),
        text("philosophyTitle", "عنوان", "Title"),
        area("quote", "نقل‌قول", "Quote"),
        lines("philosophy", "پاراگراف‌ها", "Paragraphs"),
      ]),
      tab("صحنه و آموزش", "Stage & teaching", [
        text("stageKicker", "برچسب بالا (صحنه)", "Stage kicker"),
        text("stageTitle", "عنوان (صحنه)", "Stage title"),
        area("stageLead", "مقدمه (صحنه)", "Stage lead"),
        arr("stage", "انواع اجرا", "Event types", [text("title", "عنوان", "Title", { required: true }), area("text", "متن", "Text")]),
        text("teachingKicker", "برچسب بالا (آموزش)", "Teaching kicker"),
        text("teachingTitle", "عنوان (آموزش)", "Teaching title"),
        arr("teaching", "اصول آموزش", "Teaching principles", [text("title", "عنوان", "Title", { required: true }), area("text", "متن", "Text")]),
      ]),
      tab("ستاپ", "Setup", [
        text("setupKicker", "برچسب بالا", "Kicker"),
        text("setupTitle", "عنوان", "Title"),
        text("setupNote", "توضیح", "Note"),
        arr("setup", "گروه‌های تجهیزات", "Gear groups", [text("group", "نام گروه", "Group", { required: true }), tags("items", "تجهیزات", "Items")]),
      ]),
    ),
  ],
  { preview: "/biography" },
);

export const ContactPage = contentGlobal(
  "contact-page",
  "صفحه تماس",
  "Contact page",
  "pages",
  [
    tabs(
      tab("هیرو و کانال‌ها", "Hero & channels", [
        text("kicker", "برچسب بالا", "Kicker"),
        text("title", "عنوان", "Title", { required: true }),
        text("titleAccent", "کلمه رنگی", "Accent word"),
        area("lead", "مقدمه", "Lead"),
        text("channelsTitle", "عنوان کانال‌ها", "Channels title"),
        group("channels", "کانال‌ها", "Channels", [
          group("telegram", "تلگرام", "Telegram", [text("label", "عنوان", "Label"), text("action", "متن دکمه", "Action")]),
          group("whatsapp", "واتس‌اپ", "WhatsApp", [text("label", "عنوان", "Label"), text("action", "متن دکمه", "Action")]),
          group("instagram", "اینستاگرام", "Instagram", [text("label", "عنوان", "Label"), text("action", "متن دکمه", "Action")]),
        ]),
        text("responseLabel", "برچسب زمان پاسخ", "Response time label"),
        text("hoursLabel", "برچسب ساعات کاری", "Hours label"),
      ]),
      tab("فرم رزرو", "Booking form", [
        group("form", "فرم", "Form", [
          text("title", "عنوان فرم", "Form title"),
          area("lead", "توضیح فرم", "Form lead"),
          text("name", "برچسب نام", "Name label"),
          text("contact", "برچسب تماس", "Contact label"),
          text("contactHint", "راهنمای تماس", "Contact hint"),
          text("service", "برچسب موضوع", "Topic label"),
          text("format", "برچسب نوع کلاس", "Class type label"),
          text("time", "برچسب زمان", "Time label"),
          text("message", "برچسب توضیحات", "Message label"),
          text("messageHint", "راهنمای توضیحات", "Message hint"),
          text("submit", "دکمه ارسال", "Submit button"),
          text("sending", "متن در حال ارسال", "Sending text"),
          text("required", "پیام فیلد الزامی", "Required-field message"),
          text("successTitle", "عنوان موفقیت", "Success title"),
          area("successText", "متن موفقیت", "Success text"),
          text("fallbackTitle", "عنوان ارسال دستی", "Fallback title"),
          area("fallbackText", "متن ارسال دستی", "Fallback text"),
          text("newRequest", "دکمه درخواست جدید", "New request button"),
          arr("services", "موضوع‌ها", "Topics", [
            text("serviceId", "شناسه", "Id", { required: true }),
            text("label", "عنوان", "Label", { required: true }),
          ]),
          tags("formats", "انواع کلاس", "Class types"),
          text("messageHeader", "عنوان پیام ارسالی", "Outgoing message header"),
        ]),
      ]),
    ),
  ],
  { preview: "/contact" },
);
