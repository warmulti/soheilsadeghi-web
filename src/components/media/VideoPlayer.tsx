"use client";

/** Inline video player for uploaded course/download videos. Streams from /api/stream/:id (Range). */
export default function VideoPlayer({ src, poster, title }: { src: string; poster?: string; title?: string }) {
  return (
    <div className="glass overflow-hidden rounded-[2rem]">
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <video
        src={src}
        poster={poster}
        controls
        preload="metadata"
        playsInline
        aria-label={title}
        className="aspect-video w-full bg-black [color-scheme:dark]"
      />
    </div>
  );
}
