import { cn } from "@/lib/utils/cn";

type RuleProps = {
  tone?: "rule" | "ink" | "accent";
  /** Decorative rules are hidden from assistive tech (default). */
  decorative?: boolean;
  /** Draw in from the start edge when scrolled into view. */
  draw?: boolean;
  className?: string;
};

const tones = {
  rule: "border-rule",
  ink: "border-ink",
  accent: "border-accent",
} as const;

/** 1px hairline. */
export function Rule({ tone = "rule", decorative = true, draw = false, className }: RuleProps) {
  return (
    <hr
      aria-hidden={decorative || undefined}
      data-draw={draw || undefined}
      className={cn("border-0 border-t-hairline border-solid", tones[tone], className)}
    />
  );
}
