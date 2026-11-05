"use client";

import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { formatIndex } from "@/components/ui/Eyebrow";
import { EASE_OUT_EXPO, gsap, useGSAP } from "@/lib/motion/gsap";
import { lockScroll } from "@/lib/motion/lenis";
import { prefersReducedMotion } from "@/lib/motion/reduced-motion";
import { useMenu } from "./MenuContext";
import { MENU_ID } from "./MenuToggle";

type Item = { label: string; href: string };
type Detail = { label: string; value: string; href?: string };

type Props = {
  items: Item[];
  label: string;
  primaryHeading: string;
  secondaryHeading: string;
  details: Detail[];
};

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';
/** Regions made inert while the menu is open (header bar items opt in with this attribute). */
const INERT_SELECTOR = "#main, #site-footer, [data-inert-with-menu]";

/**
 * Full-screen menu. Clips down from the top (expo-out), links rise in line by
 * line. Focus is trapped between the toggle and the menu; Esc closes and
 * returns focus to the toggle; page scroll (and Lenis) is paused.
 */
export function MenuOverlay({ items, label, primaryHeading, secondaryHeading, details }: Props) {
  const { open, setOpen, toggleRef } = useMenu();
  const scope = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const firstRender = useRef(true);

  // Close on navigation.
  useEffect(() => {
    setOpen(false);
  }, [pathname, setOpen]);

  // Animation.
  useGSAP(
    () => {
      const el = scope.current;
      if (!el) return;
      const lines = el.querySelectorAll("[data-menu-line]");
      const fades = el.querySelectorAll("[data-menu-fade]");
      const reduced = prefersReducedMotion();

      if (firstRender.current) {
        firstRender.current = false;
        gsap.set(el, { autoAlpha: 0, clipPath: "inset(0% 0% 100% 0%)" });
        return;
      }

      if (open) {
        gsap.set(el, { autoAlpha: 1 });
        if (reduced) {
          gsap.set(el, { clipPath: "inset(0% 0% 0% 0%)" });
          gsap.set(lines, { yPercent: 0 });
          gsap.set(fades, { opacity: 1 });
          return;
        }
        gsap
          .timeline()
          .fromTo(
            el,
            { clipPath: "inset(0% 0% 100% 0%)" },
            { clipPath: "inset(0% 0% 0% 0%)", duration: 1, ease: EASE_OUT_EXPO },
          )
          .fromTo(
            lines,
            { yPercent: 110 },
            { yPercent: 0, duration: 1, ease: EASE_OUT_EXPO, stagger: 0.06 },
            0.2,
          )
          .fromTo(fades, { opacity: 0 }, { opacity: 1, duration: 0.8, ease: EASE_OUT_EXPO }, 0.5);
      } else {
        if (reduced) {
          gsap.set(el, { autoAlpha: 0, clipPath: "inset(0% 0% 100% 0%)" });
          return;
        }
        gsap.to(el, {
          clipPath: "inset(0% 0% 100% 0%)",
          duration: 0.8,
          ease: "expo.inOut",
          onComplete: () => {
            gsap.set(el, { autoAlpha: 0 });
          },
        });
      }
    },
    { scope, dependencies: [open] },
  );

  // Focus, inert, scroll lock, keyboard.
  useEffect(() => {
    if (!open) return;
    const el = scope.current;
    const toggle = toggleRef.current;
    const inertTargets = Array.from(document.querySelectorAll<HTMLElement>(INERT_SELECTOR));
    inertTargets.forEach((t) => (t.inert = true));
    lockScroll(true);
    el?.querySelector<HTMLElement>(FOCUSABLE)?.focus({ preventScroll: true });

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setOpen(false);
        return;
      }
      if (e.key !== "Tab" || !el) return;
      const focusables = [
        ...(toggle ? [toggle] : []),
        ...Array.from(el.querySelectorAll<HTMLElement>(FOCUSABLE)),
      ];
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (!first || !last) return;
      const active = document.activeElement;
      if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      } else if (!focusables.includes(active as HTMLElement)) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);

    return () => {
      document.removeEventListener("keydown", onKey);
      inertTargets.forEach((t) => (t.inert = false));
      lockScroll(false);
      toggle?.focus({ preventScroll: true });
    };
  }, [open, setOpen, toggleRef]);

  return (
    <div
      ref={scope}
      id={MENU_ID}
      inert={!open}
      className="theme-paper invisible fixed inset-0 z-40 overflow-y-auto"
      data-lenis-prevent
    >
      <nav aria-label={label} className="layout-grid min-h-full pt-header pb-xl">
        <div className="mt-l grid-12 gap-y-xl">
          <div className="col-span-12 lg:col-span-8">
            <h2 className="sr-only">{primaryHeading}</h2>
            <ol className="flex flex-col dim-siblings">
              {items.map((item, i) => (
                <li key={item.href} className="rule-b first:rule">
                  <NextLink
                    href={item.href}
                    onClick={() => setOpen(false)}
                    aria-current={pathname === item.href ? "page" : undefined}
                    className="group flex items-baseline gap-s overflow-hidden py-2xs"
                  >
                    <span data-menu-line className="flex items-baseline gap-s">
                      <span className="label text-ink-2 tabular-nums">{formatIndex(i + 1)}</span>
                      <span className="font-display text-step-6 transition-transform duration-base ease-out-expo group-hover:translate-x-2xs group-focus-visible:translate-x-2xs rtl:group-hover:-translate-x-2xs">
                        {item.label}
                      </span>
                    </span>
                  </NextLink>
                </li>
              ))}
            </ol>
          </div>
          <div data-menu-fade className="col-span-12 lg:col-span-3 lg:col-start-10 lg:self-end">
            <h2 className="label text-ink-2">{secondaryHeading}</h2>
            <dl className="mt-s flex flex-col gap-s">
              {details.map((d) => (
                <div key={d.label}>
                  <dt className="label text-ink-2">{d.label}</dt>
                  <dd className="mt-3xs text-step-0">
                    {d.href ? (
                      <a
                        href={d.href}
                        className="link-underline-rest"
                        {...(d.href.startsWith("http")
                          ? { target: "_blank", rel: "noopener noreferrer" }
                          : {})}
                      >
                        {d.value}
                      </a>
                    ) : (
                      d.value
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </nav>
    </div>
  );
}
