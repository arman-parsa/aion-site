"use client";

import type Lenis from "lenis";

/** The active Lenis instance (null when reduced motion or before mount). */
let instance: Lenis | null = null;

export function setLenis(l: Lenis | null) {
  instance = l;
}

/** Lock page scroll (menu open): pauses Lenis and native scrolling. */
export function lockScroll(locked: boolean) {
  instance?.[locked ? "stop" : "start"]();
  document.documentElement.style.overflow = locked ? "hidden" : "";
}
