import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

// Colours mirror the design tokens in globals.css (OG images can't read CSS).
const PAPER = "#F2EFE9";
const INK = "#141414";
const INK_2 = "#3A3A38";
const ACCENT = "#B4532A";

const fontDir = join(process.cwd(), "src/app/_og");
const fonts = Promise.all([
  readFile(join(fontDir, "InstrumentSerif-Regular.ttf")),
  readFile(join(fontDir, "GeistMono-Regular.ttf")),
]);

/** House-style share card: paper, display-serif title, mono eyebrow, wordmark. */
export async function renderOg({ eyebrow, title }: { eyebrow?: string; title: string }) {
  const [serif, mono] = await fonts;
  const size = title.length > 40 ? 76 : title.length > 22 ? 96 : 120;
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: PAPER,
        color: INK,
        padding: "64px 72px",
      }}
    >
      <div style={{ display: "flex", alignItems: "baseline", gap: 14 }}>
        <span style={{ fontFamily: "Serif", fontSize: 44, lineHeight: 1 }}>AION</span>
        <span
          style={{ fontFamily: "Mono", fontSize: 18, letterSpacing: 2, textTransform: "uppercase" }}
        >
          Consultancy
        </span>
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {eyebrow && (
          <span
            style={{
              fontFamily: "Mono",
              fontSize: 20,
              letterSpacing: 2,
              textTransform: "uppercase",
              color: INK_2,
              marginBottom: 20,
            }}
          >
            {eyebrow}
          </span>
        )}
        <span
          style={{
            fontFamily: "Serif",
            fontSize: size,
            lineHeight: 0.95,
            letterSpacing: -2,
            maxWidth: 1000,
          }}
        >
          {title}
        </span>
      </div>
      <div style={{ display: "flex", height: 2, width: 120, background: ACCENT }} />
    </div>,
    {
      ...ogSize,
      fonts: [
        { name: "Serif", data: serif, style: "normal", weight: 400 },
        { name: "Mono", data: mono, style: "normal", weight: 400 },
      ],
    },
  );
}
