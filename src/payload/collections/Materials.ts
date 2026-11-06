import type { CollectionConfig } from "payload";
import { isStaff, materialsRead } from "../access.ts";
import { area, label, num, sel, text } from "../fields.ts";

/** Course content (lessons, videos, handouts) visible to students by group. */
export const Materials: CollectionConfig = {
  slug: "materials",
  labels: { singular: label("محتوای آموزشی", "Course material"), plural: label("محتوای دوره‌ها", "Course materials") },
  admin: {
    group: label("دانلود و آموزش", "Downloads & learning"),
    useAsTitle: "title",
    defaultColumns: ["title", "course", "audience", "groups", "_status"],
    description: label(
      "جلسات، ویدیوها و جزوه‌ها. هنرجو فقط محتوای گروه‌های خودش را در «پنل هنرجو» می‌بیند.",
      "Lessons, videos and handouts. Students only see material for their own groups in their panel.",
    ),
  },
  versions: { drafts: true, maxPerDoc: 20 },
  access: { read: materialsRead, create: isStaff, update: isStaff, delete: isStaff },
  defaultSort: "order",
  fields: [
    text("title", "عنوان", "Title", { required: true, localized: true }),
    sel("course", "دوره", "Course", [
      ["djing-beginner", "DJing مبتدی", "DJing Beginner"],
      ["djing-pro", "DJing حرفه‌ای", "DJing Pro"],
      ["djing-masterclass", "Master Class", "Master Class"],
      ["ableton", "Ableton Live", "Ableton Live"],
      ["general", "عمومی", "General"],
    ], { required: true, defaultValue: "general" }),
    area("summary", "خلاصه", "Summary", { localized: true, admin: { rows: 2 } }),
    { name: "body", type: "richText", label: label("متن جلسه", "Lesson content"), localized: true },
    text("videoUrl", "لینک ویدیو (YouTube یا آپارات)", "Video link (YouTube or Aparat)"),
    {
      name: "video",
      type: "upload",
      relationTo: "files",
      label: label("یا فایل ویدیو (MP4)", "…or a video file (MP4)"),
      filterOptions: { mimeType: { contains: "video" } },
    },
    {
      name: "attachments",
      type: "upload",
      relationTo: "files",
      hasMany: true,
      label: label("فایل‌های ضمیمه", "Attachments"),
    },
    sel(
      "audience",
      "قابل مشاهده برای",
      "Visible to",
      [
        ["groups", "گروه‌های انتخابی", "Selected groups"],
        ["allStudents", "همه هنرجوها", "All students"],
      ],
      { required: true, defaultValue: "groups", admin: { position: "sidebar" } },
    ),
    {
      name: "groups",
      type: "relationship",
      relationTo: "groups",
      hasMany: true,
      label: label("گروه‌ها", "Groups"),
      admin: { position: "sidebar", condition: (_: unknown, s: Record<string, unknown>) => s?.audience !== "allStudents" },
    },
    num("order", "ترتیب نمایش", "Sort order", { defaultValue: 0, admin: { position: "sidebar" } }),
  ],
};
