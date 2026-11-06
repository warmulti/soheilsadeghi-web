import type { Field, GlobalConfig } from "payload";
import { anyone, isStaff } from "../access.ts";
import { label, localizeAll } from "../fields.ts";

type GroupKey = "pages" | "settings";
const groups = {
  pages: label("محتوای صفحات", "Page content"),
  settings: label("تنظیمات سایت", "Site settings"),
};

/** A content global: public read, staff edit, version history, every field localized. */
export function contentGlobal(
  slug: string,
  fa: string,
  en: string,
  group: GroupKey,
  fields: Field[],
  opts: { preview?: string; description?: [string, string] } = {},
): GlobalConfig {
  return {
    slug,
    label: label(fa, en),
    access: { read: anyone, update: isStaff },
    versions: { max: 20 },
    admin: {
      group: groups[group],
      ...(opts.preview ? { preview: () => opts.preview! } : {}),
      ...(opts.description ? { description: label(...opts.description) } : {}),
    },
    fields: localizeAll(fields),
  };
}
