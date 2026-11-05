# AION Consultancy — aionconsults.com

Marketing site for AION Consultancy Ltd (UK). Real estate, urban regeneration, research and executive education, led by Prof. Ali Parsa FRICS. Audience: senior public-sector officials, investors, developers, universities, often international (English + Arabic).

> Next.js agent rules (this Next version differs from training data): see [AGENTS.md](./AGENTS.md). Read the bundled docs in `node_modules/next/dist/docs/` before writing framework code.

## Stack (do not change without asking)

- Next.js 16 (App Router, TypeScript strict, React Server Components by default)
- Tailwind CSS v4 (CSS-first config in `src/styles/globals.css` via `@theme`)
- GSAP 3 + `@gsap/react` (`useGSAP`) for all scroll/timeline motion; Lenis for smooth scroll, driven by `gsap.ticker`
- Content: typed content in `src/content/**` validated with Zod, accessed ONLY through `src/lib/content/*` (so a headless CMS can replace it later)
- Forms: Server Actions + Zod + Resend; spam protection via honeypot + Cloudflare Turnstile
- Hosting: Vercel. Package manager: pnpm. Node 20.9+.

## Commands

- `pnpm dev` — dev server
- `pnpm build` — production build (must pass before any commit)
- `pnpm lint` / `pnpm typecheck` / `pnpm test` / `pnpm test:e2e`
- `pnpm check` — runs lint + typecheck + unit tests. Run it after every change set.
- `pnpm screenshot` — full-page PNGs of every route at 390/768/1440/1920 into `/screenshots` (needs a prior `pnpm build`, Node 22.18+).
- `pnpm content:todo` — lists every [placeholder] value and placeholder image still in the content.
- `pnpm tokens` — prints the fluid type/space scale generated from `src/styles/tokens.ts`.
- Env: copy `.env.example` to `.env.local`. `src/env.ts` validates at build; `SKIP_ENV_VALIDATION=1` bypasses. `CONTENT_PREVIEW=1` (never on production) shows feature-flagged sections and placeholder entries. `CONTACT_TEST_MODE=1` logs contact emails and skips Turnstile (used by e2e).
- Launch tasks: see `docs/launch-checklist.md`. Content model: `docs/content-model.md`.

## Architecture

```
src/
  app/                 routes only; thin. Pages compose sections.
    (site)/            public pages, shared layout (header, footer, smooth scroll)
    api/               route handlers (only if a Server Action won't do)
  components/
    ui/                primitives: Button, Link, Container, Grid, Rule, Eyebrow, Heading, Media
    sections/          page sections: Hero, IndexList, Statement, PeopleGrid, CTA...
    motion/            Reveal, SplitHeading, ParallaxMedia, Marquee, SmoothScroll provider
    layout/            Header, MenuOverlay, Footer
  content/             typed content objects (en, later ar)
  lib/
    content/           getters: getServices(), getPerson(slug)... (the ONLY way pages read content)
    motion/            gsap registration, eases, reduced-motion helpers
    seo/               metadata builders, JSON-LD
  styles/              globals.css (tokens), fonts
```

## Rules

- Server Components by default. Add `"use client"` only to leaf components that need it (motion, menu, form).
- Never hard-code colours, font sizes or spacing in components. Use tokens (`text-step-3`, `bg-paper`, `px-gutter`). If a token is missing, add it to `globals.css` and say so.
- Use CSS logical properties (`ps-`, `pe-`, `ms-`, `start-`, `end-`) not left/right, so RTL (Arabic) works later.
- All copy lives in `src/content`, never inline in JSX.
- Every image goes through `next/image` with real `alt`, `sizes`, and width/height. Hero media gets `priority`.
- Motion: every animation must (1) be registered inside `useGSAP` with a scope ref, (2) respect `prefers-reduced-motion` (show final state, no Lenis), (3) animate only `transform`, `opacity`, `clip-path`. Content must be readable with JS disabled.
- Accessibility target: WCAG 2.2 AA. Keyboard-navigable menu with focus trap, visible focus styles, skip link, semantic headings (one h1 per page).
- Performance budget (mobile, Lighthouse): LCP < 2.5s, CLS < 0.05, INP < 200ms, JS per route < 150kb gzipped.
- No new dependency without stating why and the bundle cost.
- Small, reviewable changes. One feature per commit, Conventional Commits (`feat:`, `fix:`, `chore:`).

## Workflow for Claude

1. For anything bigger than a small fix: explore, then propose a plan and wait for approval.
2. Implement in small steps; run `pnpm check` and `pnpm build`.
3. For UI work, start the dev server and take Playwright screenshots at 390px, 768px, 1440px and 1920px; look at them and fix what's off before saying you're done.
4. Summarise what changed, what's left, and any decision you made on my behalf.

## Design direction (summary — full brief in docs/design-brief.md)

Editorial, full-bleed, quiet confidence. Warm paper + ink with one accent. Large fluid serif display type, small mono labels in parentheses, hairline rules, numbered index lists, generous whitespace, photography as full-bleed plates. Motion is slow, precise and sparse: line-by-line heading reveals, clip-path image reveals, subtle parallax. Nothing bouncy.
