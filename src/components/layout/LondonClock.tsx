"use client";

import { useMinute, zonedParts } from "@/lib/time/london";

/**
 * "London 07:56", updated each minute. The time renders client-side only
 * (static pages); screen readers get "Current time in London: 07:56".
 */
export function LondonClock({ label, ariaLabel }: { label: string; ariaLabel: string }) {
  const now = useMinute();
  const time = now === null ? null : zonedParts(now).hhmm;
  return (
    <p className="label leading-none tabular-nums">
      <span aria-hidden>{label}</span>
      {time && (
        <>
          <span className="sr-only">{ariaLabel}: </span>
          <time className="ms-2xs" dateTime={time}>
            {time}
          </time>
        </>
      )}
    </p>
  );
}
