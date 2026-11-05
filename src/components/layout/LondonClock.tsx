"use client";

import { useMinute, zonedParts } from "@/lib/time/london";

/** "London 07:56", updated each minute. Time renders client-side only (static pages). */
export function LondonClock({ label, ariaLabel }: { label: string; ariaLabel: string }) {
  const now = useMinute();
  const time = now === null ? null : zonedParts(now).hhmm;
  return (
    <p
      className="label leading-none tabular-nums"
      aria-label={time ? `${ariaLabel}: ${time}` : undefined}
    >
      <span aria-hidden={time ? true : undefined}>{label}</span>
      {time && (
        <time aria-hidden className="ms-2xs" dateTime={time}>
          {time}
        </time>
      )}
    </p>
  );
}
