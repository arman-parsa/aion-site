import type { Metadata } from "next";
import { SiteChrome } from "@/components/layout";
import { NotFoundContent } from "@/components/sections";
import { getPage } from "@/lib/content";

export const metadata: Metadata = {
  title: getPage("notFound").seo.title,
  robots: { index: false },
};

/** Unmatched URLs (outside any route group) still get the full site chrome. */
export default function NotFound() {
  return (
    <SiteChrome>
      <NotFoundContent />
    </SiteChrome>
  );
}
