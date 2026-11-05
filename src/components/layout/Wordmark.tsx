import NextLink from "next/link";
import { getUiStrings, getSiteSettings } from "@/lib/content";

/** Text wordmark: "AION" in the wordmark serif with a small mono lockup. */
export function Wordmark({ className }: { className?: string }) {
  const site = getSiteSettings();
  const copy = getUiStrings();
  return (
    <NextLink
      href="/"
      aria-label={copy.header.homeLabel}
      className={`inline-flex items-baseline gap-2xs ${className ?? ""}`}
    >
      <span className="font-wordmark text-step-2 leading-none">{site.wordmark}</span>
      <span className="label leading-none">{site.lockup}</span>
    </NextLink>
  );
}
