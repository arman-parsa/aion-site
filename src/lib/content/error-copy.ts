/**
 * Error-boundary copy for client components (error.tsx). Imports only the two
 * small objects it needs so the full content bundle and Zod stay out of client
 * JS. Both are validated at build time by load.ts via the main getters.
 */
import { pages } from "@/content/en/pages";
import { ui } from "@/content/en/ui";

export const errorCopy = {
  eyebrow: pages.error.eyebrow,
  title: pages.error.title,
  intro: pages.error.intro,
  retry: ui.error.retry,
  home: ui.error.home,
} as const;
