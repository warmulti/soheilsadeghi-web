/**
 * Small builders for Payload field configs, so collections/globals read like a content outline.
 * Every label is bilingual because the admin panel itself can be used in Persian or English.
 */
import type { Field, Tab } from "payload";

type Opts = Record<string, unknown>;
const L = (fa: string, en: string) => ({ fa, en });

/** Shows the most meaningful sub-field (title, label, name, q…) instead of "Row 01". */
const rowLabel = { components: { RowLabel: "/payload/components/RowLabel#RowLabel" } };

export const text = (name: string, fa: string, en: string, o: Opts = {}): Field =>
  ({ name, type: "text", label: L(fa, en), ...o }) as Field;

export const area = (name: string, fa: string, en: string, o: Opts = {}): Field =>
  ({ name, type: "textarea", label: L(fa, en), ...o }) as Field;

export const num = (name: string, fa: string, en: string, o: Opts = {}): Field =>
  ({ name, type: "number", label: L(fa, en), ...o }) as Field;

export const check = (name: string, fa: string, en: string, o: Opts = {}): Field =>
  ({ name, type: "checkbox", label: L(fa, en), ...o }) as Field;

/** Select from [value, faLabel, enLabel] tuples. */
export const sel = (name: string, fa: string, en: string, options: [string, string, string][], o: Opts = {}): Field =>
  ({
    name,
    type: "select",
    label: L(fa, en),
    options: options.map(([value, lfa, len]) => ({ value, label: L(lfa, len) })),
    ...o,
  }) as Field;

/** Short repeated values (tags, keywords) — stored as string[]. */
export const tags = (name: string, fa: string, en: string, o: Opts = {}): Field =>
  ({ name, type: "text", hasMany: true, label: L(fa, en), ...o }) as Field;

export const arr = (name: string, fa: string, en: string, fields: Field[], o: Opts = {}): Field =>
  ({
    name,
    type: "array",
    label: L(fa, en),
    labels: { singular: L(fa, en), plural: L(fa, en) },
    fields,
    ...o,
    admin: { initCollapsed: true, ...rowLabel, ...((o.admin as Opts) ?? {}) },
  }) as Field;

/** List of sentences/paragraphs — stored as { text }[]. */
export const lines = (name: string, fa: string, en: string, o: Opts = {}): Field =>
  arr(name, fa, en, [area("text", "متن", "Text", { required: true, admin: { rows: 2 } })], o);

export const group = (name: string, fa: string, en: string, fields: Field[], o: Opts = {}): Field =>
  ({ name, type: "group", label: L(fa, en), fields, ...o }) as Field;

export const tab = (fa: string, en: string, fields: Field[], o: Opts = {}): Tab =>
  ({ label: L(fa, en), fields, ...o }) as Tab;

export const tabs = (...items: Tab[]): Field => ({ type: "tabs", tabs: items });

export const label = L;

/**
 * Marks every data field as localized (one value per language). Walks through presentational
 * containers (unnamed tabs, rows, collapsibles) but not into arrays/groups — those are localized
 * as a whole, so each language keeps its own list. Fields with an explicit `localized: false` stay shared.
 */
export function localizeAll(fields: Field[]): Field[] {
  return fields.map((f) => {
    const field = f as Field & { localized?: boolean; name?: string; tabs?: Tab[]; fields?: Field[] };
    if (field.type === "tabs") {
      return { ...field, tabs: field.tabs!.map((t) => ({ ...t, fields: localizeAll(t.fields) })) } as Field;
    }
    if ((field.type === "row" || field.type === "collapsible") && field.fields) {
      return { ...field, fields: localizeAll(field.fields) } as Field;
    }
    if (field.type === "ui" || field.localized === false) return field;
    return { ...field, localized: true } as Field;
  });
}

/** URL-safe slug that keeps Persian letters: "میکس شب یلدا" → "میکس-شب-یلدا". */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[‌‍]/g, "-")
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

/** Slug field that fills itself from `title` when left empty. */
export const slugField = (): Field =>
  ({
    name: "slug",
    type: "text",
    label: L("نامک (آدرس)", "Slug"),
    unique: true,
    index: true,
    admin: { position: "sidebar", description: L("خالی بگذارید تا از عنوان ساخته شود.", "Leave empty to generate from the title.") },
    hooks: {
      beforeValidate: [
        ({ value, data, siblingData }: { value?: unknown; data?: Record<string, unknown>; siblingData?: Record<string, unknown> }) => {
          if (typeof value === "string" && value.trim()) return slugify(value);
          const title = (siblingData?.title ?? data?.title) as unknown;
          const source = typeof title === "string" ? title : typeof title === "object" && title ? Object.values(title)[0] : "";
          return typeof source === "string" && source ? slugify(source) : value;
        },
      ],
    },
  }) as Field;
