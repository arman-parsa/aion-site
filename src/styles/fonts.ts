/**
 * Font loading. THIS IS THE ONLY FILE TO EDIT TO SWAP TYPEFACES.
 *
 * Every face is self-hosted by next/font (downloaded at build, served from
 * /_next/static) with `display: swap` and metric-matched fallbacks to limit
 * CLS. Each loader sets a private `--ff-*` variable; globals.css maps those to
 * the public tokens (with fallbacks) used everywhere else:
 *
 *   --font-display         display serif, roman   (preloaded: LCP headlines)
 *   --font-display-italic  display serif, italic  (not preloaded: emphasis only)
 *   --font-sans            body grotesk           (preloaded)
 *   --font-mono            labels / metadata      (not preloaded)
 *
 * The italic is a separate loader so that preloading the roman doesn't also
 * preload the italic file.
 *
 * To switch to licensed fonts (e.g. PP Editorial New / PP Neue Montreal), put
 * the .woff2 files in src/styles/fonts/ and replace a loader with next/font/local:
 *
 *   import localFont from "next/font/local";
 *   const display = localFont({
 *     src: "./fonts/PPEditorialNew-Regular.woff2",
 *     variable: "--ff-display",
 *     display: "swap",
 *     preload: true,
 *   });
 *
 * Keep the variable names and `fontVariables` export unchanged.
 */
import { Geist_Mono, Instrument_Serif, Inter_Tight } from "next/font/google";

const display = Instrument_Serif({
  weight: "400",
  style: "normal",
  subsets: ["latin"],
  display: "swap",
  preload: true,
  variable: "--ff-display",
});

const displayItalic = Instrument_Serif({
  weight: "400",
  style: "italic",
  subsets: ["latin"],
  display: "swap",
  preload: false,
  variable: "--ff-display-italic",
});

const sans = Inter_Tight({
  subsets: ["latin"],
  display: "swap",
  preload: true,
  variable: "--ff-sans",
});

const mono = Geist_Mono({
  subsets: ["latin"],
  display: "swap",
  preload: false,
  variable: "--ff-mono",
});

/** Apply to <html> so the variables are available everywhere. */
export const fontVariables = [display, displayItalic, sans, mono].map((f) => f.variable).join(" ");
