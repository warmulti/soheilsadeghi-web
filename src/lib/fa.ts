const FA_DIGITS = "۰۱۲۳۴۵۶۷۸۹";

/** Latin digits → Persian digits. Pure string mapping, so server and client output is identical. */
export function faNum(value: number | string): string {
  return String(value).replace(/\d/g, (d) => FA_DIGITS[Number(d)]);
}

/** Two-digit index label: 1 → "01". */
export function pad2(n: number): string {
  return String(n).padStart(2, "0");
}
