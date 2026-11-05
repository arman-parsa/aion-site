"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/motion/gsap";
import { prefersReducedMotion } from "@/lib/motion/reduced-motion";

type Props = { value: number; prefix?: string; suffix?: string; className?: string };

/**
 * Counts up to `value` when scrolled into view. Server-renders the final
 * number (no-JS, reduced motion, crawlers). Tabular figures avoid layout shift.
 */
export function CountUp({ value, prefix = "", suffix = "", className }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const decimals = (String(value).split(".")[1] ?? "").length;
  const format = (n: number) =>
    `${prefix}${n.toLocaleString("en-GB", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}${suffix}`;

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || prefersReducedMotion()) return;
      const counter = { n: 0 };
      el.textContent = format(0);
      const tween = gsap.to(counter, {
        n: value,
        duration: 1.6,
        ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 90%", once: true },
        onUpdate: () => {
          el.textContent = format(counter.n);
        },
      });
      return () => {
        tween.kill();
        el.textContent = format(value);
      };
    },
    { scope: ref },
  );

  return (
    <span ref={ref} className={`tabular-nums ${className ?? ""}`}>
      {format(value)}
    </span>
  );
}
