import type { ComponentPropsWithoutRef, ElementType } from "react";
import { cn } from "@/lib/utils/cn";

type ContainerProps<T extends ElementType> = {
  as?: T;
} & Omit<ComponentPropsWithoutRef<T>, "as">;

/**
 * Page-width layout grid with fluid gutters. Children sit in the content
 * column (max 1440px); add `breakout` or `full-bleed` to a child to widen it.
 */
export function Container<T extends ElementType = "div">({
  as,
  className,
  ...props
}: ContainerProps<T>) {
  const Tag: ElementType = as ?? "div";
  return <Tag className={cn("layout-grid", className)} {...props} />;
}
