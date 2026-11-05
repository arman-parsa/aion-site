import type { ImageInput } from "@/lib/content/schema";

/**
 * Shared placeholder art. Every use is flagged `placeholder: true` and must be
 * replaced with real photography before launch (see `pnpm content:todo`).
 */
export const placeholderLandscape = (alt: string): ImageInput => ({
  src: "/images/placeholders/plate-landscape.jpg",
  alt,
  width: 1800,
  height: 1200,
  placeholder: true,
});

export const placeholderPortrait = (alt: string): ImageInput => ({
  src: "/images/placeholders/plate-portrait.jpg",
  alt,
  width: 1200,
  height: 1500,
  placeholder: true,
});
