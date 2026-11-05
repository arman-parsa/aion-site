/** Interface strings used by primitives (screen-reader hints etc.). */
export const ui = {
  opensInNewTab: "(opens in a new tab)",
  skipToContent: "Skip to content",
} as const;

export type UiStrings = typeof ui;
