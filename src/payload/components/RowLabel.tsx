"use client";

import { useRowLabel } from "@payloadcms/ui";

const KEYS = ["title", "label", "name", "q", "year", "kbId", "group", "serviceId", "tag", "text"];

/** Array rows show "03 · Beatmatching" instead of "Row 03". */
export function RowLabel() {
  const { data, rowNumber } = useRowLabel<Record<string, unknown>>();
  const value = KEYS.map((k) => data?.[k]).find((v): v is string => typeof v === "string" && v.trim().length > 0);
  const n = String((rowNumber ?? 0) + 1).padStart(2, "0");
  const shown = value ? (value.length > 70 ? `${value.slice(0, 68)}…` : value) : "—";
  return (
    <span>
      {n} · {shown}
    </span>
  );
}
