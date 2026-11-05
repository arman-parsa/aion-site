import NextLink from "next/link";
import Image from "next/image";
import { Arrow } from "@/components/ui";
import type { Service } from "@/lib/content";

/** Full-width "Next — Title →" link; on hover (desktop) an image wipes in. */
export function NextPillar({ service, label }: { service: Service; label: string }) {
  return (
    <NextLink href={`/expertise/${service.slug}`} className="group relative block py-2xl">
      <span className="relative z-10 block font-display text-step-6">
        {label} — <span className="link-underline">{service.title}</span> <Arrow />
      </span>
      <span
        aria-hidden
        className="pointer-events-none absolute end-0 top-1/2 hidden w-1/4 -translate-y-1/2 overflow-hidden transition-[clip-path] duration-slow ease-out-expo [clip-path:inset(100%_0_0_0)] group-hover:[clip-path:inset(0_0_0_0)] group-focus-visible:[clip-path:inset(0_0_0_0)] lg:block"
      >
        <Image
          src={service.image.src}
          alt=""
          width={service.image.width}
          height={service.image.height}
          sizes="25vw"
          className="aspect-portrait h-auto w-full object-cover"
        />
      </span>
    </NextLink>
  );
}
