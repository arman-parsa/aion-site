import NextLink from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { getUiStrings } from "@/lib/content";
import { cn } from "@/lib/utils/cn";

const underlines = {
  /** No underline at rest; draws in from the start edge on hover. */
  hover: "link-underline",
  /** Faint underline at rest; ink underline draws over it on hover. */
  rest: "link-underline-rest",
  none: "",
} as const;

export type LinkProps = {
  href: string;
  children: ReactNode;
  underline?: keyof typeof underlines;
  /** Force new-tab behaviour. Defaults to true for http(s) links to other origins. */
  newTab?: boolean;
} & Omit<ComponentPropsWithoutRef<"a">, "href" | "children">;

export function isExternal(href: string): boolean {
  return /^https?:\/\//i.test(href);
}

/**
 * Internal links go through next/link (prefetching); external http(s) links
 * open in a new tab with rel="noopener noreferrer" and a screen-reader hint;
 * mailto:/tel: render as plain anchors.
 */
export function Link({
  href,
  children,
  underline = "hover",
  newTab,
  className,
  ...props
}: LinkProps) {
  const classes = cn(underlines[underline], className);
  const external = isExternal(href);
  const plain = external || /^(mailto|tel):/i.test(href);

  if (!plain) {
    return (
      <NextLink href={href} className={classes} {...props}>
        {children}
      </NextLink>
    );
  }

  const openNew = newTab ?? external;
  return (
    <a
      href={href}
      className={classes}
      {...(openNew ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      {...props}
    >
      {children}
      {openNew && <span className="sr-only"> {getUiStrings().opensInNewTab}</span>}
    </a>
  );
}
