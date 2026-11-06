/**
 * Site-wide search over CMS content for one language: page sections (globals), downloads,
 * custom pages and — for logged-in students — their course materials.
 * Data is small (a personal site), so it's matched in memory with Persian-aware normalisation.
 */
import type { Payload } from "payload";
import type { User } from "@/payload-types";
import { href as localeHref, type Locale } from "@/i18n/config";
import { normalizeFa } from "@/lib/chat/normalize";

export type SearchType = "page" | "course" | "download" | "material" | "guide" | "faq";
export type SearchResult = { type: SearchType; title: string; snippet?: string; href: string };

type Doc = { type: SearchType; title: string; body: string; path: string };

const join = (...parts: (string | null | undefined)[]) => parts.filter(Boolean).join(" · ");
const texts = (items?: { text: string }[] | null) => (items ?? []).map((i) => i.text).join(" ");

async function collect(payload: Payload, locale: Locale, user: User | null): Promise<Doc[]> {
  const g = <S extends Parameters<Payload["findGlobal"]>[0]["slug"]>(slug: S) => payload.findGlobal({ slug, locale, depth: 0 });
  const [nav, home, dj, ab, buy, bio, contact, settings] = await Promise.all([
    g("navigation"),
    g("home"),
    g("djing-course"),
    g("ableton-course"),
    g("buying-guide"),
    g("biography"),
    g("contact-page"),
    g("settings"),
  ]);
  const docs: Doc[] = [];
  const add = (type: SearchType, title: string | null | undefined, body: string, path: string) => {
    if (title) docs.push({ type, title, body, path });
  };

  for (const item of nav.items ?? []) {
    add("page", item.label, "", item.href);
    for (const c of item.children ?? []) add("page", c.label, c.description ?? "", c.href);
  }

  add("page", settings.nameLocal, join(settings.bioShort, (settings.roles ?? []).join(" ")), "/");
  for (const s of home.services ?? []) add("course", s.title, join(s.description, (s.tags ?? []).join(" ")), s.href);
  for (const e of home.timeline ?? []) add("guide", `${e.year} — ${e.title}`, e.text, "/");
  for (const x of home.techniques ?? []) add("guide", x.name, join(x.subtitle, x.text), "/");

  add("course", join(dj.title, dj.titleAccent), dj.lead, "/courses/djing");
  for (const t of dj.tiers ?? []) add("course", t.title, join(t.audience, texts(t.highlights)), "/courses/djing#tiers");
  for (const s of dj.syllabus ?? []) for (const m of s.modules ?? []) add("course", `${m.title} (${s.label})`, texts(m.topics), "/courses/djing");
  for (const f of dj.faq ?? []) add("faq", f.q, f.a, "/courses/djing");

  add("course", join(ab.title, ab.titleAccent), ab.lead, "/courses/ableton");
  for (const s of ab.tracks ?? []) for (const m of s.modules ?? []) add("course", `${m.title} (${s.label})`, texts(m.topics), "/courses/ableton#curriculum");
  for (const o of ab.outcomes ?? []) add("course", o.title, o.text ?? "", "/courses/ableton");
  for (const f of ab.faq ?? []) add("faq", f.q, f.a, "/courses/ableton");

  add("guide", join(buy.title, buy.titleAccent), buy.lead ?? "", "/buying-guide");
  for (const tier of buy.tiers ?? []) {
    for (const item of [...(tier.controllers ?? []), ...(tier.headphones ?? []), ...(tier.monitors ?? [])]) {
      add("guide", `${item.brand} ${item.name}`, join(item.kind, (item.tags ?? []).join(" "), texts(item.points), tier.label), "/buying-guide");
    }
  }
  for (const r of buy.laptop?.rows ?? []) add("guide", r.label, join(r.min, r.rec), "/buying-guide");
  add("guide", buy.laptop?.windowsTitle, texts(buy.laptop?.windowsTips), "/buying-guide");
  add("guide", buy.laptop?.macTitle, texts(buy.laptop?.macTips), "/buying-guide");

  add("page", bio.title, join(bio.lead, texts(bio.story)), "/biography");
  for (const c of bio.chapters ?? []) add("page", c.title, join(c.tag, c.text), "/biography");
  for (const s of [...(bio.stage ?? []), ...(bio.teaching ?? [])]) add("page", s.title, s.text ?? "", "/biography");
  for (const s of bio.setup ?? []) add("page", s.group, (s.items ?? []).join(" "), "/biography");

  add("page", join(contact.title, contact.titleAccent), contact.lead ?? "", "/contact");

  const [downloads, pages, materials] = await Promise.all([
    payload.find({ collection: "downloads", locale, user, overrideAccess: false, depth: 0, limit: 500, pagination: false }),
    payload.find({ collection: "pages", locale, user, overrideAccess: false, depth: 0, limit: 200, pagination: false }),
    user
      ? payload.find({ collection: "materials", locale, user, overrideAccess: false, depth: 0, limit: 300, pagination: false })
      : Promise.resolve({ docs: [] }),
  ]);
  for (const d of downloads.docs) {
    add("download", d.title, join(d.excerpt, d.genre, d.musicalKey, d.tracklist, d.version, (d.formats ?? []).join(" ")), `/downloads/${d.category}/${d.slug}`);
  }
  for (const p of pages.docs) add("page", p.title, join(p.kicker, p.lead), `/${p.slug}`);
  for (const m of materials.docs) add("material", m.title, m.summary ?? "", `/account/materials/${m.id}`);

  return docs;
}

function snippetOf(body: string, term: string): string | undefined {
  if (!body) return undefined;
  const idx = normalizeFa(body).indexOf(term);
  // Normalisation changes lengths slightly, so this is an approximate window — fine for a teaser.
  const start = Math.max(0, (idx > 0 ? idx : 0) - 40);
  const s = body.slice(start, start + 150).trim();
  return (start > 0 ? "…" : "") + s + (start + 150 < body.length ? "…" : "");
}

export async function siteSearch(payload: Payload, query: string, locale: Locale, user: User | null, limit = 24): Promise<SearchResult[]> {
  const q = normalizeFa(query);
  const terms = q.split(" ").filter((t) => t.length >= 2);
  if (!terms.length) return [];

  const docs = await collect(payload, locale, user);
  const seen = new Set<string>();
  return docs
    .map((d) => {
      const title = normalizeFa(d.title);
      const body = normalizeFa(d.body);
      if (!terms.every((t) => title.includes(t) || body.includes(t))) return null;
      const score = terms.reduce((s, t) => s + (title.includes(t) ? 3 : 0) + (body.includes(t) ? 1 : 0), 0) + (title.startsWith(terms[0]) ? 2 : 0);
      return { d, score };
    })
    .filter((x): x is { d: Doc; score: number } => x !== null)
    .sort((a, b) => b.score - a.score)
    .filter(({ d }) => {
      const key = `${d.title}|${d.path}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, limit)
    .map(({ d }) => ({ type: d.type, title: d.title, snippet: snippetOf(d.body, terms[0]), href: localeHref(locale, d.path) }));
}
