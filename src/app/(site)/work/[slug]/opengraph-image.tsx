import { getCaseStudy } from "@/lib/content";
import { ogContentType, ogSize, renderOg } from "@/lib/seo";

export const alt = "AION Consultancy — Work";
export const size = ogSize;
export const contentType = ogContentType;

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const work = getCaseStudy(slug);
  return renderOg({ eyebrow: work?.sector, title: work?.title ?? "AION Consultancy" });
}
