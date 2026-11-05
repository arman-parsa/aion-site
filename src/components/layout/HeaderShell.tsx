"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { isHeaderOnImage } from "@/lib/layout/chrome";
import { cn } from "@/lib/utils/cn";
import { useMenu } from "./MenuContext";

/**
 * Fixed header that slides away on scroll down and returns on scroll up
 * (transform only, so no layout shift). Transparent at the top of the page;
 * once scrolled it sits on paper with a hairline so content can't clash with
 * it. Over a full-bleed photo (see HEADER_ON_IMAGE_PATHS) the type turns
 * light; everywhere else it is ink, so it never disappears on paper.
 * Stays visible while the menu is open or when focused.
 */
export function HeaderShell({ children }: { children: ReactNode }) {
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const lastY = useRef(0);
  const { open } = useMenu();
  const pathname = usePathname();
  const light = isHeaderOnImage(pathname) && !open && !scrolled;

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 8);
      const delta = y - lastY.current;
      if (Math.abs(delta) < 6) return;
      setHidden(delta > 0 && y > 120);
      lastY.current = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      data-hidden={(hidden && !open) || undefined}
      data-scrolled={(scrolled && !open) || undefined}
      data-menu-open={open || undefined}
      onFocusCapture={() => setHidden(false)}
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b border-solid border-transparent transition-[transform,background-color,border-color,color] duration-slow ease-out-expo data-hidden:-translate-y-full data-scrolled:border-rule data-scrolled:bg-paper",
        light ? "text-on-image" : "text-ink",
      )}
    >
      {children}
    </header>
  );
}
