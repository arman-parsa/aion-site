"use client";

import { useRef, type ReactNode } from "react";
import { EASE_OUT_EXPO, gsap, useGSAP } from "@/lib/motion/gsap";
import { prefersReducedMotion } from "@/lib/motion/reduced-motion";

/** Fades and lifts its direct children in as they scroll into view. */
export function Reveal({
  children,
  className,
  stagger = 0.08,
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      el.dataset.motionReady = "";
      if (prefersReducedMotion()) return;
      const items = el.children.length ? Array.from(el.children) : [el];
      const tween = gsap.from(items, {
        opacity: 0,
        y: 24,
        duration: 1,
        ease: EASE_OUT_EXPO,
        stagger,
        scrollTrigger: { trigger: el, start: "top 88%", once: true },
      });
      return () => tween.kill();
    },
    { scope: ref },
  );

  return (
    <div ref={ref} data-reveal className={className}>
      {children}
    </div>
  );
}
