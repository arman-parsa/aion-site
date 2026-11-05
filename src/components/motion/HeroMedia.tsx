"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useGSAP } from "@/lib/motion/gsap";
import { prefersReducedMotion } from "@/lib/motion/reduced-motion";

/**
 * Full-bleed hero photograph that settles in (slow scale from 1.08 → 1).
 * Transform only, and the image is visible from the first paint (LCP-safe).
 */
export function HeroMedia({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      if (!ref.current || prefersReducedMotion()) return;
      gsap.fromTo(ref.current, { scale: 1.08 }, { scale: 1, duration: 2.4, ease: "expo.out" });
    },
    { scope: ref },
  );
  return (
    <div ref={ref} className="absolute inset-0 will-change-transform">
      {children}
    </div>
  );
}
