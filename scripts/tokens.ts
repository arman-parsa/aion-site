/** Prints the generated @theme token block. See src/styles/tokens.ts. */
import { themeCss, typeScale } from "../src/styles/tokens.ts";

console.log(themeCss());
console.error("\nstep | min px | max px");
for (const t of typeScale) console.error(`${t.step} | ${t.minPx} | ${t.maxPx}`);
