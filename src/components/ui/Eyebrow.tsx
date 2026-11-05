import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils/cn";

type EyebrowProps = {
  /** Renders as a zero-padded index, e.g. 1 → "(01)". */
  index?: number;
  as?: "p" | "span" | "div";
} & ComponentPropsWithoutRef<"p">;

export function formatIndex(n: number): string {
  return `(${String(n).padStart(2, "0")})`;
}

/** Small mono uppercase label: "(01) Our process". */
export function Eyebrow({ index, as = "p", className, children, ...props }: EyebrowProps) {
  const Tag = as;
  return (
    <Tag className={cn("label text-ink-2", className)} {...props}>
      {index !== undefined && <span className="me-2xs tabular-nums">{formatIndex(index)}</span>}
      {children}
    </Tag>
  );
}
