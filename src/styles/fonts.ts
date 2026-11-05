/**
 * Font loading. THIS IS THE ONLY FILE TO EDIT TO SWAP TYPEFACES.
 *
 * Every face is self-hosted by next/font (downloaded at build, served from
 * /_next/static) with `display: swap` and metric-matched fallbacks to limit
 * CLS. Each loader sets a private `--ff-*` variable; globals.css maps those to
 * the public tokens (with fallbacks) used everywhere else:
 *
 *   --font-wordmark        display serif, the AION wordmark only (preloaded)
 *   --font-display         headings: currently the sans (globals.css)
 *   --font-sans            body grotesk           (preloaded)
 *   --font-mono            labels / metadata      (not preloaded)
 *
 * To switch to licensed fonts (e.g. PP Editorial New / PP Neue Montreal), put
 * the .woff2 files in src/styles/fonts/ and replace a loader with next/font/local:
 *
 *   import localFont from "next/font/local";
 *   const display = localFont({
 *     src: "./fonts/PPEditorialNew-Regular.woff2",
 *     variable: "--ff-sans",
 *     display: "swap",
 *     preload: true,
 *   });
 *
 * Keep the variable names and `fontVariables` export unchanged.
 */
import { Geist_Mono, Instrument_Serif, Inter_Tight } from "next/font/google";

/** The AION wordmark only (header lockup, home hero). Nothing else uses it. */
const wordmark = Instrument_Serif({
  weight: "400",
  style: "normal",
  subsets: ["latin"],
  display: "swap",
  preload: true,
  variable: "--ff-wordmark",
});

/** Headings and body. */
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
export const fontVariables = [wordmark, sans, mono].map((f) => f.variable).join(" ");
