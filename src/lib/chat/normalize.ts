/**
 * Normalises Persian/English text for keyword matching:
 * Arabic → Persian letters, Persian/Arabic digits → Latin, ZWNJ and punctuation → spaces.
 * Keywords and user input go through the same function, so «خش‌خش», «خش خش» and «خشخش»
 * all meet in the middle.
 */
export function normalizeFa(input: string): string {
  return input
    .toLowerCase()
    .replace(/[يى]/g, "ی")
    .replace(/ك/g, "ک")
    .replace(/[ۀة]/g, "ه")
    .replace(/[أإآ]/g, "ا")
    .replace(/[ً-ٰٟ]/g, "")
    .replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 0x06f0))
    .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 0x0660))
    .replace(/[‌‍‎‏]/g, " ")
    .replace(/[،؛؟«»]/g, " ")
    .replace(/[^؀-ۿa-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
