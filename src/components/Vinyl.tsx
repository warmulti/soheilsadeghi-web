"use client";

import { useEffect, useId, useRef } from "react";
import gsap from "gsap";
import { getLenis } from "./SmoothScroll";
import { prefersReducedMotion } from "@/lib/motion";

/**
 * Deterministic integer hash → [0, 1). Uses only Math.imul / bit ops, which are exactly
 * specified, so the server and every browser engine produce identical groove markup
 * (Math.sin-based hashes can differ in the last bits between engines).
 */
const rand = (i: number) => {
  let h = Math.imul(i + 1, 0x9e3779b1);
  h ^= h >>> 15;
  h = Math.imul(h, 0x85ebca6b);
  h ^= h >>> 13;
  h = Math.imul(h, 0xc2b2ae35);
  h ^= h >>> 16;
  return (h >>> 0) / 4294967296;
};

const GROOVE_COUNT = 92;
const GROOVES = Array.from({ length: GROOVE_COUNT }, (_, i) => ({
  r: (182 + (i * (485 - 182)) / (GROOVE_COUNT - 1)).toFixed(2),
  a: (0.025 + rand(i) * 0.06).toFixed(3),
}));

const TRACK_GAPS = [250, 318, 392, 452];

/** ~33⅓ RPM */
const BASE_SPEED = 200;
const MAX_SCRATCH = 2600;
const VELOCITY_GAIN = 28;
const SMOOTHING = 0.12;

type Props = {
  /** Couple rotation speed to Lenis scroll velocity (scratch feel). */
  reactive?: boolean;
  showArm?: boolean;
  label?: string;
  className?: string;
};

export default function Vinyl({ reactive = true, showArm = true, label = "DJ SOHEIL", className = "" }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const rotorRef = useRef<HTMLDivElement>(null);
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");

  useEffect(() => {
    const root = rootRef.current;
    const rotor = rotorRef.current;
    if (!root || !rotor || prefersReducedMotion()) return; // static record for reduced motion

    const setRotation = gsap.quickSetter(rotor, "rotation", "deg") as (v: number) => void;
    let rotation = 0;
    let speed = BASE_SPEED;
    let visible = true;

    const io = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting));
    io.observe(root);

    const tick = (_time: number, deltaTime: number) => {
      if (!visible) return;
      const velocity = reactive ? (getLenis()?.velocity ?? 0) : 0;
      const target = BASE_SPEED + gsap.utils.clamp(-MAX_SCRATCH, MAX_SCRATCH, velocity * VELOCITY_GAIN);
      speed += (target - speed) * SMOOTHING;
      // Clamp dt so returning to a background tab doesn't jump the platter.
      rotation = (rotation + (speed * Math.min(deltaTime, 64)) / 1000) % 360;
      setRotation(rotation);
    };

    gsap.ticker.add(tick);
    return () => {
      gsap.ticker.remove(tick);
      io.disconnect();
    };
  }, [reactive]);

  return (
    <div ref={rootRef} className={`vinyl ${className}`} aria-hidden="true">
      <div ref={rotorRef} className="vinyl-rotor">
        <svg viewBox="0 0 1000 1000" className="h-full w-full">
          <defs>
            <radialGradient id={`disc-${uid}`} cx="50%" cy="50%" r="50%">
              <stop offset="0.3" stopColor="#141418" />
              <stop offset="0.95" stopColor="#0a0a0d" />
              <stop offset="1" stopColor="#1c1c22" />
            </radialGradient>
            <linearGradient id={`label-${uid}`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#22d3ee" />
              <stop offset="0.55" stopColor="#7c3aed" />
              <stop offset="1" stopColor="#a855f7" />
            </linearGradient>
          </defs>

          <circle cx="500" cy="500" r="497" fill={`url(#disc-${uid})`} />
          {GROOVES.map((g) => (
            <circle key={g.r} cx="500" cy="500" r={g.r} fill="none" stroke={`rgba(255,255,255,${g.a})`} strokeWidth="1.1" />
          ))}
          {TRACK_GAPS.map((r) => (
            <circle key={r} cx="500" cy="500" r={r} fill="none" stroke="#050507" strokeWidth="5" />
          ))}

          {/* Center label */}
          <circle cx="500" cy="500" r="172" fill={`url(#label-${uid})`} />
          <circle cx="500" cy="500" r="172" fill="none" stroke="rgba(0,0,0,.35)" strokeWidth="6" />
          <circle cx="500" cy="500" r="120" fill="none" stroke="rgba(255,255,255,.25)" strokeWidth="1.5" />
          <text x="500" y="455" textAnchor="middle" fill="#fff" fontFamily="Bebas Neue, sans-serif" fontSize="58" letterSpacing="4">
            {label}
          </text>
          <text x="500" y="580" textAnchor="middle" fill="rgba(255,255,255,.8)" fontFamily="Bebas Neue, sans-serif" fontSize="26" letterSpacing="6">
            33⅓ RPM · SIDE A
          </text>
          <path d="M 420 610 L 580 610" stroke="rgba(255,255,255,.5)" strokeWidth="2" />
          <circle cx="500" cy="500" r="11" fill="#07070a" />
        </svg>
      </div>

      {/* Stationary specular light — grooves visibly spin underneath it */}
      <div className="vinyl-sheen" />

      {showArm && (
        <svg viewBox="0 0 1000 1000" className="pointer-events-none absolute inset-0 h-full w-full overflow-visible">
          <defs>
            <linearGradient id={`arm-${uid}`} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#8d8d98" />
              <stop offset="0.5" stopColor="#e4e4ea" />
              <stop offset="1" stopColor="#9a9aa5" />
            </linearGradient>
          </defs>
          {/* Pivot base */}
          <circle cx="930" cy="90" r="58" fill="#1a1a20" stroke="rgba(255,255,255,.15)" strokeWidth="3" />
          <circle cx="930" cy="90" r="38" fill="none" stroke="rgba(255,255,255,.08)" strokeWidth="2" />
          {/* Counterweight behind the pivot */}
          <rect x="908" y="6" width="44" height="34" rx="7" fill="#2a2a33" stroke="rgba(255,255,255,.18)" strokeWidth="2" />
          <circle cx="930" cy="90" r="24" fill="#2a2a33" stroke="rgba(255,255,255,.2)" strokeWidth="2" />
          {/* S-shaped arm tube */}
          <path
            d="M930 90 L 935 300 C 940 470 900 560 880 620 C 862 676 872 712 856 752"
            fill="none"
            stroke="rgba(0,0,0,.45)"
            strokeWidth="18"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M930 90 L 935 300 C 940 470 900 560 880 620 C 862 676 872 712 856 752"
            fill="none"
            stroke={`url(#arm-${uid})`}
            strokeWidth="11"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Headshell with finger lift, resting on the outer grooves */}
          <g transform="rotate(21.8 848 790)">
            <rect x="826" y="752" width="44" height="76" rx="7" fill="#24242c" stroke="#a855f7" strokeWidth="3" />
            <rect x="834" y="800" width="28" height="22" rx="3" fill="#121216" stroke="rgba(168,85,247,.6)" strokeWidth="1.5" />
            <path d="M870 770 L 892 762" stroke="#c9c9d1" strokeWidth="5" strokeLinecap="round" />
          </g>
        </svg>
      )}
    </div>
  );
}
