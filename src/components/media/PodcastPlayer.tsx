"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { LockIcon, PauseIcon, PlayIcon, SkipIcon } from "@/components/icons";

export type Episode = {
  id: number;
  title: string;
  cover?: string;
  meta?: string;
  src?: string; // undefined when locked
  locked: boolean;
  loginHref: string;
};

export type PlayerLabels = {
  play: string;
  pause: string;
  next: string;
  previous: string;
  nowPlaying: string;
  episodes: string;
  locked: string;
  loginToListen: string;
};

const fmt = (s: number) => {
  if (!Number.isFinite(s) || s < 0) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
};

/** Playlist audio player for podcasts. Locked episodes show a login prompt instead of playing. */
export default function PodcastPlayer({ episodes, t }: { episodes: Episode[]; t: PlayerLabels }) {
  const playable = episodes.filter((e) => !e.locked && e.src);
  const firstPlayable = episodes.findIndex((e) => !e.locked && e.src);
  const [index, setIndex] = useState(firstPlayable < 0 ? 0 : firstPlayable);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const current = episodes[index];
  const playableIds = playable.map((e) => e.id);
  const posInPlayable = playableIds.indexOf(current?.id);

  const select = (i: number, autoplay = true) => {
    setIndex(i);
    setTime(0);
    setDuration(0);
    if (autoplay)
      requestAnimationFrame(() => {
        audioRef.current?.play().catch(() => setPlaying(false));
      });
  };

  const toggle = () => {
    const a = audioRef.current;
    if (!a || !current?.src) return;
    if (a.paused) a.play().catch(() => setPlaying(false));
    else a.pause();
  };

  const step = (delta: number) => {
    if (posInPlayable < 0 || playable.length === 0) return;
    const next = playable[(posInPlayable + delta + playable.length) % playable.length];
    select(episodes.findIndex((e) => e.id === next.id));
  };

  const onSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const a = audioRef.current;
    if (a && duration) {
      a.currentTime = (Number(e.target.value) / 100) * duration;
      setTime(a.currentTime);
    }
  };

  const progress = duration ? (time / duration) * 100 : 0;

  return (
    <div className="glass overflow-hidden rounded-[2rem]">
      {/* Now playing */}
      <div className="flex flex-col gap-5 border-b border-white/10 p-6 sm:flex-row sm:items-center">
        <div className="relative aspect-square w-full shrink-0 overflow-hidden rounded-2xl bg-gradient-to-br from-cyan/20 via-ink-2 to-neon/25 sm:w-36">
          {current?.cover ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={current.cover} alt="" className="h-full w-full object-cover" />
          ) : (
            <span className="grid h-full w-full place-items-center text-white/30">
              <PlayIcon className="h-10 w-10" />
            </span>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p className="font-display text-xs tracking-[0.25em] text-cyan/80">{t.nowPlaying}</p>
          <h3 className="mt-1 truncate text-xl font-black text-white">{current?.title}</h3>
          {current?.meta && <p className="mt-1 text-sm text-white/50">{current.meta}</p>}

          <audio
            ref={audioRef}
            src={current?.src}
            preload="none"
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
            onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
            onEnded={() => step(1)}
          />

          <div className="mt-4 flex items-center gap-3">
            <button type="button" onClick={() => step(-1)} aria-label={t.previous} className="grid h-9 w-9 place-items-center rounded-full text-white/70 ring-1 ring-white/15 transition hover:text-white hover:ring-white/30">
              <SkipIcon dir="prev" className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={toggle}
              disabled={!current?.src}
              aria-label={playing ? t.pause : t.play}
              className="grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br from-cyan to-neon text-ink transition hover:brightness-110 disabled:opacity-40"
            >
              {playing ? <PauseIcon className="h-5 w-5" /> : <PlayIcon className="h-5 w-5 ltr:translate-x-0.5 rtl:-translate-x-0.5" />}
            </button>
            <button type="button" onClick={() => step(1)} aria-label={t.next} className="grid h-9 w-9 place-items-center rounded-full text-white/70 ring-1 ring-white/15 transition hover:text-white hover:ring-white/30">
              <SkipIcon dir="next" className="h-4 w-4" />
            </button>

            <div className="flex flex-1 items-center gap-2">
              <span className="w-10 shrink-0 text-end font-mono text-xs text-white/50" dir="ltr">
                {fmt(time)}
              </span>
              <input
                type="range"
                min={0}
                max={100}
                value={progress}
                onChange={onSeek}
                aria-label="seek"
                className="dj-range h-1 w-full"
                style={{ background: `linear-gradient(to right, #22d3ee ${progress}%, rgba(255,255,255,.15) ${progress}%)` }}
              />
              <span className="w-10 shrink-0 font-mono text-xs text-white/50" dir="ltr">
                {fmt(duration)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Playlist */}
      <ul className="max-h-[22rem] overflow-y-auto p-2" aria-label={t.episodes} data-lenis-prevent>
        {episodes.map((ep, i) => {
          const isCurrent = i === index;
          return (
            <li key={ep.id}>
              {ep.locked ? (
                <Link
                  href={ep.loginHref}
                  className="flex items-center gap-3 rounded-2xl px-4 py-3 text-start transition hover:bg-white/5"
                  title={t.loginToListen}
                >
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/5 text-amber-200 ring-1 ring-amber-300/30">
                    <LockIcon className="h-4 w-4" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-bold text-white/80">{ep.title}</span>
                    <span className="block text-xs text-amber-200/80">{t.locked}</span>
                  </span>
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={() => (isCurrent ? toggle() : select(i))}
                  className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-start transition hover:bg-white/5 ${isCurrent ? "bg-white/5" : ""}`}
                >
                  <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-full ${isCurrent ? "bg-gradient-to-br from-cyan to-neon text-ink" : "bg-white/5 text-white/70 ring-1 ring-white/10"}`}>
                    {isCurrent && playing ? <PauseIcon className="h-4 w-4" /> : <PlayIcon className="h-4 w-4 ltr:translate-x-px" />}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className={`block truncate text-sm font-bold ${isCurrent ? "text-cyan" : "text-white/85"}`}>{ep.title}</span>
                    {ep.meta && <span className="block truncate text-xs text-white/45">{ep.meta}</span>}
                  </span>
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
