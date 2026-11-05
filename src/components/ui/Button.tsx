import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/utils/cn";
import { Arrow } from "./Arrow";
import { Link } from "./Link";

const variants = {
  /** Solid ink block with mono uppercase label (OCI-style). Once per view at most. */
  primary:
    "label bg-ink text-paper border border-solid border-ink px-l py-s hover:bg-transparent hover:text-ink focus-visible:bg-transparent focus-visible:text-ink",
  /** Hairline outline, fills on hover. */
  ghost:
    "label border border-solid border-ink px-l py-s hover:bg-ink hover:text-paper focus-visible:bg-ink focus-visible:text-paper",
  /** Light outline for use over photography; fills on hover. */
  onImage:
    "label border border-solid border-on-image text-on-image px-l py-s hover:bg-on-image hover:text-ink focus-visible:bg-on-image focus-visible:text-ink",
  /** Text link with a trailing arrow. The default CTA style. */
  text: "text-step-0 link-underline-rest py-3xs",
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
    "group inline-flex items-center gap-s leading-none transition-colors duration-base ease-out-expo",
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
