import type { Locale } from "@/i18n/config";
import type { ChatMessage } from "./types";

export type Provider = "anthropic" | "gemini";

/** The model appends this marker when the case should go to Soheil directly. */
export const ESCALATE_MARKER = "[[ESCALATE]]";

const TIMEOUT_MS = 25_000;

/**
 * Picks the live AI provider from env. `CHAT_PROVIDER` forces one when both keys exist;
 * otherwise Anthropic wins, then Gemini. Returns null → built-in engine only.
 */
export function activeProvider(): Provider | null {
  const hasAnthropic = Boolean(process.env.ANTHROPIC_API_KEY);
  const hasGemini = Boolean(process.env.GEMINI_API_KEY);
  const preferred = process.env.CHAT_PROVIDER?.toLowerCase();
  if (preferred === "gemini" && hasGemini) return "gemini";
  if (preferred === "anthropic" && hasAnthropic) return "anthropic";
  if (hasAnthropic) return "anthropic";
  if (hasGemini) return "gemini";
  return null;
}

export type PromptContext = {
  locale: Locale;
  brand: string;
  localName: string;
  telegram?: string | null;
  instagram?: string | null;
  pages: { label: string; href: string }[];
  services: string[];
  directLabel: string;
};

export function buildSystemPrompt(ctx: PromptContext, reference?: string): string {
  const language =
    ctx.locale === "fa"
      ? "Always answer in fluent, warm, natural Persian (Farsi)."
      : "Always answer in clear, friendly English (the visitor is using the English version of the site).";
  const prefix = ctx.locale === "fa" ? "" : "/en";
  return [
    `You are the official troubleshooting assistant on the website of ${ctx.brand} (${ctx.localName}), a DJ, turntablist and DJ / Ableton Live educator. Visitors use you for free.`,
    `${language} Keep software names, menu paths and technical terms in English (e.g. Preferences > Audio, Buffer Size, ASIO, Warp Marker).`,
    "Scope: DJ software (Rekordbox, Serato DJ, Traktor, VirtualDJ, Engine DJ, djay), DJ controllers, mixers, players and turntables, audio drivers and latency, Ableton Live (warping, edits, mashups, podcast recording/mixing/mastering), and gear or laptop buying advice. Politely decline anything unrelated.",
    "Format: one short opening sentence, then numbered steps (1. 2. 3.) ordered from most likely and easiest to hardest. Put the key action of each step in **bold**. Stay under about 200 words. No tables, headings or HTML. If key details are missing (software, device model, Windows or Mac), ask for them briefly at the end.",
    "Be honest: don't invent course prices or schedules, don't claim certainty about hardware faults you can't see, and include electrical safety warnings where relevant (never remove a ground pin, unplug damaged or wet gear).",
    `You may link site pages with markdown [label](path): ${ctx.pages.map((p) => `${p.label} → ${prefix}${p.href === "/" ? "" : p.href}`).join("; ")}.`,
    `Services offered: ${ctx.services.join(" | ")}.${ctx.telegram ? ` Direct contact: Telegram @${ctx.telegram}` : ""}${ctx.instagram ? `, Instagram @${ctx.instagram}` : ""}.`,
    `Escalation: if the problem involves physical damage or repair, course registration, prices or booking, complex custom audio routing or streaming setups, or the user says your steps did not fix it, tell them they can send a ready-made summary to Soheil with the «${ctx.directLabel}» button — and end your reply with the exact marker ${ESCALATE_MARKER} on its own line.`,
    reference
      ? `Reference notes from Soheil's own knowledge base for this question. Prefer these steps and adapt them to the user's details:\n---\n${reference}\n---`
      : "",
  ]
    .filter(Boolean)
    .join("\n\n");
}

export function extractMarker(raw: string): { text: string; escalate: boolean } {
  return { text: raw.split(ESCALATE_MARKER).join("").trim(), escalate: raw.includes(ESCALATE_MARKER) };
}

export function askLLM(provider: Provider, system: string, messages: ChatMessage[]): Promise<string> {
  return provider === "anthropic" ? askAnthropic(system, messages) : askGemini(system, messages);
}

async function askAnthropic(system: string, messages: ChatMessage[]): Promise<string> {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY ?? "",
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({ model: process.env.ANTHROPIC_MODEL || "claude-opus-5-5", max_tokens: 1024, system, messages }),
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  if (!res.ok) throw new Error(`Anthropic API ${res.status}: ${(await res.text()).slice(0, 300)}`);
  const data = (await res.json()) as { content?: { type: string; text?: string }[] };
  return (data.content ?? [])
    .filter((b) => b.type === "text")
    .map((b) => b.text ?? "")
    .join("")
    .trim();
}

async function askGemini(system: string, messages: ChatMessage[]): Promise<string> {
  const model = process.env.GEMINI_MODEL || "gemini-flash-latest";
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`, {
    method: "POST",
    headers: { "content-type": "application/json", "x-goog-api-key": process.env.GEMINI_API_KEY ?? "" },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: system }] },
      contents: messages.map((m) => ({ role: m.role === "assistant" ? "model" : "user", parts: [{ text: m.content }] })),
      // Generous limit: on "thinking" models the reasoning tokens count toward it.
      generationConfig: { maxOutputTokens: 2048, temperature: 0.4 },
    }),
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  if (!res.ok) throw new Error(`Gemini API ${res.status}: ${(await res.text()).slice(0, 300)}`);
  const data = (await res.json()) as { candidates?: { content?: { parts?: { text?: string; thought?: boolean }[] } }[] };
  return (data.candidates?.[0]?.content?.parts ?? [])
    .filter((p) => !p.thought)
    .map((p) => p.text ?? "")
    .join("")
    .trim();
}
