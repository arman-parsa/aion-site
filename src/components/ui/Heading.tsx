import type { ComponentPropsWithoutRef } from "react";
import type { TypeStep } from "@/styles/tokens";
import { cn } from "@/lib/utils/cn";

/** Literal class names so Tailwind can see them. */
export const stepClasses: Record<TypeStep, string> = {
  [-2]: "text-step--2",
  [-1]: "text-step--1",
  0: "text-step-0",
  1: "text-step-1",
  2: "text-step-2",
  3: "text-step-3",
  4: "text-step-4",
  5: "text-step-5",
  6: "text-step-6",
  7: "text-step-7",
  8: "text-step-8",
};

type HeadingTag = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span";

type HeadingProps = {
  as?: HeadingTag;
  /** Type-scale step. Defaults by tag: h1→7, h2→5, h3→3, h4→2, others→1. */
  size?: TypeStep;
  font?: "display" | "sans";
  italic?: boolean;
} & ComponentPropsWithoutRef<"h2">;

const defaultSize: Record<HeadingTag, TypeStep> = {
  h1: 7,
  h2: 5,
  h3: 3,
  h4: 2,
  h5: 1,
  h6: 1,
  p: 1,
  span: 1,
};

/**
 * Semantic level (`as`) and visual size (`size`) are independent, so the
 * outline stays correct (one h1 per page) whatever the design calls for.
 * Leading and tracking come from the step token. Wrap a phrase in <em> for
 * the display italic.
 */
export function Heading({
  as = "h2",
  size,
  font = "display",
  italic = false,
  className,
  ...props
}: HeadingProps) {
  const Tag = as;
  const step = size ?? defaultSize[as];
  return (
    <Tag
      className={cn(
        stepClasses[step],
        font === "display" ? "font-display" : "font-sans font-medium",
        italic && "font-display-italic",
        className,
      )}
      {...props}
    />
  );
}
