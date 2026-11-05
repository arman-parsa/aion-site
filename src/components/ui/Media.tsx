import Image, { type ImageProps, type StaticImageData } from "next/image";
import { cn } from "@/lib/utils/cn";

const aspects = {
  square: "aspect-square",
  portrait: "aspect-portrait",
  tall: "aspect-tall",
  landscape: "aspect-landscape",
  wide: "aspect-wide",
  cinema: "aspect-cinema",
  /** Use the image's intrinsic ratio. */
  intrinsic: "",
} as const;

export type MediaAspect = keyof typeof aspects;

type MediaProps = {
  src: string | StaticImageData;
  /** Required. Describe the image; use "" only for purely decorative images. */
  alt: string;
  /** Intrinsic size (required for remote/string sources). */
  width?: number;
  height?: number;
  /** Required: how wide the image renders at each breakpoint. */
  sizes: string;
  aspect?: MediaAspect;
  /** Film-grain overlay. */
  grain?: boolean;
  /** Black-and-white (portraits). */
  mono?: boolean;
  priority?: boolean;
  className?: string;
  imageClassName?: string;
  caption?: React.ReactNode;
} & Pick<ImageProps, "quality" | "placeholder" | "blurDataURL">;

/** next/image in an aspect-ratio frame, cropped with object-cover. */
export function Media({
  src,
  alt,
  width,
  height,
  sizes,
  aspect = "landscape",
  grain = false,
  mono = false,
  priority = false,
  className,
  imageClassName,
  caption,
  ...imageProps
}: MediaProps) {
  const frame = (
    <div className={cn("relative overflow-hidden bg-paper-2", aspects[aspect], grain && "grain")}>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        sizes={sizes}
        priority={priority}
        className={cn("block h-full w-full object-cover", mono && "grayscale", imageClassName)}
        {...imageProps}
      />
    </div>
  );

  if (!caption) return <div className={className}>{frame}</div>;
  return (
    <figure className={className}>
      {frame}
      <figcaption className="mt-2xs label text-ink-2">{caption}</figcaption>
    </figure>
  );
}
