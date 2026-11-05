"use client";

import { isOpen, useMinute, type OfficeHours } from "@/lib/time/london";

type Props = { hours: OfficeHours; label: string; open: string; closed: string };

/** "Office hours — open now / closed" in Europe/London time. Hidden until hydrated. */
export function OfficeStatus({ hours, label, open, closed }: Props) {
  const now = useMinute();
  if (now === null) return null;
  const isOpenNow = isOpen(now, hours);
  return (
    <p className="inline-flex items-center gap-2xs label">
      <span
        aria-hidden
        className={`inline-block size-2xs rounded-full ${isOpenNow ? "bg-accent" : "bg-stone"}`}
      />
      {label} — {isOpenNow ? open : closed}
    </p>
  );
}
