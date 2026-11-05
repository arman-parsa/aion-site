import type { ReactNode } from "react";

/** Small mono label with a hairline frame (methods, sectors). */
export function Tag({ children }: { children: ReactNode }) {
  return (
    <span className="inline-block border-hairline border-solid border-rule px-2xs py-3xs label text-ink-2">
      {children}
    </span>
  );
}
