import type { ReactNode } from "react";

/** A labelled list with hairline rules between items (credentials, affiliations). */
export function RuledList({ title, id, items }: { title: string; id: string; items: ReactNode[] }) {
  if (items.length === 0) return null;
  return (
    <section aria-labelledby={id} className="mt-2xl">
      <h2 id={id} className="label text-ink-2">
        {title}
      </h2>
      <ul className="mt-s rule-b">
        {items.map((item, i) => (
          <li key={i} className="py-s text-step-0 rule">
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}
