import { displayName, getPerson } from "@/lib/content";
import { ogContentType, ogSize, renderOg } from "@/lib/seo";

export const alt = "AION Consultancy — People";
export const size = ogSize;
export const contentType = ogContentType;

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const person = getPerson(slug);
  return renderOg({
    eyebrow: person?.honorifics.join(", ") || "People",
    title: person ? displayName(person) : "AION Consultancy",
  });
}
