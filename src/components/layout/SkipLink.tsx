import { getLayoutCopy } from "@/lib/content";

/** First focusable element on every page. */
export function SkipLink() {
  const copy = getLayoutCopy();
  return (
    <a
      href="#main"
      className="sr-only-focusable fixed start-gutter top-s z-60 bg-ink px-s py-xs label text-paper"
    >
      {copy.skipToContent}
    </a>
  );
}
