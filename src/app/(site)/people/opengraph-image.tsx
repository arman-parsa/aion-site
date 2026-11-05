import { getPage } from "@/lib/content";
import { ogContentType, ogSize, renderOg } from "@/lib/seo";

export const alt = "AION Consultancy — People";
export const size = ogSize;
export const contentType = ogContentType;

export default async function Image() {
  const page = getPage("people");
  return renderOg({ eyebrow: page.eyebrow, title: page.title });
}
