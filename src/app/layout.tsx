import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import { getSiteSettings } from "@/lib/content";
import { fontVariables } from "@/styles/fonts";
import "@/styles/globals.css";

const site = getSiteSettings();

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? site.url),
  title: { template: site.seo.titleTemplate, default: site.seo.defaultTitle },
  description: site.seo.description,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" dir="ltr" className={fontVariables}>
      <body>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
