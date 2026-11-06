"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { href, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import type { SearchResult } from "@/lib/search";
import { lockScroll } from "./SmoothScroll";
import { ArrowLeft, CloseIcon, SearchIcon } from "./icons";

type Props = { open: boolean; onClose: () => void; locale: Locale; t: Dictionary["search"] };

/** Quick search overlay (Ctrl/Cmd+K). Enter opens the full results page. */
export default function SearchModal({ open, onClose, locale, t }: Props) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [q, setQ] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (!open) return;
    lockScroll(true);
    const t0 = window.setTimeout(() => inputRef.current?.focus(), 60);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      lockScroll(false);
      window.clearTimeout(t0);
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  // Debounced live results.
  useEffect(() => {
    const query = q.trim();
    if (query.length < 2) {
      setResults([]);
      return;
    }
    const ctrl = new AbortController();
    const timer = window.setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}&locale=${locale}`, { signal: ctrl.signal });
        const data = (await res.json()) as { results?: SearchResult[] };
        setResults(data.results ?? []);
        setActive(0);
      } catch {
        /* aborted or offline */
      } finally {
        setLoading(false);
      }
    }, 220);
    return () => {
      ctrl.abort();
      window.clearTimeout(timer);
    };
  }, [q, locale]);

  const goAll = () => {
    if (q.trim().length < 2) return;
    onClose();
    router.push(`${href(locale, "/search")}?q=${encodeURIComponent(q.trim())}`);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const r = results[active];
      if (r && q.trim().length >= 2 && results.length) {
        onClose();
        router.push(r.href);
      } else goAll();
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-start justify-center bg-ink/70 px-4 pt-[12vh] backdrop-blur-md" onClick={onClose} role="presentation">
      <div
        role="dialog"
        aria-modal="true"
        aria-label={t.title}
        onClick={(e) => e.stopPropagation()}
        className="animate-fade-up w-full max-w-2xl overflow-hidden rounded-3xl border border-white/10 bg-ink-2/95 shadow-[0_30px_100px_rgba(0,0,0,.6),0_0_60px_rgba(168,85,247,.18)]"
      >
        <div className="flex items-center gap-3 border-b border-white/10 px-5">
          <SearchIcon className="h-5 w-5 shrink-0 text-neon" />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder={t.placeholder}
            aria-label={t.title}
            className="h-16 w-full bg-transparent text-base text-white outline-none placeholder:text-white/35 focus-visible:outline-none"
          />
          <button type="button" onClick={onClose} aria-label="Esc" className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-white/50 hover:bg-white/10 hover:text-white">
            <CloseIcon />
          </button>
        </div>

        <div data-lenis-prevent className="chat-scroll max-h-[60vh] overflow-y-auto p-2" aria-live="polite">
          {q.trim().length < 2 ? (
            <p className="px-4 py-6 text-center text-sm text-white/40">{t.hint}</p>
          ) : loading && !results.length ? (
            <div className="flex justify-center gap-1.5 py-8">
              {[0, 1, 2].map((i) => (
                <span key={i} className="chat-dot h-1.5 w-1.5 rounded-full bg-neon" style={{ animationDelay: `${i * 0.15}s` }} />
              ))}
            </div>
          ) : results.length === 0 ? (
            <p className="px-4 py-6 text-center text-sm text-white/45">{t.noResults}</p>
          ) : (
            <ul>
              {results.map((r, i) => (
                <li key={`${r.href}-${r.title}`}>
                  <Link
                    href={r.href}
                    onClick={onClose}
                    onMouseEnter={() => setActive(i)}
                    className={`flex items-start gap-3 rounded-2xl px-4 py-3 transition ${i === active ? "bg-white/[0.06]" : ""}`}
                  >
                    <span className="mt-0.5 shrink-0 rounded-full bg-neon/10 px-2.5 py-0.5 text-[11px] text-neon ring-1 ring-neon/25">{t.types[r.type]}</span>
                    <span className="min-w-0">
                      <span className="block truncate font-bold text-white">{r.title}</span>
                      {r.snippet && <span className="mt-0.5 line-clamp-1 block text-xs text-white/45">{r.snippet}</span>}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        {results.length > 0 && (
          <button type="button" onClick={goAll} className="flex w-full items-center justify-center gap-2 border-t border-white/10 py-3 text-sm text-neon hover:bg-white/5">
            {t.viewAll}
            <ArrowLeft />
          </button>
        )}
      </div>
    </div>
  );
}
