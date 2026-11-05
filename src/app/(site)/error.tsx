"use client";

import NextLink from "next/link";
import { useEffect } from "react";
import { errorCopy } from "@/lib/content/error-copy";

export default function SiteError({ error, retry }: { error: unknown; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="theme-paper pt-page-top pb-3xl">
      <div className="layout-grid">
        <p className="label text-ink-2">{errorCopy.eyebrow}</p>
        <h1 className="mt-s font-display text-step-7">{errorCopy.title}</h1>
        <p className="mt-m text-step-2 text-ink-2">{errorCopy.intro}</p>
        <div className="mt-l flex flex-wrap gap-l">
          <button
            type="button"
            onClick={() => retry()}
            className="cursor-pointer link-underline-rest label"
          >
            {errorCopy.retry}
          </button>
          <NextLink href="/" className="link-underline-rest label">
            {errorCopy.home}
          </NextLink>
        </div>
      </div>
    </section>
  );
}
