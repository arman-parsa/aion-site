"use client";

import { usePathname } from "next/navigation";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/motion/gsap";
import { prefersReducedMotion } from "@/lib/motion/reduced-motion";

/**
 * Site-wide, opt-in scroll motion driven by data attributes, so server
 * components can use it without becoming client components:
 *
 *   data-draw       hairline draws in from the start edge (scaleX)
 *   data-parallax   child image drifts slowly against the scroll (yPercent)
 *
 * Re-runs on navigation. Reduced motion: everything stays in its final state.
 */
export function ScrollEffects() {
  const pathname = usePathname();

  useGSAP(
    () => {
      // Cache Components keeps visited routes mounted but hidden: skip those.
      const visible = (el: HTMLElement) => el.getClientRects().length > 0;
      const draws = gsap.utils.toArray<HTMLElement>("[data-draw]").filter(visible);
      draws.forEach((el) => (el.dataset.motionReady = ""));
      if (prefersReducedMotion()) return;

      draws.forEach((el) => {
        gsap.fromTo(
          el,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 1.4,
            ease: "expo.out",
            scrollTrigger: { trigger: el, start: "top 92%", once: true },
          },
        );
      });

      gsap.utils
        .toArray<HTMLElement>("[data-parallax]")
        .filter(visible)
        .forEach((el) => {
          const target = el.querySelector("img") ?? el;
          gsap.fromTo(
            target,
            { yPercent: -6, scale: 1.12 },
            {
              yPercent: 6,
              scale: 1.12,
              ease: "none",
              scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
            },
          );
        });

      ScrollTrigger.refresh();
    },
    { dependencies: [pathname], revertOnUpdate: true },
  );

  return null;
}
