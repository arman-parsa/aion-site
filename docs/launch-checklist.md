# Launch checklist

Everything that must happen before aionconsults.com points at the new site.
Run `pnpm content:todo` to list every placeholder still in the content.

## Content (from AION)
- [ ] Contact details in `src/content/en/site.ts`: phone, office address, company number,
      registered office, LinkedIn, office hours. Switch the email from the temporary
      Outlook address to an @aionconsults.com mailbox once it exists.
- [ ] People (`people.ts`): roles, short and long bios, credentials, affiliations,
      alumniOf, real portraits (black and white, at least 1200×1500).
- [ ] Services (`services.ts`): "What we do" body text, three outcomes each, real photography.
- [ ] Case studies (`case-studies.ts`): at least three real ones, then set
      `site.flags.showWork = true` and delete the placeholder.
- [ ] Draft copy marked `DRAFT` (headlines and summaries from docs/voice.md): sign off or rewrite.
- [ ] `site.founders` and `site.areaServed` for search-engine structured data.

## Legal
- [ ] Privacy and cookie notices (`pages.ts`) reviewed by a qualified adviser; set the
      retention period and the "last updated" date; remove the draft lines.

## Services and keys (Vercel → Settings → Environment Variables)
- [ ] Resend: verify the aionconsults.com domain (DNS records at GoDaddy), set
      `RESEND_API_KEY` and `CONTACT_FROM_EMAIL` (e.g. `AION Consultancy <hello@aionconsults.com>`).
- [ ] Cloudflare Turnstile: create a widget for aionconsults.com; set
      `NEXT_PUBLIC_TURNSTILE_SITE_KEY` and `TURNSTILE_SECRET_KEY` (replace the test keys).
- [ ] `CONTACT_TO_EMAIL`: the inbox that receives enquiries.
- [x] `NEXT_PUBLIC_SITE_URL=https://aionconsults.com` on Production.
- [ ] Optional, Preview only: `CONTENT_PREVIEW=1` to review hidden sections and placeholders.
- [ ] Vercel plan: Pro (Hobby is non-commercial only).

## Open decisions
- [ ] JS budget: every route ships ~233 kB gzipped (budget 150 kB). ~155 kB is the
      React/Next framework itself; ~65 kB is GSAP + ScrollTrigger + SplitText + Lenis.
      Options: (a) accept and judge by Lighthouse on the live site, (b) drop Lenis smooth
      scroll and SplitText for CSS equivalents (~35–45 kB saved), (c) both plus lazy-load
      ScrollTrigger only on pages that use it.
- [ ] Contact form client validation uses full Zod (~34 kB on /contact). Could move to
      native constraint validation + `zod/mini` if the budget matters.

## Domain and email (GoDaddy DNS)
- [ ] Set up email (Google Workspace or Microsoft 365) and add its MX/SPF/DKIM records.
- [ ] Old site's URLs: get the old sitemap (Wayback Machine or a WordPress export) and add
      every URL to `src/lib/seo/redirects.ts`.
- [x] Domain added in Vercel (aionconsults.com, www → 308 to apex); production
      `NEXT_PUBLIC_SITE_URL=https://aionconsults.com`.
- [ ] GoDaddy DNS: `A @` → 216.198.79.1 and a second `A @` → 64.29.17.1 (or a single
      76.76.21.21); `CNAME www` → 50537d49e96832e6.vercel-dns-017.com. Leave NS/SOA/_dmarc.

## After launch
- [ ] Submit `https://aionconsults.com/sitemap.xml` in Google Search Console.
- [ ] Lighthouse (mobile) on the live site: LCP < 2.5s, CLS < 0.05, INP < 200ms.
- [ ] Send a test enquiry through the live form.
