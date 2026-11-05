import { NextResponse, type NextRequest } from "next/server";
import { getCaseStudy, getInsight, getPerson, getService } from "@/lib/content";
import { gonePrefixes } from "@/lib/seo/redirects";

/**
 * Unknown slugs on dynamic routes must return a real 404. With Cache
 * Components, the first request for an unlisted param otherwise streams the
 * not-found UI with a 200 (ISR fallback). Rewriting to an unmatched path
 * renders app/not-found.tsx with status 404.
 *
 * Also answers old WordPress system paths with 410 Gone.
 * Only runs on the paths in `config.matcher`.
 */
const lookups: Record<string, (slug: string) => unknown> = {
  expertise: getService,
  people: getPerson,
  work: getCaseStudy,
  insights: getInsight,
};

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Old WordPress system URLs are gone for good (tells crawlers and bots to stop).
  if (gonePrefixes.some((p) => pathname === p || pathname.startsWith(`${p}/`))) {
    return new NextResponse("Gone", { status: 410, headers: { "content-type": "text/plain" } });
  }

  const [, collection, slug] = pathname.split("/");
  const lookup = collection ? lookups[collection] : undefined;
  if (lookup && slug && !lookup(decodeURIComponent(slug))) {
    return NextResponse.rewrite(new URL("/__not-found", request.url), { status: 404 });
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/expertise/:slug",
    "/people/:slug",
    "/work/:slug",
    "/insights/:slug",
    "/wp-admin/:path*",
    "/wp-login.php",
    "/xmlrpc.php",
    "/wp-content/:path*",
    "/wp-includes/:path*",
    "/wp-json/:path*",
  ],
};
