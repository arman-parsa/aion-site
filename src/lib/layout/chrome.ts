/**
 * Per-route chrome settings. Decided from the pathname (not by looking for
 * markers in the DOM): with Cache Components, Next keeps previously visited
 * routes mounted but hidden, so DOM markers from other pages linger.
 */

/** Pages whose first screen is a full-bleed photo: header type turns light. */
export const HEADER_ON_IMAGE_PATHS = ["/"] as const;

/** Pages that render without the footer. */
export const NO_FOOTER_PATHS = ["/", "/contact"] as const;

export const isHeaderOnImage = (pathname: string) =>
  (HEADER_ON_IMAGE_PATHS as readonly string[]).includes(pathname);

export const hasFooter = (pathname: string) =>
  !(NO_FOOTER_PATHS as readonly string[]).includes(pathname);
