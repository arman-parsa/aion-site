import type { ComponentPropsWithoutRef, ElementType } from "react";
import type { TypeStep } from "@/styles/tokens";
import { cn } from "@/lib/utils/cn";
import { stepClasses } from "./Heading";

const tones = {
  ink: "text-ink",
  "ink-2": "text-ink-2",
  /** Stone is 3.1:1 on paper: only use at step-1 and above. */
  stone: "text-stone",
  accent: "text-accent-text",
} as const;

type TextProps = {
  as?: "p" | "span" | "div" | "li" | "dd" | "dt" | "figcaption" | "small";
  size?: Extract<TypeStep, -2 | -1 | 0 | 1 | 2 | 3>;
  tone?: keyof typeof tones;
  /** Cap line length at the reading measure (65ch). */
  measure?: boolean;
} & ComponentPropsWithoutRef<"p">;

/** Body copy. Use size 2–3 for ledes. */
export function Text({
  as = "p",
  size = 0,
  tone = "ink",
  measure = true,
  className,
  ...props
}: TextProps) {
  const Tag = as as ElementType;
  return (
    <Tag
      className={cn(stepClasses[size], tones[tone], measure && "measure", className)}
      {...props}
    />
  );
}
