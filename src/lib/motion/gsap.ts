"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

/** Register plugins once. Import gsap from here, never from "gsap" directly. */
gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);

export const EASE_OUT_EXPO = "expo.out";

export { gsap, ScrollTrigger, SplitText, useGSAP };
