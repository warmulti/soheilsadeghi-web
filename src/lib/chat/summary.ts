/**
 * Builds the pre-filled message sent to Soheil on Telegram / WhatsApp, so the visitor never has
 * to explain their problem twice. Runs in the browser; labels come from the CMS (per language).
 */
import type { ChatSetting } from "@/payload-types";
import { normalizeFa } from "./normalize";
import type { ChatMessage, EscalationReason } from "./types";

type Labels = NonNullable<ChatSetting["summary"]>;

const SOFTWARE: [RegExp, string][] = [
  [/rekordbox|رکورد ?باکس/i, "Rekordbox"],
  [/serato|سراتو/i, "Serato DJ"],
  [/traktor|تراکتور/i, "Traktor"],
  [/virtual ?dj|ویرچوال ?دی ?جی/i, "VirtualDJ"],
  [/engine ?dj/i, "Engine DJ"],
  [/\bdjay\b/i, "djay"],
  [/ableton|آبلتون|ابلتون/i, "Ableton Live"],
  [/windows|ویندوز/i, "Windows"],
  [/mac ?os|macbook|مک ?بوک|\bmac\b|(?:^|[\s،.])مک(?=$|[\s،.])/i, "macOS"],
];

/** Hardware model numbers such as DDJ-FLX4, XDJ-RX3, DJM-S11, Rane ONE, SC Live 4. */
const MODELS =
  /\b(?:ddj|xdj|cdj|djm|hdj)[- ]?[a-z0-9]{2,8}(?:-[a-z0-9]{1,3})?\b|\b(?:flx|grv|rev|rx|sb)\d\b|\bmixtrack(?: pro)?(?: fx| 3)?\b|\binpulse ?\d{3}\b|\brane ?(?:one|seventy|twelve)\b|\bsc ?live ?\d\b|\bprime ?(?:go|\d)\b|\bsl-?1200\w*\b/gi;

export function extractGear(text: string): string[] {
  const found = new Map<string, string>();
  for (const [re, label] of SOFTWARE) if (re.test(text)) found.set(label.toLowerCase(), label);
  for (const m of text.match(MODELS) ?? []) {
    const label = m.toUpperCase().replace(/\s+/g, " ");
    found.set(label.toLowerCase().replace(/[- ]/g, ""), label);
  }
  return [...found.values()];
}

const clip = (s: string, n: number) => (s.length > n ? `${s.slice(0, n - 1).trimEnd()}…` : s);

export function buildSummary({
  messages,
  topics,
  reason,
  labels,
  unresolvedSignals = [],
}: {
  messages: ChatMessage[];
  topics: string[];
  reason?: EscalationReason;
  labels: Labels;
  unresolvedSignals?: string[] | null;
}): string {
  const userTexts = messages
    .filter((m) => m.role === "user")
    .map((m) => m.content.replace(/\s+/g, " ").trim())
    .filter(Boolean);

  const isUnresolved = (text: string) => {
    const t = normalizeFa(text);
    return (unresolvedSignals ?? []).some((w) => t.includes(normalizeFa(w)));
  };

  const lines = [labels.greeting ?? "", "", `${labels.topic}: ${topics.length ? topics.join(" / ") : labels.defaultTopic}`];

  if (userTexts.length === 0) {
    lines.push(`${labels.problem}: ${labels.noMessages}`);
  } else {
    lines.push(`${labels.problem}: ${clip(userTexts[0], 320)}`);
    // Short follow-ups ("ok", "not solved") add nothing for Soheil — "unresolved" is stated below.
    const extra = userTexts.slice(1).filter((t) => t.length >= 12 && !(t.length < 60 && isUnresolved(t)));
    if (extra.length) lines.push(`${labels.details}: ${clip(extra.join(" / "), 360)}`);
  }

  const gear = extractGear(userTexts.join(" "));
  if (gear.length) lines.push(`${labels.gear}: ${gear.join(", ")}`);
  if (reason === "unresolved" && labels.tried) lines.push("", labels.tried);

  return lines.join("\n");
}
