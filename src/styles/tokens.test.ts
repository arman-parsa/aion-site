import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { themeCss, typeScale } from "./tokens";

const css = readFileSync(path.join(__dirname, "globals.css"), "utf8");

describe("design tokens", () => {
  it("globals.css contains the generated fluid scale (run `pnpm tokens` if this fails)", () => {
    for (const line of themeCss().split("\n")) expect(css).toContain(line.trim());
  });

  it("step-8 spans roughly 4rem → 13rem", () => {
    const s8 = typeScale.at(-1)!;
    expect(s8.minPx / 16).toBeGreaterThanOrEqual(4);
    expect(s8.maxPx / 16).toBeLessThanOrEqual(13);
    expect(s8.maxPx / 16).toBeGreaterThan(12.5);
  });
});
