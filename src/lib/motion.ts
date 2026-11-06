/** True when the visitor asked the OS for reduced motion. Client-only. */
export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Tells the pre-hydration gate in the root layout that animation code is running,
 * so it doesn't un-hide `[data-reveal]` elements on its 4s safety timeout.
 */
export function markMotionReady() {
  (window as Window & { __motionReady?: boolean }).__motionReady = true;
}

/** Inline script for <head>: hides animated elements before first paint (see globals.css). */
export const MOTION_GATE_SCRIPT =
  "(function(){var d=document.documentElement;d.classList.add('js');setTimeout(function(){if(!window.__motionReady)d.classList.remove('js')},4000)})();";
