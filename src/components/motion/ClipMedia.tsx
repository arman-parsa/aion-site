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

/** Reveals its media with a clip-path wipe from the bottom up. */
export function ClipMedia({ children, className, trigger = "scroll", zoom = true }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      el.dataset.motionReady = "";
      if (prefersReducedMotion()) return;
      const st = trigger === "scroll" ? { trigger: el, start: "top 85%", once: true } : undefined;
      const tl = gsap.timeline({ scrollTrigger: st });
      tl.fromTo(
        el,
        { clipPath: "inset(100% 0% 0% 0%)" },
        { clipPath: "inset(0% 0% 0% 0%)", duration: 1.2, ease: EASE_OUT_EXPO },
      );
      const img = el.querySelector("img");
      if (zoom && img)
        tl.fromTo(img, { scale: 1.12 }, { scale: 1, duration: 1.6, ease: EASE_OUT_EXPO }, 0);
      return () => tl.kill();
    },
    { scope: ref },
  );

  return (
    <div ref={ref} data-clip className={cn("overflow-hidden", className)}>
      {children}
    </div>
  );
}
