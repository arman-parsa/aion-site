"use client";

import { useRef, type ReactNode } from "react";
import { EASE_OUT_EXPO, gsap, useGSAP } from "@/lib/motion/gsap";
import { prefersReducedMotion } from "@/lib/motion/reduced-motion";
import { cn } from "@/lib/utils/cn";

type Props = {
  children: ReactNode;
  className?: string;
  trigger?: "scroll" | "load";
  /** Subtle scale-down of the media inside as it reveals. */
  zoom?: boolean;
};

/**
 * Reveals its media with a clip-path wipe from the bottom up when scrolled
 * into view. With trigger="load" (first-screen, priority images) the media is
 * never hidden: it is visible from first paint (LCP-safe) and only settles in
 * with a slow scale.
 */
export function ClipMedia({ children, className, trigger = "scroll", zoom = true }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      el.dataset.motionReady = "";
      if (prefersReducedMotion()) return;
      const img = el.querySelector("img");

      if (trigger === "load") {
        const tween = img
          ? gsap.fromTo(img, { scale: 1.06 }, { scale: 1, duration: 1.6, ease: EASE_OUT_EXPO })
          : null;
        return () => tween?.kill();
      }

      const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: "top 85%", once: true } });
      tl.fromTo(
        el,
        { clipPath: "inset(100% 0% 0% 0%)" },
        { clipPath: "inset(0% 0% 0% 0%)", duration: 1.2, ease: EASE_OUT_EXPO },
      );
      if (zoom && img)
        tl.fromTo(img, { scale: 1.12 }, { scale: 1, duration: 1.6, ease: EASE_OUT_EXPO }, 0);
      return () => tl.kill();
    },
    { scope: ref },
  );

  return (
    <div
      ref={ref}
      // Only scroll-triggered media start clipped (see the pre-states in globals.css).
      data-clip={trigger === "scroll" ? "" : undefined}
      className={cn("overflow-hidden", className)}
    >
      {children}
    </div>
  );
}
