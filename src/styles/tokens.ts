/**
 * Design-token maths (Utopia-style fluid scales).
 *
 * This file is the single source of truth for the fluid type and space scales.
 * `globals.css` contains the generated clamp() values; `tokens.test.ts` fails if
 * the two drift apart. To change the scale, edit the constants here, run
 * `pnpm tokens` and paste the printed CSS into globals.css.
 */

export const VIEWPORT = { min: 360, max: 1920 } as const;
/** Root size in px; rem conversions assume the browser default. */
const ROOT = 16;

export const TYPE = {
  /** step-0 (body) size in px at min / max viewport. */
  base: { min: 16, max: 20.8 },
  /** Modular ratio at min / max viewport: minor third → perfect fourth. */
  ratio: { min: 1.2, max: 1.333 },
  steps: [-2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8] as const,
} as const;

export type TypeStep = (typeof TYPE.steps)[number];

/** Utopia space multipliers relative to step-0. */
export const SPACE = {
  "3xs": 0.25,
  "2xs": 0.5,
  xs: 0.75,
  s: 1,
  m: 1.5,
  l: 2,
  xl: 3,
  "2xl": 4,
  "3xl": 6,
  "4xl": 8,
} as const;

export type SpaceStep = keyof typeof SPACE;

export const GUTTER = { min: 20, max: 48 } as const;
export const GRID_GAP = { min: 12, max: 32 } as const;

const round = (n: number, dp = 4) => Number(n.toFixed(dp));

/** clamp(min, preferred, max) interpolating linearly between the viewports. */
export function fluid(minPx: number, maxPx: number): string {
  const slope = (maxPx - minPx) / (VIEWPORT.max - VIEWPORT.min);
  const intercept = minPx - slope * VIEWPORT.min;
  const lo = Math.min(minPx, maxPx);
  const hi = Math.max(minPx, maxPx);
  return `clamp(${round(lo / ROOT)}rem, ${round(intercept / ROOT)}rem + ${round(slope * 100)}vw, ${round(hi / ROOT)}rem)`;
}

export function typeStep(step: TypeStep) {
  const min = TYPE.base.min * TYPE.ratio.min ** step;
  const max = TYPE.base.max * TYPE.ratio.max ** step;
  return {
    step,
    minPx: round(min, 2),
    maxPx: round(max, 2),
    clamp: fluid(min, max),
  };
}

export function spaceStep(name: SpaceStep) {
  const m = SPACE[name];
  const min = TYPE.base.min * m;
  const max = TYPE.base.max * m;
  return {
    name,
    minPx: round(min, 2),
    maxPx: round(max, 2),
    clamp: fluid(min, max),
  };
}

export const typeScale = TYPE.steps.map(typeStep);
export const spaceScale = (Object.keys(SPACE) as SpaceStep[]).map(spaceStep);
export const gutter = fluid(GUTTER.min, GUTTER.max);
export const gridGap = fluid(GRID_GAP.min, GRID_GAP.max);

/** Line-height + tracking per step: display steps get tight leading. */
export function typeMetrics(step: TypeStep): {
  leading: number;
  tracking: string;
} {
  if (step >= 7) return { leading: 0.92, tracking: "-0.04em" };
  if (step >= 5) return { leading: 0.98, tracking: "-0.035em" };
  if (step >= 3) return { leading: 1.1, tracking: "-0.02em" };
  if (step >= 1) return { leading: 1.3, tracking: "0em" };
  if (step === 0) return { leading: 1.5, tracking: "0em" };
  return { leading: 1.45, tracking: "0.01em" };
}

/** CSS for the @theme block (printed by `pnpm tokens`). */
export function themeCss(): string {
  const lines: string[] = [];
  for (const t of typeScale) {
    const { leading, tracking } = typeMetrics(t.step);
    lines.push(`  --text-step-${t.step}: ${t.clamp};`);
    lines.push(`  --text-step-${t.step}--line-height: ${leading};`);
    lines.push(`  --text-step-${t.step}--letter-spacing: ${tracking};`);
  }
  for (const s of spaceScale) lines.push(`  --spacing-${s.name}: ${s.clamp};`);
  lines.push(`  --spacing-gutter: ${gutter};`);
  lines.push(`  --spacing-grid-gap: ${gridGap};`);
  return lines.join("\n");
}
