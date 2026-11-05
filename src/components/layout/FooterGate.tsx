"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { hasFooter } from "@/lib/layout/chrome";

/** Renders the (server-rendered) footer except on pages that opt out. */
export function FooterGate({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  return hasFooter(pathname) ? children : null;
}
