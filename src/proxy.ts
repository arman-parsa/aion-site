import { NextResponse, type NextRequest } from "next/server";
import { getCaseStudy, getInsight, getPerson, getService } from "@/lib/content";

/**
 * Unknown slugs on dynamic routes must return a real 404. With Cache
 * Components, the first request for an unlisted param otherwise streams the
 * not-found UI with a 200 (ISR fallback). Rewriting to an unmatched path
 * renders app/not-found.tsx with status 404.
 *
 * Only runs on the dynamic collections below (see `config.matcher`).
 */
const lookups: Record<string, (slug: string) => unknown> = {
  expertise: getService,
  people: getPerson,
  work: getCaseStudy,
  insights: getInsight,
};

export function proxy(request: NextRequest) {
  const [, collection, slug] = request.nextUrl.pathname.split("/");
  const lookup = collection ? lookups[collection] : undefined;
  if (lookup && slug && !lookup(decodeURIComponent(slug))) {
    return NextResponse.rewrite(new URL("/__not-found", request.url), { status: 404 });
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/expertise/:slug", "/people/:slug", "/work/:slug", "/insights/:slug"],
};
