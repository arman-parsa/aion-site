/**
 * Permanent redirects from the old WordPress site (aionconsults.com).
 * Imported by next.config.ts, so keep this file free of "@/" imports.
 *
 * TODO(seo): the old sitemap couldn't be fetched (the old site is offline).
 * When it's available (live, Wayback Machine or a WordPress export), add every
 * old URL here mapped to its closest new page. Test with e2e/redirects.spec.ts.
 */
export const legacyRedirects: { source: string; destination: string }[] = [
  { source: "/team", destination: "/people" },
  { source: "/team/:path*", destination: "/people" },
  { source: "/our-team", destination: "/people" },
  { source: "/about", destination: "/people" },
  { source: "/about-us", destination: "/people" },
  { source: "/contact-us", destination: "/contact" },
  { source: "/services", destination: "/expertise" },
  { source: "/services/:path*", destination: "/expertise" },
  { source: "/home", destination: "/" },
  { source: "/feed", destination: "/" },
  { source: "/feed/:path*", destination: "/" },
  { source: "/comments/feed", destination: "/" },
  { source: "/privacy-policy", destination: "/privacy" },
  { source: "/cookie-policy", destination: "/cookies" },
];

/** WordPress system paths: answered with 410 Gone by src/proxy.ts. */
export const gonePrefixes = [
  "/wp-admin",
  "/wp-login.php",
  "/xmlrpc.php",
  "/wp-content",
  "/wp-includes",
  "/wp-json",
];
