"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useMenu } from "./MenuContext";

/**
 * Fixed header that slides away on scroll down and returns on scroll up.
 * Transform only, so no layout shift. Stays visible while the menu is open or
 * when anything inside it has keyboard focus.
 */
export function HeaderShell({ children }: { children: ReactNode }) {
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);
  const { open } = useMenu();

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const delta = y - lastY.current;
      if (Math.abs(delta) < 6) return;
      setHidden(delta > 0 && y > 120);
      lastY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isHidden = hidden && !open;

  return (
    <header
      data-hidden={isHidden || undefined}
      onFocusCapture={() => setHidden(false)}
      className="fixed inset-x-0 top-0 z-50 text-blend mix-blend-difference transition-transform duration-slow ease-out-expo data-hidden:-translate-y-full"
    >
      {children}
    </header>
  );
}
