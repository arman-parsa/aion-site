import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/utils/cn";
import { Arrow } from "./Arrow";
import { Link } from "./Link";

const variants = {
  /** Solid ink block. Use once per view at most. */
  primary:
    "bg-ink text-paper px-m py-xs hover:bg-accent hover:text-accent-ink focus-visible:bg-accent focus-visible:text-accent-ink",
  /** Hairline outline. */
  ghost:
    "border-hairline border-solid border-ink px-m py-xs hover:bg-ink hover:text-paper focus-visible:bg-ink focus-visible:text-paper",
  /** Text link with a trailing arrow. The default CTA style. */
  text: "link-underline-rest py-3xs",
} as const;

type Common = {
  variant?: keyof typeof variants;
  /** Show the trailing arrow (always on for `text`). */
  arrow?: boolean;
  children: ReactNode;
  className?: string;
};

type AsLink = Common & { href: string } & Omit<
    ComponentPropsWithoutRef<"a">,
    "href" | "children" | "className"
  >;
type AsButton = Common & { href?: undefined } & Omit<
    ComponentPropsWithoutRef<"button">,
    "children" | "className"
  >;

export type ButtonProps = AsLink | AsButton;

/** Renders a link when `href` is set, otherwise a <button>. Arrow nudges on hover (CSS only). */
export function Button(props: ButtonProps) {
  const { variant = "text", arrow, children, className } = props;
  const showArrow = arrow ?? variant === "text";
  const classes = cn(
    "group inline-flex items-center gap-2xs text-step-0 leading-none transition-colors duration-base ease-out-expo",
    variants[variant],
    className,
  );
  const content = (
    <>
      <span>{children}</span>
      {showArrow && <Arrow />}
    </>
  );

  if (props.href !== undefined) {
    const { variant: _v, arrow: _a, children: _c, className: _cl, href, ...rest } = props;
    return (
      <Link href={href} underline="none" className={classes} {...rest}>
        {content}
      </Link>
    );
  }

  const {
    variant: _v,
    arrow: _a,
    children: _c,
    className: _cl,
    href: _h,
    type = "button",
    ...rest
  } = props;
  return (
    <button type={type} className={cn(classes, "cursor-pointer")} {...rest}>
      {content}
    </button>
  );
}
