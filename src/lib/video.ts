/** Turns a YouTube or Aparat page link into an embeddable player URL (null if unsupported). */
export function embedUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\./, "");
    if (host === "youtu.be") return `https://www.youtube-nocookie.com/embed/${u.pathname.slice(1)}`;
    if (host.endsWith("youtube.com")) {
      const id = u.searchParams.get("v") ?? u.pathname.match(/\/(?:embed|shorts|live)\/([\w-]+)/)?.[1];
      return id ? `https://www.youtube-nocookie.com/embed/${id}` : null;
    }
    if (host.endsWith("aparat.com")) {
      const hash = u.pathname.match(/\/v\/([\w-]+)/)?.[1];
      return hash ? `https://www.aparat.com/video/video/embed/videohash/${hash}/vt/frame` : null;
    }
  } catch {
    /* not a URL */
  }
  return null;
}
