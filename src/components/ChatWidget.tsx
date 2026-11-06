"use client";

import { useEffect, useRef, useState } from "react";
import type { Locale } from "@/i18n/config";
import type { ChatSetting } from "@/payload-types";
import { buildSummary } from "@/lib/chat/summary";
import { telegramUrl, whatsappUrl } from "@/lib/links";
import { prefersReducedMotion } from "@/lib/motion";
import {
  CHAT_LIMITS,
  type ChatApiResponse,
  type ChatMessage,
  type ChatModeResponse,
  type EscalationReason,
} from "@/lib/chat/types";
import MessageText from "./chat/MessageText";
import { ChatVinylIcon, CheckIcon, CloseIcon, CopyIcon, SendIcon, SparkIcon, TelegramIcon, WhatsAppIcon } from "./icons";

type UiMessage = ChatMessage & {
  id: number;
  /** Shown in the UI only, never sent back to the API (e.g. network errors). */
  local?: boolean;
};

type Handoff = { reason: EscalationReason; summary: string };

type Props = {
  locale: Locale;
  chat: ChatSetting;
  contact: { telegram: string; whatsapp: string };
  listStyle: "persian" | "decimal";
};

/**
 * Floating AI troubleshooting assistant. Texts and knowledge base come from the CMS (per language).
 * Hard cases open a hand-off card with an editable, pre-filled summary for Telegram / WhatsApp.
 */
