import type { ComponentPropsWithoutRef, ElementType } from "react";
import { cn } from "@/lib/utils/cn";

const rowGaps = {
  none: "",
  s: "gap-y-s",
  m: "gap-y-m",
  l: "gap-y-l",
  xl: "gap-y-xl",
} as const;

type GridProps<T extends ElementType> = {
  as?: T;
  rowGap?: keyof typeof rowGaps;
} & Omit<ComponentPropsWithoutRef<T>, "as">;

/** 12-column grid with a fluid column gap. Place children with col-span-* / col-start-*. */
export function Grid<T extends ElementType = "div">({
  as,
  rowGap = "m",
  className,
  ...props
}: GridProps<T>) {
  const Tag: ElementType = as ?? "div";
  return <Tag className={cn("grid-12", rowGaps[rowGap], className)} {...props} />;
}
