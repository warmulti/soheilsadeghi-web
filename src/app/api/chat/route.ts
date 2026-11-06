import { NextResponse } from "next/server";
import { getPayload } from "payload";
import config from "@payload-config";
import { defaultLocale, isLocale, type Locale } from "@/i18n/config";
import { analyze, builtinReply, composeEntry, toTopic } from "@/lib/chat/engine";
import { activeProvider, askLLM, buildSystemPrompt, extractMarker } from "@/lib/chat/llm";
import { CHAT_LIMITS, type ChatApiResponse, type ChatMessage, type ChatModeResponse } from "@/lib/chat/types";
import { clientIp, rateLimit } from "@/lib/rate-limit";

export const maxDuration = 30;

/** Lets the widget show whether live AI answers are enabled. */
export function GET() {
  return NextResponse.json<ChatModeResponse>({ mode: activeProvider() ? "ai" : "builtin" });
}

/** Validates client history: known roles only, trimmed, capped, alternating, starting with the user. */
function sanitize(input: unknown): ChatMessage[] {
  if (!Array.isArray(input)) return [];
  const out: ChatMessage[] = [];
  for (const item of input.slice(-CHAT_LIMITS.history)) {
    if (typeof item !== "object" || item === null) continue;
    const { role, content } = item as Record<string, unknown>;
    if ((role !== "user" && role !== "assistant") || typeof content !== "string") continue;
    const text = content.trim().slice(0, CHAT_LIMITS.messageChars);
    if (!text) continue;
    const prev = out.at(-1);
    if (prev && prev.role === role) prev.content += `\n\n${text}`;
    else out.push({ role, content: text });
  }
  while (out[0]?.role === "assistant") out.shift();
  return out;
}

export async function POST(req: Request) {
  if (!rateLimit(`chat:${clientIp(req)}`, 20, 5 * 60_000)) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

  let body: { messages?: unknown; locale?: string } | null;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const messages = sanitize(body?.messages);
  if (messages.at(-1)?.role !== "user") return NextResponse.json({ error: "invalid_messages" }, { status: 400 });
  const locale: Locale = isLocale(body?.locale) ? body!.locale as Locale : defaultLocale;

  const payload = await getPayload({ config });
  const chat = await payload.findGlobal({ slug: "chat-settings", locale, depth: 0 });
  const analysis = analyze(messages, chat);
  const provider = activeProvider();

  if (provider) {
    try {
      const [settings, nav, home] = await Promise.all([
        payload.findGlobal({ slug: "settings", locale, depth: 0 }),
        payload.findGlobal({ slug: "navigation", locale, depth: 0 }),
        payload.findGlobal({ slug: "home", locale, depth: 0 }),
      ]);
      const system = buildSystemPrompt(
        {
          locale,
          brand: settings.brandName,
          localName: settings.nameLocal,
          telegram: settings.telegram,
          instagram: settings.instagram,
          pages: (nav.items ?? []).flatMap((i) => [{ label: i.label, href: i.href }, ...(i.children ?? []).map((c) => ({ label: c.label, href: c.href }))]),
          services: (home.services ?? []).map((s) => s.title),
          directLabel: chat.direct ?? "",
        },
        analysis.topic ? composeEntry(analysis.topic) : undefined,
      );
      const { text, escalate } = extractMarker(await askLLM(provider, system, messages));
      if (text) {
        return NextResponse.json<ChatApiResponse>({
          reply: text,
          // Hard rules from the engine always apply; the model can add its own escalation.
          escalate: analysis.escalate || escalate,
          reason: analysis.reason ?? (escalate ? "complex" : undefined),
          topic: toTopic(analysis.topic),
          source: provider,
        });
      }
    } catch (err) {
      console.error("[chat] AI provider failed — using built-in engine:", err);
    }
  }

  return NextResponse.json<ChatApiResponse>({ ...builtinReply(messages, chat, analysis), source: "builtin" });
}
