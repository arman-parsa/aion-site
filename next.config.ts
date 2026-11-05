import type { NextConfig } from "next";

// Validate env vars at build/dev start. Throws on missing or invalid values.
import "./src/env";

const isDev = process.env.NODE_ENV === "development";

/**
 * Static (non-nonce) CSP so pages stay statically rendered and CDN-cacheable.
 * Nonces would force every page to dynamic rendering (see Next docs:
 * guides/content-security-policy). Trade-off: script-src needs 'unsafe-inline'
 * for Next's inline bootstrap scripts.
 *
 * Allow-listed third parties:
 * - Vercel Web Analytics / Speed Insights: served same-origin from /_vercel/*
 *   in production; va.vercel-scripts.com is the debug/dev script host.
 * - Cloudflare Turnstile: script + iframe + XHR on challenges.cloudflare.com.
 */
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""} https://va.vercel-scripts.com https://challenges.cloudflare.com`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' blob: data:",
  "font-src 'self'",
  "connect-src 'self' https://vitals.vercel-insights.com https://va.vercel-scripts.com https://challenges.cloudflare.com",
  "frame-src https://challenges.cloudflare.com",
  "worker-src 'self' blob:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  ...(isDev ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value:
      "camera=(), microphone=(), geolocation=(), browsing-topics=(), payment=(), usb=()",
  },
  { key: "X-Frame-Options", value: "DENY" },
];

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  poweredByHeader: false,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
};

export default nextConfig;
