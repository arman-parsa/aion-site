"use client";

import Image from "next/image";
import NextLink from "next/link";
import { useRef, useState } from "react";
import { formatIndex } from "@/components/ui/Eyebrow";
import { gsap, useGSAP } from "@/lib/motion/gsap";
import { prefersReducedMotion } from "@/lib/motion/reduced-motion";
import { cn } from "@/lib/utils/cn";

export type WorkRow = {
  href: string;
  title: string;
  sector: string;
  location: string;
  year: number;
  image: { src: string; width: number; height: number };
};

type Props = {
  rows: WorkRow[];
  columns: { no: string; project: string; sector: string; location: string; year: string };
  label: string;
};

/**
 * Project index as a table-like list (No., Project, Sector, Location, Year).
 * On devices with a fine pointer, the hovered project's image follows the
 * cursor (decorative, aria-hidden). Rows dim their siblings on hover/focus.
 */
export function WorkIndexList({ rows, columns, label }: Props) {
  const scope = useRef<HTMLDivElement>(null);
  const follower = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<number | null>(null);

  useGSAP(
    () => {
      if (follower.current) gsap.set(follower.current, { xPercent: -50, yPercent: -50 });
    },
    { scope },
  );

  // Plain event handler (runs outside render); tweens only transform.
  const onMove = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || !follower.current) return;
    const duration = prefersReducedMotion() ? 0 : 0.6;
    gsap.to(follower.current, {
      x: e.clientX,
      y: e.clientY,
      duration,
      ease: "expo.out",
      overwrite: "auto",
    });
  };

  const grid = "grid grid-cols-[3rem_1fr] md:grid-cols-[4rem_5fr_3fr_3fr_1fr] gap-x-grid-gap";

  return (
    <div ref={scope} onPointerMove={onMove} onPointerLeave={() => setActive(null)}>
      <div aria-hidden className={cn(grid, "hidden pb-xs label text-ink-2 rule-b md:grid")}>
        <span>{columns.no}</span>
        <span>{columns.project}</span>
        <span>{columns.sector}</span>
        <span>{columns.location}</span>
        <span className="text-end">{columns.year}</span>
      </div>
      <ol aria-label={label} className="dim-siblings">
        {rows.map((row, i) => (
          <li key={row.href} className="rule-b">
            <NextLink
              href={row.href}
              onPointerEnter={() => setActive(i)}
              onFocus={() => setActive(null)}
              className={cn(grid, "items-baseline gap-y-2xs py-m")}
            >
              <span className="label text-ink-2 tabular-nums">{formatIndex(i + 1)}</span>
              <span className="font-display text-step-3">{row.title}</span>
              <span className="col-start-2 flex flex-wrap gap-x-s text-step--1 text-ink-2 md:contents md:text-step-0">
                <span>
                  <span className="sr-only">{columns.sector}: </span>
                  {row.sector}
                </span>
                <span>
                  <span className="sr-only">{columns.location}: </span>
                  {row.location}
                </span>
                <span className="self-center label tabular-nums md:text-end">
                  <span className="sr-only">{columns.year}: </span>
                  {row.year}
                </span>
              </span>
            </NextLink>
          </li>
        ))}
      </ol>

      <div
        ref={follower}
        aria-hidden
        className="pointer-events-none fixed start-0 top-0 z-30 hidden aspect-landscape w-[22vw] overflow-hidden [@media(pointer:fine)]:lg:block"
      >
        {rows.map((row, i) => (
          <Image
            key={row.href}
            src={row.image.src}
            alt=""
            width={row.image.width}
            height={row.image.height}
            sizes="22vw"
            className={cn(
              "absolute inset-0 h-full w-full object-cover transition-opacity duration-base ease-out-expo",
              active === i ? "opacity-100" : "opacity-0",
            )}
          />
        ))}
      </div>
    </div>
  );
}
