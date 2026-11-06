import { arr, area, group, lines, sel, tab, tabs, tags, text } from "../fields.ts";
import { contentGlobal } from "./shared.ts";

export const ESCALATION_OPTIONS: [string, string, string][] = [
  ["none", "بدون ارجاع", "No hand-off"],
  ["hardware", "آسیب سخت‌افزاری", "Hardware damage"],
  ["registration", "ثبت‌نام دوره", "Course registration"],
  ["routing", "روتینگ و ستاپ خاص", "Custom routing"],
  ["complex", "مورد پیچیده", "Complex case"],
];

export const ChatSettings = contentGlobal(
  "chat-settings",
  "دستیار هوشمند (چت)",
  "AI assistant (chat)",
  "settings",
  [
    tabs(
      tab("متن‌های ویجت", "Widget texts", [
        text("launcher", "متن دکمه شناور", "Launcher label"),
        text("title", "عنوان پنجره", "Window title"),
        text("modeAi", "برچسب حالت هوش مصنوعی", "AI mode label"),
        text("modeBuiltin", "برچسب حالت داخلی", "Built-in mode label"),
        area("greeting", "پیام خوش‌آمد", "Greeting"),
        text("presetsTitle", "عنوان پیشنهادها", "Presets title"),
        lines("presets", "سؤال‌های آماده", "Preset questions"),
        text("placeholder", "متن راهنمای ورودی", "Input placeholder"),
        text("send", "دکمه ارسال", "Send"),
        text("close", "دکمه بستن", "Close"),
        text("typing", "در حال تایپ", "Typing"),
        text("direct", "دکمه ارتباط مستقیم", "Direct contact button"),
        area("error", "پیام خطای اتصال", "Connection error"),
      ]),
      tab("ارجاع به سهیل", "Hand-off to Soheil", [
        text("summaryTitle", "عنوان کارت خلاصه", "Summary card title"),
        area("summaryHint", "راهنمای کارت خلاصه", "Summary hint"),
        text("sendTelegram", "دکمه تلگرام", "Telegram button"),
        text("sendWhatsapp", "دکمه واتس‌اپ", "WhatsApp button"),
        text("copy", "دکمه کپی", "Copy button"),
        text("copied", "متن کپی شد", "Copied text"),
        text("backToChat", "دکمه ادامه گفتگو", "Back to chat"),
        group("escalation", "متن هر نوع ارجاع", "Hand-off intro per reason", [
          area("hardware", "آسیب سخت‌افزاری", "Hardware"),
          area("registration", "ثبت‌نام", "Registration"),
          area("routing", "روتینگ خاص", "Routing"),
          area("unresolved", "حل نشده", "Unresolved"),
          area("complex", "پیچیده", "Complex"),
          area("manual", "درخواست مستقیم کاربر", "Manual"),
        ]),
        group("summary", "برچسب‌های پیام خلاصه", "Summary message labels", [
          text("greeting", "سلام ابتدای پیام", "Greeting line"),
          text("topic", "موضوع", "Topic"),
          text("defaultTopic", "موضوع پیش‌فرض", "Default topic"),
          text("problem", "شرح مشکل", "Problem"),
          text("details", "توضیحات بیشتر", "More details"),
          text("gear", "تجهیزات", "Gear"),
          text("tried", "جمله «حل نشد»", "“Not solved” sentence"),
          text("noMessages", "متن جایگزین خالی", "Empty placeholder"),
        ]),
      ]),
      tab("پاسخ‌های عمومی", "General replies", [
        group("replies", "پاسخ‌ها", "Replies", [
          area("hello", "پاسخ سلام", "Hello"),
          area("thanks", "پاسخ تشکر", "Thanks"),
          area("unresolved", "پاسخ «حل نشد»", "Unresolved"),
          area("followup", "پاسخ توضیحات تکمیلی", "Follow-up"),
          area("fallback", "پاسخ وقتی موضوع شناسایی نشد", "Fallback"),
        ]),
        group("signals", "کلمات تشخیص", "Detection words", [
          tags("hello", "کلمات سلام", "Greeting words"),
          tags("thanks", "کلمات تشکر", "Thanks words"),
          tags("unresolved", "عبارت‌های «حل نشد»", "“Not solved” phrases"),
        ]),
      ]),
      tab("پایگاه دانش", "Knowledge base", [
        arr(
          "kb",
          "موضوع‌های عیب‌یابی",
          "Troubleshooting topics",
          [
            text("kbId", "شناسه (لاتین، یکتا)", "Id (unique)", { required: true }),
            text("title", "عنوان (در خلاصه ارسالی)", "Title (used in the summary)", { required: true }),
            tags("keywords", "کلمات کلیدی تشخیص", "Detection keywords", {
              admin: {
                description: {
                  fa: "عبارت‌های چندکلمه‌ای وزن بیشتری دارند. مثلاً «قطع و وصل»، «خش».",
                  en: "Multi-word phrases weigh more, e.g. “sound drops”, “crackle”.",
                },
              },
            }),
            area("intro", "جمله اول پاسخ", "Answer intro", { required: true }),
            lines("steps", "مراحل حل مشکل", "Steps"),
            area("outro", "جمله پایانی", "Closing line"),
            sel("escalate", "ارجاع خودکار به سهیل", "Auto hand-off to Soheil", ESCALATION_OPTIONS, { defaultValue: "none" }),
          ],
          { admin: { description: { fa: "در حالت AI هم همین متن‌ها به‌عنوان مرجع به مدل داده می‌شوند.", en: "Also given to the AI model as reference." } } },
        ),
      ]),
    ),
  ],
);
