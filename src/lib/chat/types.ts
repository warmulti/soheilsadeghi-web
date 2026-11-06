import type { ChatSetting } from "@/payload-types";

export type EscalationReason = "hardware" | "registration" | "routing" | "unresolved" | "complex" | "manual";

export type ChatRole = "user" | "assistant";

export type ChatMessage = { role: ChatRole; content: string };

export type ChatSource = "anthropic" | "gemini" | "builtin";

export type ChatTopic = { id: string; title: string };

export type KbEntry = NonNullable<ChatSetting["kb"]>[number];

/** What the built-in engine needs from the CMS (chat settings global). */
export type Knowledge = Pick<ChatSetting, "kb" | "signals" | "replies">;

/** Response body of POST /api/chat */
export type ChatApiResponse = {
  reply: string;
  escalate: boolean;
  reason?: EscalationReason;
  topic?: ChatTopic;
  source: ChatSource;
};

/** Response body of GET /api/chat */
export type ChatModeResponse = { mode: "ai" | "builtin" };

export const CHAT_LIMITS = {
  /** Max messages sent per request (older ones are dropped). */
  history: 12,
  /** Max characters per message. */
  messageChars: 1500,
} as const;
