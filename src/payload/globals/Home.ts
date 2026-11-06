import { arr, area, sel, tab, tabs, tags, text } from "../fields.ts";
import { contentGlobal } from "./shared.ts";

export const LEVELS: [string, string, string][] = [
  ["beginner", "مبتدی", "Beginner"],
  ["intermediate", "متوسط", "Intermediate"],
  ["advanced", "پیشرفته", "Advanced"],
];

export const Home = contentGlobal(
  "home",
  "صفحه اصلی",
  "Homepage",
  "pages",
  [
    tabs(
      tab("هیرو", "Hero", [
        text("heroPrimary", "دکمه اصلی", "Primary button", { required: true }),
        text("heroSecondary", "دکمه دوم", "Secondary button", { required: true }),
        text("scrollHint", "راهنمای اسکرول", "Scroll hint"),
      ]),
      tab("خدمات", "Services", [
        text("servicesKicker", "برچسب بالا (لاتین)", "Kicker"),
        text("servicesTitle", "عنوان", "Title"),
        text("servicesAccent", "کلمه رنگی عنوان", "Accent word"),
        area("servicesLead", "مقدمه", "Lead"),
        text("moreInfo", "متن لینک «اطلاعات بیشتر»", "“More info” link label"),
        arr("services", "کارت‌های خدمات", "Service cards", [
          sel("icon", "آیکون", "Icon", [
            ["controller", "کنترلر دی‌جی", "DJ controller"],
            ["masterclass", "هدفون (مسترکلاس)", "Headphones"],
            ["ableton", "Ableton", "Ableton"],
            ["gear", "لپ‌تاپ و تجهیزات", "Laptop & gear"],
          ], { required: true }),
          text("title", "عنوان", "Title", { required: true }),
          area("description", "توضیح", "Description", { required: true }),
          tags("tags", "برچسب‌ها", "Tags"),
          text("href", "لینک", "Link", { required: true }),
        ]),
      ]),
      tab("تاریخچه Turntablism", "Turntablism history", [
        text("ttKicker", "برچسب بالا (لاتین)", "Kicker"),
        text("ttTitle", "عنوان", "Title"),
        text("ttTitleAccent", "کلمه رنگی", "Accent word"),
        area("ttIntro", "مقدمه", "Intro"),
        arr("timeline", "رویدادهای تایم‌لاین", "Timeline milestones", [
          text("year", "سال", "Year", { required: true }),
          text("title", "عنوان", "Title", { required: true }),
          area("text", "متن", "Text", { required: true }),
        ]),
      ]),
      tab("تکنیک‌های اسکرچ", "Scratch techniques", [
        text("techniquesTitle", "عنوان", "Title"),
        text("techniquesAccent", "کلمه رنگی", "Accent word"),
        area("techniquesLead", "مقدمه", "Lead"),
        arr("techniques", "تکنیک‌ها", "Techniques", [
          text("name", "نام (لاتین)", "Name", { required: true }),
          text("subtitle", "زیرعنوان", "Subtitle"),
          sel("level", "سطح", "Level", LEVELS, { required: true }),
          area("text", "توضیح", "Description", { required: true }),
        ]),
      ]),
    ),
  ],
  { preview: "/" },
);
