import { getPage, getService } from "@/lib/content";
import { ogContentType, ogSize, renderOg } from "@/lib/seo";

export const alt = "AION Consultancy — Expertise";
export const size = ogSize;
export const contentType = ogContentType;

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return renderOg({
    eyebrow: getPage("expertise").eyebrow,
    title: getService(slug)?.title ?? "AION Consultancy",
  });
}
