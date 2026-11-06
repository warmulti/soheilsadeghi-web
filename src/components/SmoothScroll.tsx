"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger);

let lenisInstance: Lenis | null = null;

/** Current Lenis instance (null when reduced motion is preferred). */
export function getLenis() {
  return lenisInstance;
}

/** Freeze page scrolling (e.g. while the mobile menu is open). Works with and without Lenis. */
export function lockScroll(locked: boolean) {
  if (lenisInstance) {
    if (locked) lenisInstance.stop();
    else lenisInstance.start();
  } else {
    document.documentElement.style.overflow = locked ? "hidden" : "";
  }
}

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    if (prefersReducedMotion()) return;

    // `anchors` smooth-scrolls in-page links (#tiers …). Lenis honours the target's
    // scroll-margin-top (scroll-mt-24), which also clears the fixed header without Lenis.
    const lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 0.9, anchors: true });
    lenisInstance = lenis;
    lenis.on("scroll", ScrollTrigger.update);

    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
      lenisInstance = null;
    };
  }, []);

  // Jump to top on route change
  useEffect(() => {
    lenisInstance?.scrollTo(0, { immediate: true, force: true });
    window.scrollTo(0, 0);
  }, [pathname]);

  return <>{children}</>;
}
