import NextLink from "next/link";
import { Arrow, formatIndex } from "@/components/ui";

type Item = { href: string; title: string; meta?: string };

/** Numbered index rows with hairline rules; hovering one dims the rest. */
export function IndexList({ items, label }: { items: Item[]; label?: string }) {
  return (
    <ol aria-label={label} className="flex flex-col dim-siblings rule-b">
      {items.map((item, i) => (
        <li key={item.href} className="rule">
          <NextLink href={item.href} className="group grid-12 items-baseline gap-y-2xs py-m">
            <span className="col-span-2 label text-ink-2 tabular-nums md:col-span-1">
              {formatIndex(i + 1)}
            </span>
            <span className="col-span-10 font-display text-step-4 md:col-span-7">{item.title}</span>
            {item.meta && (
              <span className="col-span-10 col-start-3 label text-ink-2 md:col-span-3 md:col-start-auto">
                {item.meta}
              </span>
            )}
            <span className="hidden justify-self-end md:col-span-1 md:block">
              <Arrow />
            </span>
          </NextLink>
        </li>
      ))}
    </ol>
  );
}
