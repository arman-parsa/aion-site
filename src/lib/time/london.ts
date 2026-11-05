"use client";

import { useSyncExternalStore } from "react";

/** One shared minute ticker so every clock on the page updates together. */
const listeners = new Set<() => void>();
let timer: ReturnType<typeof setTimeout> | undefined;
let now = 0;

function tick() {
  now = Date.now();
  listeners.forEach((l) => l());
  timer = setTimeout(tick, 60_000 - (now % 60_000) + 50);
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  if (!timer) timer = setTimeout(tick, 60_000 - (Date.now() % 60_000) + 50);
  return () => {
    listeners.delete(cb);
    if (listeners.size === 0 && timer) {
      clearTimeout(timer);
      timer = undefined;
    }
  };
}

function getSnapshot() {
  if (!now) now = Date.now();
  return now;
}

/** Current epoch ms, refreshed on each minute boundary. `null` during server render. */
export function useMinute(): number | null {
  return useSyncExternalStore(subscribe, getSnapshot, () => null);
}

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function zonedParts(ms: number, timeZone = "Europe/London") {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
    weekday: "short",
    hourCycle: "h23",
  }).formatToParts(ms);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  return { hhmm: `${get("hour")}:${get("minute")}`, day: WEEKDAYS.indexOf(get("weekday")) };
}

export type OfficeHours = {
  days: readonly number[];
  open: string;
  close: string;
  timeZone: string;
};

export function isOpen(ms: number, hours: OfficeHours): boolean {
  const { hhmm, day } = zonedParts(ms, hours.timeZone);
  return hours.days.includes(day) && hhmm >= hours.open && hhmm < hours.close;
}
