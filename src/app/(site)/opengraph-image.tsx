import { getPage } from "@/lib/content";
import { ogContentType, ogSize, renderOg } from "@/lib/seo";

export const alt = "AION Consultancy";
export const size = ogSize;
export const contentType = ogContentType;

export default async function Image() {
  // Site-wide default card; sections with their own opengraph-image override it.
  return renderOg({ title: getPage("expertise").title });
}