export default function ChatWidget({ locale, chat, contact, listStyle }: Props) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<UiMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [topics, setTopics] = useState<string[]>([]);
  const [handoff, setHandoff] = useState<Handoff | null>(null);
  const [mode, setMode] = useState<ChatModeResponse["mode"] | null>(null);
  const [copied, setCopied] = useState(false);

  const nextId = useRef(1);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open || mode) return;
    fetch("/api/chat")
      .then((r) => r.json() as Promise<ChatModeResponse>)
      .then((d) => setMode(d.mode))
      .catch(() => setMode("builtin"));
  }, [open, mode]);

  useEffect(() => {
    if (!open) return;
    const t = window.setTimeout(() => inputRef.current?.focus({ preventScroll: true }), 150);
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      launcherRef.current?.focus();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: prefersReducedMotion() ? "auto" : "smooth" });
  }, [messages, loading, handoff]);

  const startHandoff = (reason: EscalationReason, history: ChatMessage[], topicList: string[]) => {
    setHandoff({
      reason,
      summary: buildSummary({
        messages: history,
        topics: topicList,
        reason,
        labels: chat.summary ?? {},
        unresolvedSignals: chat.signals?.unresolved,
      }),
    });
    setCopied(false);
  };

  async function send(text: string) {
    const content = text.trim().slice(0, CHAT_LIMITS.messageChars);
    if (!content || loading) return;

    const userMsg: UiMessage = { id: nextId.current++, role: "user", content };
    const history = [...messages, userMsg];
    setMessages(history);
    setInput("");
    setHandoff(null);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          locale,
          messages: history
            .filter((m) => !m.local)
            .slice(-CHAT_LIMITS.history)
            .map(({ role, content: c }) => ({ role, content: c })),
        }),
      });
      if (!res.ok) throw new Error(`chat ${res.status}`);
      const data = (await res.json()) as ChatApiResponse;

      const reply: UiMessage = { id: nextId.current++, role: "assistant", content: data.reply };
      const all = [...history, reply];
      const nextTopics = data.topic && !topics.includes(data.topic.title) ? [...topics, data.topic.title] : topics;
      setMessages(all);
      setTopics(nextTopics);
      if (data.escalate) startHandoff(data.reason ?? "complex", all, nextTopics);
    } catch {
      setMessages((m) => [...m, { id: nextId.current++, role: "assistant", content: chat.error ?? "", local: true }]);
    } finally {
      setLoading(false);
    }
  }

  const onInputKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      void send(input);
    }
  };

  const copySummary = async () => {
    if (!handoff) return;
    try {
      await navigator.clipboard.writeText(handoff.summary);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked — the text is still selectable in the textarea */
    }
  };

  const showPresets = messages.length === 0 && !loading;

  return (
    <>
      {/* ── Launcher (bottom corner on the reading-end side) ── */}
      <button
        ref={launcherRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="chat-panel"
        aria-label={open ? (chat.close ?? "") : (chat.title ?? "")}
        className={`fixed end-5 bottom-5 z-40 flex items-center gap-3 rounded-full transition duration-300 ${
          open ? "max-sm:pointer-events-none max-sm:opacity-0" : ""
        }`}
      >
        <span className="relative grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br from-cyan to-neon text-ink shadow-[0_10px_40px_rgba(168,85,247,.55)]">
          {!open && <span className="ping-soft absolute inset-0 rounded-full bg-neon" aria-hidden="true" />}
          <span className="relative">{open ? <CloseIcon className="h-6 w-6" /> : <ChatVinylIcon className="h-7 w-7" />}</span>
        </span>
        {!open && <span className="glass hidden rounded-full px-4 py-2 text-sm text-white/85 md:block">{chat.launcher}</span>}
      </button>

      {/* ── Panel ── */}
      <div
        id="chat-panel"
        role="dialog"
        aria-labelledby="chat-title"
        inert={!open}
        className={`fixed inset-x-3 top-20 bottom-3 z-40 flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-ink-2/95 shadow-[0_30px_100px_rgba(0,0,0,.6),0_0_60px_rgba(168,85,247,.15)] backdrop-blur-xl transition-[opacity,scale,translate] duration-300 ltr:origin-bottom-right rtl:origin-bottom-left sm:inset-x-auto sm:end-5 sm:top-auto sm:bottom-24 sm:h-[min(640px,calc(100dvh-8.5rem))] sm:w-[400px] ${
          open ? "visible scale-100 opacity-100" : "invisible translate-y-3 scale-95 opacity-0"
        }`}
      >
        <div className="flex items-center gap-3 border-b border-white/10 bg-white/[0.03] px-5 py-4">
          <span className="spin-slow grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[repeating-radial-gradient(circle,#18181d_0_2px,#0b0b0e_2px_4px)] ring-1 ring-white/10">
            <span className="h-4 w-4 rounded-full bg-gradient-to-br from-cyan to-neon" />
          </span>
          <div className="min-w-0 flex-1">
            <p id="chat-title" className="font-bold text-white">
              {chat.title}
            </p>
            <p className="flex items-center gap-1.5 text-[11px] text-white/50">
              <span className={`h-1.5 w-1.5 rounded-full ${mode === "ai" ? "bg-cyan shadow-[0_0_8px_#22d3ee]" : "bg-emerald-400"}`} />
              {mode === "ai" ? chat.modeAi : chat.modeBuiltin}
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              launcherRef.current?.focus();
            }}
            className="grid h-9 w-9 place-items-center rounded-full text-white/60 transition hover:bg-white/10 hover:text-white"
            aria-label={chat.close ?? ""}
          >
            <CloseIcon />
          </button>
        </div>

        <div ref={listRef} data-lenis-prevent className="chat-scroll flex-1 space-y-4 overflow-y-auto overscroll-contain px-4 py-5" aria-live="polite">
          <Bubble role="assistant">
            <p>{chat.greeting}</p>
          </Bubble>

          {showPresets && (
            <div className="space-y-2 pt-1">
              <p className="text-xs text-white/40">{chat.presetsTitle}</p>
              <div className="flex flex-col items-start gap-2">
                {(chat.presets ?? []).map((p) => (
                  <button
                    key={p.id ?? p.text}
                    type="button"
                    onClick={() => void send(p.text)}
                    className="rounded-2xl border border-neon/25 bg-neon/[0.07] px-3.5 py-2 text-start text-[13px] leading-6 text-white/85 transition hover:border-neon/60 hover:bg-neon/15"
                  >
                    {p.text}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m) => (
            <Bubble key={m.id} role={m.role} error={m.local}>
              {m.role === "assistant" ? (
                <MessageText text={m.content} locale={locale} listStyle={listStyle} />
              ) : (
                <p className="whitespace-pre-wrap">{m.content}</p>
              )}
            </Bubble>
          ))}

          {loading && (
            <Bubble role="assistant">
              <span className="flex items-center gap-1.5 py-1" aria-label={chat.typing ?? ""}>
                {[0, 1, 2].map((i) => (
                  <span key={i} className="chat-dot h-1.5 w-1.5 rounded-full bg-neon" style={{ animationDelay: `${i * 0.15}s` }} />
                ))}
              </span>
            </Bubble>
          )}

          {handoff && (
            <div className="animate-fade-up rounded-2xl border border-cyan/25 bg-gradient-to-b from-cyan/[0.08] to-neon/[0.06] p-4">
              <p className="flex items-center gap-2 text-sm font-bold text-white">
                <SparkIcon className="h-4 w-4 text-cyan" />
                {chat.summaryTitle}
              </p>
              <p className="mt-1.5 text-xs leading-6 text-white/60">{chat.escalation?.[handoff.reason]}</p>
              <label htmlFor="chat-summary" className="sr-only">
                {chat.summaryTitle}
              </label>
              <textarea
                id="chat-summary"
                value={handoff.summary}
                onChange={(e) => setHandoff({ ...handoff, summary: e.target.value })}
                rows={7}
                className="field mt-3 resize-y text-[13px] leading-6"
                data-lenis-prevent
              />
              <p className="mt-2 text-[11px] leading-5 text-white/40">{chat.summaryHint}</p>
              <div className="mt-3 grid grid-cols-2 gap-2">
                {contact.telegram && (
                  <a href={telegramUrl(contact.telegram, handoff.summary)} target="_blank" rel="noopener noreferrer" className="btn-neon px-3 py-2.5 text-[13px]">
                    <TelegramIcon className="h-4 w-4" />
                    {chat.sendTelegram}
                  </a>
                )}
                {contact.whatsapp && (
                  <a href={whatsappUrl(contact.whatsapp, handoff.summary)} target="_blank" rel="noopener noreferrer" className="btn-ghost px-3 py-2.5 text-[13px]">
                    <WhatsAppIcon className="h-4 w-4" />
                    {chat.sendWhatsapp}
                  </a>
                )}
              </div>
              <div className="mt-3 flex items-center justify-between">
                <button type="button" onClick={copySummary} className="flex items-center gap-1.5 text-xs text-white/55 hover:text-white">
                  {copied ? <CheckIcon className="h-3.5 w-3.5 text-cyan" /> : <CopyIcon className="h-3.5 w-3.5" />}
                  {copied ? chat.copied : chat.copy}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setHandoff(null);
                    inputRef.current?.focus();
                  }}
                  className="text-xs text-neon hover:underline"
                >
                  {chat.backToChat}
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-white/10 bg-white/[0.02] p-3">
          {!handoff && (
            <button
              type="button"
              onClick={() => startHandoff("manual", messages.filter((m) => !m.local), topics)}
              className="mb-2.5 flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 py-2 text-xs text-white/70 transition hover:border-cyan/40 hover:text-white"
            >
              <TelegramIcon className="h-4 w-4 text-cyan" />
              {chat.direct}
            </button>
          )}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void send(input);
            }}
            className="flex items-end gap-2"
          >
            <label htmlFor="chat-input" className="sr-only">
              {chat.placeholder}
            </label>
            <textarea
              ref={inputRef}
              id="chat-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onInputKey}
              rows={1}
              maxLength={CHAT_LIMITS.messageChars}
              placeholder={chat.placeholder ?? ""}
              className="field max-h-32 min-h-[46px] flex-1 resize-none py-3 text-sm leading-6 [field-sizing:content]"
              data-lenis-prevent
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              aria-label={chat.send ?? ""}
              className="grid h-[46px] w-[46px] shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-cyan to-neon text-ink transition hover:scale-105 disabled:scale-100 disabled:opacity-40"
            >
              <SendIcon />
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

function Bubble({ role, error, children }: { role: ChatMessage["role"]; error?: boolean; children: React.ReactNode }) {
  const mine = role === "user";
  return (
    <div className={`flex ${mine ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[88%] rounded-2xl px-4 py-3 text-[13.5px] leading-7 ${
          mine
            ? "rounded-ee-md bg-gradient-to-br from-neon/80 to-violet-600/80 text-white"
            : error
              ? "rounded-es-md border border-rose-400/30 bg-rose-400/10 text-rose-100"
              : "rounded-es-md border border-white/10 bg-white/[0.05] text-white/80"
        }`}
      >
        {children}
      </div>
    </div>
  );
}
