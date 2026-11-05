import type { LocaleContentInput } from "@/lib/content/schema";
import { caseStudies } from "./case-studies";
import { insights } from "./insights";
import { navigation } from "./navigation";
import { pages } from "./pages";
import { people } from "./people";
import { services } from "./services";
import { site } from "./site";
import { testimonials } from "./testimonials";

/** All English content. Validated as a whole by src/lib/content/load.ts. */
export const en = {
  site,
  navigation,
  pages,
  services,
  caseStudies,
  people,
  insights,
  testimonials,
} satisfies LocaleContentInput;
