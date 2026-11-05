/** Viewport widths from CLAUDE.md: mobile 390, tablet 768, desktop 1440, wide 1920. */
export const viewports = {
  mobile: { width: 390, height: 844 },
  tablet: { width: 768, height: 1024 },
  desktop: { width: 1440, height: 900 },
  wide: { width: 1920, height: 1080 },
} as const;

export type ViewportName = keyof typeof viewports;
