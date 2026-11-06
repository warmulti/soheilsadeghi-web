import path from "path";
import type { CollectionConfig } from "payload";
import { isStaff } from "../access.ts";
import { label, text } from "../fields.ts";

/**
 * Private downloadable files (mashups, podcasts, installers, course videos…).
 * Never served directly: visitors get them through /api/file/:id, which checks the access rules
 * of the download or course material that uses the file.
 */
export const Files: CollectionConfig = {
  slug: "files",
  labels: { singular: label("فایل", "File"), plural: label("فایل‌های دانلودی", "Download files") },
  admin: {
    group: label("دانلود و آموزش", "Downloads & learning"),
    defaultColumns: ["filename", "title", "mimeType", "filesize", "updatedAt"],
    description: label(
      "فایل‌های خصوصی؛ فقط از طریق صفحه دانلود یا محتوای دوره و طبق سطح دسترسی ارائه می‌شوند. برای فایل‌های خیلی بزرگ از لینک خارجی استفاده کنید.",
      "Private files, served only through downloads/materials according to their access rules. Use an external link for very large files.",
    ),
  },
  access: { read: isStaff, create: isStaff, update: isStaff, delete: isStaff },
  // Relative to the app root (cwd) — the bundled config lives elsewhere in production.
  upload: { staticDir: path.resolve(process.cwd(), "files") },
  fields: [text("title", "عنوان (اختیاری)", "Title (optional)")],
};
