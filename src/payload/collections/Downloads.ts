import type { CollectionConfig } from "payload";
import { downloadsRead, isStaff } from "../access.ts";
import { area, check, label, num, sel, slugField, tags, text } from "../fields.ts";

export const DOWNLOAD_CATEGORIES = ["mashups", "podcasts", "tracks", "software", "plugins"] as const;
export type DownloadCategory = (typeof DOWNLOAD_CATEGORIES)[number];

const audio = ["mashups", "podcasts", "tracks"];
const program = ["software", "plugins"];
const whenCat = (cats: string[]) => (_: unknown, sibling: Record<string, unknown>) => cats.includes(String(sibling?.category));

export const Downloads: CollectionConfig = {
  slug: "downloads",
  labels: { singular: label("آیتم دانلود", "Download"), plural: label("دانلودها", "Downloads") },
  admin: {
    group: label("دانلود و آموزش", "Downloads & learning"),
    useAsTitle: "title",
    defaultColumns: ["title", "category", "visibility", "downloadCount", "_status", "updatedAt"],
    listSearchableFields: ["title", "slug"],
    preview: (doc) => `/downloads/${doc.category}/${doc.slug}`,
  },
  versions: { drafts: true, maxPerDoc: 20 },
  access: { read: downloadsRead, create: isStaff, update: isStaff, delete: isStaff },
  defaultSort: "-publishedAt",
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: label("اطلاعات", "Details"),
          fields: [
            text("title", "عنوان", "Title", { required: true, localized: true }),
            sel(
              "category",
              "دسته",
              "Category",
              [
                ["mashups", "مشاپ‌ها", "Mashups"],
                ["podcasts", "پادکست‌ها", "Podcasts"],
                ["tracks", "ترک‌ها", "Tracks"],
                ["software", "نرم‌افزار", "Software"],
                ["plugins", "پلاگین و VST", "Plugins & VST"],
              ],
              { required: true, index: true },
            ),
            { name: "cover", type: "upload", relationTo: "media", label: label("تصویر کاور", "Cover image") },
            area("excerpt", "خلاصه کوتاه", "Short summary", { localized: true, admin: { rows: 2 } }),
            { name: "description", type: "richText", label: label("توضیحات کامل", "Full description"), localized: true },
          ],
        },
        {
          label: label("فایل", "File"),
          fields: [
            sel(
              "source",
              "منبع فایل",
              "File source",
              [
                ["file", "آپلود روی سایت", "Uploaded file"],
                ["link", "لینک خارجی", "External link"],
              ],
              { defaultValue: "file", required: true, admin: { layout: "horizontal" } },
            ),
            {
              name: "file",
              type: "upload",
              relationTo: "files",
              label: label("فایل", "File"),
              admin: { condition: (_: unknown, s: Record<string, unknown>) => s?.source === "file" },
            },
            text("externalUrl", "لینک دانلود", "Download URL", {
              admin: { condition: (_: unknown, s: Record<string, unknown>) => s?.source === "link" },
            }),
            text("fileSize", "حجم (مثلاً 128 MB)", "Size (e.g. 128 MB)"),
            {
              name: "preview",
              type: "upload",
              relationTo: "media",
              label: label("پیش‌نمایش صوتی (MP3 کوتاه)", "Audio preview (short MP3)"),
              filterOptions: { mimeType: { contains: "audio" } },
              admin: {
                condition: whenCat(audio),
                description: label("برای همه قابل پخش است، حتی اگر دانلود محدود باشد.", "Playable by everyone, even if the download is restricted."),
              },
            },
          ],
        },
        {
          label: label("مشخصات", "Specs"),
          fields: [
            text("genre", "سبک", "Genre", { admin: { condition: whenCat(audio) } }),
            num("bpm", "BPM", "BPM", { admin: { condition: whenCat(["mashups", "tracks"]) } }),
            text("musicalKey", "کلید (Key)", "Key", { admin: { condition: whenCat(["mashups", "tracks"]) } }),
            text("duration", "مدت", "Duration", { admin: { condition: whenCat(audio) } }),
            area("tracklist", "ترک‌لیست", "Tracklist", { localized: true, admin: { condition: whenCat(["podcasts"]) } }),
            text("version", "نسخه", "Version", { admin: { condition: whenCat(program) } }),
            sel(
              "platforms",
              "سیستم‌عامل",
              "Platforms",
              [
                ["windows", "Windows", "Windows"],
                ["mac", "macOS", "macOS"],
                ["linux", "Linux", "Linux"],
              ],
              { hasMany: true, admin: { condition: whenCat(program) } },
            ),
            tags("formats", "فرمت‌ها (VST3، AU، AAX…)", "Formats (VST3, AU, AAX…)", { admin: { condition: whenCat(["plugins"]) } }),
            text("license", "نوع مجوز (رایگان، دمو…)", "License (free, demo…)", { admin: { condition: whenCat(program) } }),
          ],
        },
      ],
    },
    slugField(),
    sel(
      "visibility",
      "چه کسی می‌تواند دانلود کند؟",
      "Who can download?",
      [
        ["public", "همه بازدیدکنندگان", "Everyone"],
        ["members", "فقط کاربران واردشده", "Logged-in members"],
        ["groups", "فقط گروه‌های انتخابی", "Selected groups only"],
      ],
      { required: true, defaultValue: "public", admin: { position: "sidebar" } },
    ),
    {
      name: "groups",
      type: "relationship",
      relationTo: "groups",
      hasMany: true,
      label: label("گروه‌های مجاز", "Allowed groups"),
      admin: { position: "sidebar", condition: (_: unknown, s: Record<string, unknown>) => s?.visibility === "groups" },
    },
    check("featured", "ویژه (نمایش در بالای لیست)", "Featured", { admin: { position: "sidebar" } }),
    { name: "publishedAt", type: "date", label: label("تاریخ انتشار", "Published at"), admin: { position: "sidebar" } },
    num("downloadCount", "تعداد دانلود", "Download count", { defaultValue: 0, admin: { position: "sidebar", readOnly: true } }),
  ],
  hooks: {
    beforeChange: [({ data }) => ({ ...data, publishedAt: data.publishedAt || new Date().toISOString() })],
  },
};
