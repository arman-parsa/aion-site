import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils/cn";
import { Container } from "./Container";

export const sectionThemes = {
  paper: "theme-paper",
  "paper-2": "theme-paper bg-paper-2",
  ink: "theme-ink",
} as const;

const spacings = {
  none: "",
  m: "py-xl",
  l: "py-2xl",
  xl: "py-3xl",
  "2xl": "py-4xl",
} as const;

export type SectionTheme = keyof typeof sectionThemes;

type SectionProps = {
  theme?: SectionTheme;
  spacing?: keyof typeof spacings;
  /** Wrap children in the layout grid (default). Set false for full-bleed custom layouts. */
  contained?: boolean;
} & ComponentPropsWithoutRef<"section">;

/** A themed band of the page. `theme="ink"` inverts paper/ink for dark sections. */
export function Section({
  theme = "paper",
  spacing = "l",
  contained = true,
  className,
  children,
  ...props
}: SectionProps) {
  return (
    <section className={cn(sectionThemes[theme], spacings[spacing], className)} {...props}>
      {contained ? <Container>{children}</Container> : children}
    </section>
  );
}
