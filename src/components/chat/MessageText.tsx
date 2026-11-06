import Link from "next/link";
import type { ReactNode } from "react";
import { href, type Locale } from "@/i18n/config";

/**
 * Minimal, safe renderer for assistant replies: paragraphs, numbered / bulleted lists,
 * **bold**, `code` and internal [links](/path). Everything else is rendered as plain text
 * (no HTML injection, external links are not turned into anchors).
 */
const INLINE = /(\*\*[^*\n]+\*\*|`[^`\n]+`|\[[^\]\n]+\]\(\/[^)\s]*\))/g;
const LINK = /^\[([^\]]+)\]\((\/[^)\s]*)\)$/;

/** Knowledge-base links are unprefixed (/buying-guide); AI answers may already include /en. */
const localize = (path: string, locale: Locale) => (path === "/en" || path.startsWith("/en/") ? path : href(locale, path));

function renderInline(text: string, locale: Locale): ReactNode[] {
  const out: ReactNode[] = [];
  let last = 0;
  let key = 0;
  for (const m of text.matchAll(INLINE)) {
    const index = m.index ?? 0;
    if (index > last) out.push(text.slice(last, index));
    const token = m[0];
    if (token.startsWith("**")) {
      out.push(<strong key={key++}>{token.slice(2, -2)}</strong>);
    } else if (token.startsWith("`")) {
      out.push(
        <code key={key++} dir="ltr">
          {token.slice(1, -1)}
        </code>,
      );
    } else {
      const link = LINK.exec(token);
      out.push(
        link ? (
          <Link key={key++} href={localize(link[2], locale)} className="text-cyan underline underline-offset-4 hover:text-white">
            {link[1]}
          </Link>
        ) : (
          token
        ),
      );
    }
    last = index + token.length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

type Block = { kind: "p"; text: string } | { kind: "ol" | "ul"; items: string[] };

function parseBlocks(text: string): Block[] {
  const blocks: Block[] = [];
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim();
    const prev = blocks.at(-1);
    if (!line) {
      blocks.push({ kind: "p", text: "" }); // paragraph break marker
      continue;
    }
    const ol = /^(?:\d+|[۰-۹]+)[.)]\s+(.+)$/.exec(line);
    const ul = /^[-•*]\s+(.+)$/.exec(line);
    const heading = /^#{1,4}\s+(.+)$/.exec(line);
    if (ol || ul) {
      const kind = ol ? "ol" : "ul";
      const item = (ol ?? ul)![1];
      if (prev && prev.kind === kind) prev.items.push(item);
      else blocks.push({ kind, items: [item] });
    } else if (heading) {
      blocks.push({ kind: "p", text: `**${heading[1]}**` });
    } else if (prev && prev.kind === "p" && prev.text) {
      prev.text += ` ${line}`;
    } else {
      blocks.push({ kind: "p", text: line });
    }
  }
  return blocks.filter((b) => b.kind !== "p" || b.text);
}

export default function MessageText({ text, locale, listStyle }: { text: string; locale: Locale; listStyle: "persian" | "decimal" }) {
  return (
    <div className="chat-text space-y-3">
      {parseBlocks(text).map((b, i) => {
        if (b.kind === "p") return <p key={i}>{renderInline(b.text, locale)}</p>;
        const List = b.kind === "ol" ? "ol" : "ul";
        return (
          <List key={i} className={`space-y-2 ps-5 ${b.kind === "ol" ? (listStyle === "persian" ? "list-[persian]" : "list-decimal") : "list-disc"} marker:text-neon`}>
            {b.items.map((item, j) => (
              <li key={j} className="ps-1">
                {renderInline(item, locale)}
              </li>
            ))}
          </List>
        );
      })}
    </div>
  );
}
