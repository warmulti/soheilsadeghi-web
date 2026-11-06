/**
 * Built-in DJ troubleshooting engine. Works fully offline from the knowledge base edited in the
 * admin panel (Chat settings → Knowledge base), one per language.
 * When an AI key is configured, `analyze()` still runs: its matched entry is given to the model
 * as reference notes, and its hard escalation rules always apply.
 */
import { normalizeFa } from "./normalize";
import type { ChatMessage, ChatTopic, EscalationReason, KbEntry, Knowledge } from "./types";

/** Minimum keyword score for a topic to count as a match. */
const MIN_SCORE = 2;
/** A hardware-damage score this high wins over any other topic (safety first). */
const HARDWARE_PRIORITY = 3;

type Keyword = { kw: string; weight: number; whole: boolean };
type Compiled = { entry: KbEntry; keywords: Keyword[] };

/**
 * Multi-word phrases are strong evidence. Short Latin tokens (dvs, obs, hum) must match a whole
 * word and count fully; short Persian tokens match inside words, so they only count a little
 * («ارت» also appears inside «کارت»).
 */
function toKeyword(kw: string): Keyword {
  const whole = /^[a-z0-9]{1,3}$/.test(kw);
  const weight = kw.includes(" ") ? 3 : whole ? 2 : kw.length <= 3 ? 1 : 2;
  return { kw, weight, whole };
}

const matches = (paddedText: string, k: Keyword) => (k.whole ? paddedText.includes(` ${k.kw} `) : paddedText.includes(k.kw));

const compiledCache = new WeakMap<object, Compiled[]>();

function compile(k: Knowledge): Compiled[] {
  const key = k.kb ?? [];
  let c = compiledCache.get(key);
  if (!c) {
    c = key.map((entry) => ({
      entry,
      keywords: [...new Set((entry.keywords ?? []).map(normalizeFa))].filter(Boolean).map(toKeyword),
    }));
    compiledCache.set(key, c);
  }
  return c;
}

const containsAny = (normalizedText: string, words: string[] | null | undefined) =>
  (words ?? []).some((w) => {
    const n = normalizeFa(w);
    return n.length > 0 && normalizedText.includes(n);
  });

const escalationOf = (e: KbEntry): EscalationReason | undefined =>
  e.escalate && e.escalate !== "none" ? (e.escalate as EscalationReason) : undefined;

/** Topics ranked by keyword score (ties keep knowledge-base order). */
export function scoreTopics(text: string, k: Knowledge): { entry: KbEntry; score: number }[] {
  const t = ` ${normalizeFa(text)} `;
  return compile(k)
    .map((c) => ({ entry: c.entry, score: c.keywords.reduce((sum, x) => (matches(t, x) ? sum + x.weight : sum), 0) }))
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score);
}

export type Analysis = {
  kind: "topic" | "unresolved" | "followup" | "hello" | "thanks" | "unknown";
  topic?: KbEntry;
  escalate: boolean;
  reason?: EscalationReason;
};

function bestTopic(text: string, k: Knowledge): KbEntry | undefined {
  const scores = scoreTopics(text, k);
  const hardware = scores.find((s) => escalationOf(s.entry) === "hardware" && s.score >= HARDWARE_PRIORITY);
  if (hardware) return hardware.entry;
  return scores[0] && scores[0].score >= MIN_SCORE ? scores[0].entry : undefined;
}

export function analyze(history: ChatMessage[], k: Knowledge): Analysis {
  const users = history.filter((m) => m.role === "user");
  const last = users.at(-1)?.content ?? "";
  const lastNorm = normalizeFa(last);
  const answeredBefore = history.some((m) => m.role === "assistant");

  const previousTopic = () => {
    for (let i = users.length - 2; i >= 0; i--) {
      const t = bestTopic(users[i].content, k);
      if (t) return t;
    }
    return undefined;
  };

  if (answeredBefore && containsAny(lastNorm, k.signals?.unresolved)) {
    return { kind: "unresolved", topic: previousTopic(), escalate: true, reason: "unresolved" };
  }

  const topic = bestTopic(last, k);
  if (topic) {
    const reason = escalationOf(topic);
    return { kind: "topic", topic, escalate: Boolean(reason), reason };
  }

  if (containsAny(lastNorm, k.signals?.thanks)) return { kind: "thanks", escalate: false };
  if (lastNorm.split(" ").length <= 4 && containsAny(lastNorm, k.signals?.hello)) return { kind: "hello", escalate: false };

  const prev = previousTopic();
  if (prev) return { kind: "followup", topic: prev, escalate: false };

  return { kind: "unknown", escalate: false };
}

/** Knowledge-base entry → chat text (intro, numbered steps, closing note). */
export function composeEntry(entry: KbEntry): string {
  const steps = (entry.steps ?? []).map((s, i) => `${i + 1}. ${s.text}`).join("\n");
  return [entry.intro, steps, entry.outro].filter(Boolean).join("\n\n");
}

export const toTopic = (entry?: KbEntry): ChatTopic | undefined => (entry ? { id: entry.kbId, title: entry.title } : undefined);

export type EngineResult = { reply: string; escalate: boolean; reason?: EscalationReason; topic?: ChatTopic };

export function builtinReply(history: ChatMessage[], k: Knowledge, a: Analysis = analyze(history, k)): EngineResult {
  const topic = toTopic(a.topic);
  const r = k.replies ?? {};
  switch (a.kind) {
    case "topic":
      return { reply: composeEntry(a.topic!), escalate: a.escalate, reason: a.reason, topic };
    case "unresolved":
      return { reply: r.unresolved ?? "", escalate: true, reason: "unresolved", topic };
    case "followup":
      // Without an LLM we can't reason about free-form details, so hand over with full context.
      return { reply: r.followup ?? "", escalate: true, reason: "complex", topic };
    case "hello":
      return { reply: r.hello ?? "", escalate: false };
    case "thanks":
      return { reply: r.thanks ?? "", escalate: false };
    default:
      return { reply: r.fallback ?? "", escalate: false };
  }
}
