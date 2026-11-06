import path from "path";
import type { CollectionConfig } from "payload";
import { anyone, isStaff } from "../access.ts";
import { label, text } from "../fields.ts";

/** Public media: images (with generated sizes) and audio previews. */
export const Media: CollectionConfig = {
  slug: "media",
  labels: { singular: label("رسانه", "Media"), plural: label("کتابخانه رسانه", "Media library") },
  admin: { group: label("محتوا", "Content"), defaultColumns: ["filename", "alt", "mimeType", "filesize"] },
  access: { read: anyone, create: isStaff, update: isStaff, delete: isStaff },
  upload: {
    // Relative to the app root (cwd) — the bundled config lives elsewhere in production.
    staticDir: path.resolve(process.cwd(), "media"),
    mimeTypes: ["image/*", "audio/*"],
    imageSizes: [
      { name: "thumb", width: 400, height: 400, position: "centre" },
      { name: "card", width: 900 },
    ],
    adminThumbnail: "thumb",
    formatOptions: { format: "webp", options: { quality: 84 } },
  },
  fields: [text("alt", "متن جایگزین (توضیح تصویر)", "Alt text", { localized: true })],
};
