"use client";

/**
 * Rendered as a client component on purpose: a server-rendered <img> makes React Flight put a
 * preload hint for the photo into the page's prefetch payload, so every page linking here
 * (i.e. the header on every page) would download the portrait. As a client component, the
 * preload only appears in this page's own HTML.
 */
export default function Portrait({ src, alt, className }: { src: string; alt: string; className?: string }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt} className={className} decoding="async" />;
}
