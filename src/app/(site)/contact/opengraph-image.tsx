import { getPage } from "@/lib/content";
import { ogContentType, ogSize, renderOg } from "@/lib/seo";

export const alt = "AION Consultancy — Contact";
export const size = ogSize;
export const contentType = ogContentType;

export default async function Image() {
  const page = getPage("contact");
  return renderOg({ eyebrow: page.eyebrow, title: page.title });
}
