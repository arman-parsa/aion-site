import { Heading, Media, Text } from "@/components/ui";
import { getUiStrings, type Block, type Body } from "@/lib/content";
import { cn } from "@/lib/utils/cn";

function BlockView({ block }: { block: Block }) {
  const q = getUiStrings().quote;
  switch (block.type) {
    case "paragraph":
      return <Text>{block.text}</Text>;
    case "heading":
      return (
        <Heading
          as={block.level === 2 ? "h2" : "h3"}
          size={block.level === 2 ? 4 : 3}
          className="pt-m first:pt-0"
        >
          {block.text}
        </Heading>
      );
    case "quote":
      return (
        <figure>
          <blockquote className="font-display text-step-4">
            {q.open}
            {block.text}
            {q.close}
          </blockquote>
          {block.attribution && (
            <figcaption className="mt-s label text-ink-2">
              {block.attribution}
              {block.role && `, ${block.role}`}
            </figcaption>
          )}
        </figure>
      );
    case "image":
      return (
        <Media
          src={block.image.src}
          alt={block.image.decorative ? "" : block.image.alt}
          width={block.image.width}
          height={block.image.height}
          sizes={block.layout === "full" ? "100vw" : "(min-width: 1024px) 60vw, 100vw"}
          aspect="intrinsic"
          caption={block.image.caption}
          className={cn(
            block.layout === "full" && "full-bleed",
            block.layout === "wide" && "breakout",
          )}
        />
      );
    case "list": {
      const Tag = block.style === "numbered" ? "ol" : "ul";
      return (
        <Tag
          className={cn(
            "flex flex-col gap-2xs ps-m measure",
            block.style === "numbered" ? "list-decimal" : "list-disc",
          )}
        >
          {block.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </Tag>
      );
    }
    case "stat-row":
      return (
        <dl className="grid grid-cols-2 gap-m md:grid-cols-4">
          {block.stats.map((s) => (
            <div key={s.label} className="pt-s rule">
              <dt className="label text-ink-2">{s.label}</dt>
              <dd className="font-display text-step-5">
                {s.prefix}
                {s.value}
                {s.suffix}
              </dd>
            </div>
          ))}
        </dl>
      );
  }
}

/** Renders CMS-style body blocks with the house primitives. */
export function BodyBlocks({ body, className }: { body: Body; className?: string }) {
  if (body.length === 0) return null;
  return (
    <div className={cn("flex flex-col gap-m", className)}>
      {body.map((block, i) => (
        <BlockView key={i} block={block} />
      ))}
    </div>
  );
}
