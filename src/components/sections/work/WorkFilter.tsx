import NextLink from "next/link";
import { cn } from "@/lib/utils/cn";

type Props = {
  label: string;
  allLabel: string;
  options: { slug: string; title: string }[];
  current?: string;
};

/** Plain links (?service=slug): works without JS, server-filtered. */
export function WorkFilter({ label, allLabel, options, current }: Props) {
  const items = [{ slug: undefined, title: allLabel }, ...options];
  return (
    <nav aria-label={label}>
      <ul className="flex flex-wrap gap-x-m gap-y-2xs label">
        {items.map((o) => {
          const isCurrent = o.slug === current;
          return (
            <li key={o.slug ?? "all"}>
              <NextLink
                href={o.slug ? `/work?service=${o.slug}` : "/work"}
                aria-current={isCurrent ? "page" : undefined}
                scroll={false}
                className={cn(
                  "py-2xs",
                  isCurrent ? "link-underline-rest text-ink" : "link-underline text-ink-2",
                )}
              >
                {o.title}
              </NextLink>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
