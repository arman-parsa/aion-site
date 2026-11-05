"use client";

import Image from "next/image";
import NextLink from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils/cn";

export type PersonCard = {
  href: string;
  name: string;
  honorifics: string;
  role: string;
  portrait: { src: string; alt: string; width: number; height: number };
};

type Props = {
  people: PersonCard[];
  labels: { view: string; list: string; grid: string; listLabel: string };
};

/**
 * People as a list (default, server-rendered) or a portrait grid. The toggle
 * is a labelled group of two pressed-state buttons; without JS the list shows.
 */
export function PeopleIndex({ people, labels }: Props) {
  const [view, setView] = useState<"list" | "grid">("list");

  return (
    <div>
      <div role="group" aria-label={labels.view} className="flex justify-end gap-m pb-s label">
        {(["list", "grid"] as const).map((v) => (
          <button
            key={v}
            type="button"
            aria-pressed={view === v}
            onClick={() => setView(v)}
            className={cn(
              "cursor-pointer py-2xs",
              view === v ? "link-underline-rest text-ink" : "link-underline text-ink-2",
            )}
          >
            {labels[v]}
          </button>
        ))}
      </div>

      {view === "list" ? (
        <ul aria-label={labels.listLabel} className="dim-siblings rule-b">
          {people.map((p) => (
            <li key={p.href} className="rule">
              <NextLink href={p.href} className="group grid-12 items-center gap-y-2xs py-m">
                <span className="col-span-9 md:col-span-6">
                  <span className="block font-display text-step-5">{p.name}</span>
                  {p.honorifics && (
                    <span className="mt-2xs block label text-ink-2">{p.honorifics}</span>
                  )}
                </span>
                <span className="col-span-9 text-step-0 text-ink-2 md:col-span-4">{p.role}</span>
                <span className="duotone col-span-3 col-start-10 row-span-2 row-start-1 block overflow-hidden md:col-span-2 md:col-start-11 md:row-span-1">
                  <Image
                    src={p.portrait.src}
                    alt=""
                    width={p.portrait.width}
                    height={p.portrait.height}
                    sizes="(min-width: 768px) 12vw, 25vw"
                    className="aspect-portrait h-auto w-full object-cover"
                  />
                </span>
              </NextLink>
            </li>
          ))}
        </ul>
      ) : (
        <ul
          aria-label={labels.listLabel}
          className="grid grid-cols-2 gap-x-grid-gap gap-y-xl md:grid-cols-3 lg:grid-cols-4"
        >
          {people.map((p) => (
            <li key={p.href}>
              <NextLink href={p.href} className="group block">
                <span className="duotone block overflow-hidden">
                  <Image
                    src={p.portrait.src}
                    alt={p.portrait.alt}
                    width={p.portrait.width}
                    height={p.portrait.height}
                    sizes="(min-width: 1024px) 22vw, (min-width: 768px) 30vw, 45vw"
                    className="aspect-portrait h-auto w-full object-cover transition-transform duration-slow ease-out-expo group-hover:scale-[1.03]"
                  />
                </span>
                <span className="mt-s block font-display text-step-3">
                  <span className="link-underline">{p.name}</span>
                </span>
                {p.honorifics && (
                  <span className="mt-3xs block label text-ink-2">{p.honorifics}</span>
                )}
                <span className="mt-2xs block text-step--1 text-ink-2">{p.role}</span>
              </NextLink>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
