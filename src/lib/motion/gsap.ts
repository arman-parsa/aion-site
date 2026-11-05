"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

/** Register plugins once. Import gsap from here, never from "gsap" directly. */
gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);

export const EASE_OUT_EXPO = "expo.out";
export const EASE_IN_OUT_QUART = "power4.inOut";
export const DURATION = { fast: 0.2, base: 0.4, slow: 0.8, slower: 1.2 } as const;

export { gsap, ScrollTrigger, SplitText, useGSAP };
