"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import { stepClasses } from "@/components/ui/Heading";
import { EASE_OUT_EXPO, gsap, SplitText, useGSAP } from "@/lib/motion/gsap";
import { prefersReducedMotion } from "@/lib/motion/reduced-motion";
import { cn } from "@/lib/utils/cn";
import type { TypeStep } from "@/styles/tokens";

type Props = {
  as?: "h1" | "h2" | "h3" | "p";
  size?: TypeStep;
  children: ReactNode;
  className?: string;
  /** Start when scrolled into view (default) or immediately (hero). */
  trigger?: "scroll" | "load";
  delay?: number;
  id?: string;
};

/**
 * Display heading revealed line by line (each line rises out of a mask).
 * Server-renders as plain text; reduced motion and no-JS show it as-is.
 */
export function SplitHeading({
  as = "h2",
  size = 6,
  children,
  className,
  trigger = "scroll",
  delay = 0,
  id,
}: Props) {
  const ref = useRef<HTMLElement>(null);
  const Tag = as as ElementType;

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      if (prefersReducedMotion()) {
        el.dataset.motionReady = "";
        return;
      }
      const split = SplitText.create(el, {
        type: "lines",
        mask: "lines",
        linesClass: "split-line",
      });
      el.dataset.motionReady = "";
      const tween = gsap.from(split.lines, {
        yPercent: 110,
        duration: 1.2,
        ease: EASE_OUT_EXPO,
        stagger: 0.08,
        delay,
        scrollTrigger:
          trigger === "scroll" ? { trigger: el, start: "top 85%", once: true } : undefined,
        onComplete: () => split.revert(),
      });
      return () => {
        tween.kill();
        split.revert();
      };
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} id={id} data-split className={cn("font-display", stepClasses[size], className)}>
      {children}
    </Tag>
  );
}
