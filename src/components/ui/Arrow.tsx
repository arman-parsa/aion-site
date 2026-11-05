import { cn } from "@/lib/utils/cn";

/** Inline arrow glyph that nudges toward inline-end when a parent `.group` is hovered. Mirrors in RTL. */
export function Arrow({
  direction = "end",
  className,
}: {
  direction?: "end" | "up" | "down";
  className?: string;
}) {
  const glyph = direction === "up" ? "↑" : direction === "down" ? "↓" : "→";
  return (
    <span
      aria-hidden
      className={cn(
        "inline-block transition-transform duration-base ease-out-expo",
        direction === "end" &&
          "group-hover:translate-x-3xs group-focus-visible:translate-x-3xs rtl:-scale-x-100 rtl:group-hover:-translate-x-3xs rtl:group-focus-visible:-translate-x-3xs",
        direction === "up" && "group-hover:-translate-y-3xs group-focus-visible:-translate-y-3xs",
        direction === "down" && "group-hover:translate-y-3xs group-focus-visible:translate-y-3xs",
        className,
      )}
    >
      {glyph}
    </span>
  );
}
