import NextLink from "next/link";
import { getLayoutCopy, getSiteSettings } from "@/lib/content";

/** Text wordmark: "AION" in the display serif with a small mono lockup. */
export function Wordmark({ className }: { className?: string }) {
  const site = getSiteSettings();
  const copy = getLayoutCopy();
  return (
    <NextLink
      href="/"
      aria-label={copy.header.homeLabel}
      className={`inline-flex items-baseline gap-2xs ${className ?? ""}`}
    >
      <span className="font-display text-step-2 leading-none">{site.wordmark}</span>
      <span className="label leading-none">{site.lockup}</span>
    </NextLink>
  );
}
