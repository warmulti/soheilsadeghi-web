"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { markMotionReady } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * Wraps an inner page and fades every `[data-reveal]` descendant in as it scrolls into view.
 * Elements are pre-hidden by CSS (`html.js [data-reveal]`) so nothing flashes before hydration,
 * which means `data-reveal` must only be used inside a RevealScope.
 */
export default function RevealScope({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      markMotionReady();
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const items = gsap.utils.toArray<HTMLElement>("[data-reveal]", ref.current);
        gsap.set(items, { opacity: 0, y: 40 });
        ScrollTrigger.batch(items, {
          start: "top 92%",
          onEnter: (batch) =>
            gsap.to(batch, { opacity: 1, y: 0, duration: 0.9, stagger: 0.09, ease: "power3.out", overwrite: true }),
        });
      });

      document.fonts?.ready.then(() => ScrollTrigger.refresh());
    },
    { scope: ref },
  );

  return <div ref={ref}>{children}</div>;
}
