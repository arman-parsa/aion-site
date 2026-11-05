import type { MetadataRoute } from "next";
import { getSiteSettings } from "@/lib/content";

export default function manifest(): MetadataRoute.Manifest {
  const site = getSiteSettings();
  return {
    name: site.name,
    short_name: site.wordmark,
    description: site.seo.description,
    start_url: "/",
    display: "browser",
    // Mirrors --paper / --ink tokens.
    background_color: "#F2EFE9",
    theme_color: "#141414",
    icons: [
      { src: "/icon.svg", type: "image/svg+xml", sizes: "any" },
      { src: "/icons/icon-192.png", type: "image/png", sizes: "192x192" },
      { src: "/icons/icon-512.png", type: "image/png", sizes: "512x512" },
    ],
  };
}
