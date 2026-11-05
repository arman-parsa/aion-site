import { cn } from "@/lib/utils/cn";

type RuleProps = {
  tone?: "rule" | "ink" | "accent";
  /** Decorative rules are hidden from assistive tech (default). */
  decorative?: boolean;
  className?: string;
};

const tones = {
  rule: "border-rule",
  ink: "border-ink",
  accent: "border-accent",
} as const;

/** 1px hairline. */
export function Rule({ tone = "rule", decorative = true, className }: RuleProps) {
  return (
    <hr
      aria-hidden={decorative || undefined}
      className={cn("border-0 border-t-hairline border-solid", tones[tone], className)}
    />
  );
}
