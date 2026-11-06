import type { Field } from "payload";
import { arr, area, check, group, lines, num, tab, tabs, tags, text } from "../fields.ts";
import { contentGlobal } from "./shared.ts";

const heroFields = (): Field[] => [
  text("kicker", "برچسب بالا (لاتین)", "Kicker"),
  text("title", "عنوان", "Title", { required: true }),
  text("titleAccent", "کلمه رنگی عنوان", "Accent word"),
  area("lead", "مقدمه", "Lead", { required: true }),
  text("primaryCta", "دکمه اصلی", "Primary button"),
  text("secondaryCta", "دکمه دوم", "Secondary button"),
];

/** Syllabus / curriculum: tab groups → modules → topics. */
export const moduleGroups = (name: string, fa: string, en: string): Field =>
  arr(name, fa, en, [
    text("label", "عنوان تب", "Tab label", { required: true }),
    text("latin", "برچسب لاتین", "Latin tag"),
    area("summary", "خلاصه", "Summary"),
    arr("modules", "ماژول‌ها", "Modules", [
      text("title", "عنوان ماژول", "Module title", { required: true }),
      text("sessions", "جلسات (مثلاً جلسه ۱–۲)", "Sessions (e.g. Sessions 1–2)"),
      lines("topics", "سرفصل‌ها", "Topics"),
    ]),
  ]);

export const faqField = (): Field =>
  arr("faq", "سؤالات پرتکرار", "FAQ", [text("q", "سؤال", "Question", { required: true }), area("a", "پاسخ", "Answer", { required: true })]);

export const DjingCourse = contentGlobal(
  "djing-course",
  "دوره DJing",
  "DJing course",
  "pages",
  [
    tabs(
      tab("هیرو", "Hero", heroFields()),
      tab("سطح‌ها", "Levels", [
        text("tiersKicker", "برچسب بالا", "Kicker"),
        text("tiersTitle", "عنوان بخش", "Section title"),
        area("tiersLead", "مقدمه بخش", "Section lead"),
        text("featuredBadge", "برچسب سطح پیشنهادی", "Featured badge"),
        text("bookLabel", "متن دکمه ثبت‌نام", "Book button label"),
        arr("tiers", "سطح‌ها", "Levels", [
          text("serviceId", "شناسه رزرو (برای فرم تماس)", "Booking id (contact form)", {
            required: true,
            admin: { description: { fa: "باید با یکی از شناسه‌های موضوع در «صفحه تماس» یکی باشد.", en: "Must match a topic id in the Contact page." } },
          }),
          text("latin", "برچسب لاتین", "Latin tag"),
          text("title", "عنوان", "Title", { required: true }),
          text("level", "سطح", "Level"),
          num("sessions", "تعداد جلسات", "Sessions", { required: true }),
          num("minutes", "مدت هر جلسه (دقیقه)", "Minutes per session", { required: true }),
          text("format", "نوع کلاس", "Format"),
          area("audience", "مناسب برای", "Who it's for"),
          text("price", "شهریه", "Price"),
          lines("highlights", "ویژگی‌ها", "Highlights"),
          check("featured", "سطح پیشنهادی", "Featured"),
        ]),
      ]),
      tab("سرفصل‌ها", "Syllabus", [
        text("syllabusKicker", "برچسب بالا", "Kicker"),
        text("syllabusTitle", "عنوان", "Title"),
        moduleGroups("syllabus", "سرفصل هر سطح", "Syllabus per level"),
      ]),
      tab("روش آموزش", "Method", [
        text("methodKicker", "برچسب بالا", "Kicker"),
        text("methodTitle", "عنوان", "Title"),
        arr("method", "مراحل", "Steps", [text("title", "عنوان", "Title", { required: true }), area("text", "متن", "Text")]),
      ]),
      tab("سؤالات", "FAQ", [faqField()]),
    ),
  ],
  { preview: "/courses/djing" },
);

export const AbletonCourse = contentGlobal(
  "ableton-course",
  "دوره Ableton Live",
  "Ableton Live course",
  "pages",
  [
    tabs(
      tab("هیرو", "Hero", [
        ...heroFields(),
        group("meta", "اطلاعات دوره", "Course facts", [
          num("sessions", "تعداد جلسات", "Sessions"),
          num("minutes", "مدت هر جلسه (دقیقه)", "Minutes per session"),
          text("format", "نوع کلاس", "Format"),
          text("level", "پیش‌نیاز", "Prerequisite"),
        ]),
        tags("pipeline", "مراحل نوار مسیر (لاتین)", "Pipeline steps"),
      ]),
      tab("سرفصل‌ها", "Curriculum", [
        text("curriculumKicker", "برچسب بالا", "Kicker"),
        text("curriculumTitle", "عنوان", "Title"),
        area("curriculumLead", "مقدمه", "Lead"),
        moduleGroups("tracks", "مسیرهای آموزشی", "Tracks"),
      ]),
      tab("خروجی دوره", "Outcomes", [
        text("outcomesKicker", "برچسب بالا", "Kicker"),
        text("outcomesTitle", "عنوان", "Title"),
        arr("outcomes", "خروجی‌ها", "Outcomes", [text("title", "عنوان", "Title", { required: true }), area("text", "متن", "Text")]),
      ]),
      tab("پیش‌نیاز و سؤالات", "Requirements & FAQ", [
        text("requirementsTitle", "عنوان پیش‌نیازها", "Requirements title"),
        lines("requirements", "پیش‌نیازها", "Requirements"),
        faqField(),
      ]),
    ),
  ],
  { preview: "/courses/ableton" },
);
