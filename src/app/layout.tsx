import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata, Viewport } from "next";
import { getSiteSettings } from "@/lib/content";
import { siteUrl } from "@/lib/seo/site-url";
import { fontVariables } from "@/styles/fonts";
import "@/styles/globals.css";

const site = getSiteSettings();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: { template: site.seo.titleTemplate, default: site.seo.defaultTitle },
  description: site.seo.description,
  applicationName: site.name,
  openGraph: { type: "website", siteName: site.name, locale: "en_GB" },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#F2EFE9", // --paper
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" dir="ltr" className={fontVariables} suppressHydrationWarning>
      <head>
        <script
          // Enables motion pre-states (see globals.css). Runs before paint.
          dangerouslySetInnerHTML={{
            __html:
              "if(!matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.classList.add('motion-ok')",
          }}
        />
      </head>
      <body>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
