/**
 * Full-page PNGs of every route at every viewport → /screenshots (gitignored).
 *
 *   pnpm build && pnpm screenshot           # starts `next start` itself
 *   BASE_URL=http://localhost:3000 pnpm screenshot   # use a running server
 *
 * Routes are discovered from src/app (page.tsx files, route groups stripped,
 * dynamic segments skipped). Add extra paths with ROUTES="/a,/b".
 */
import { chromium, type Page } from "@playwright/test";
import { spawn, type ChildProcess } from "node:child_process";
import { mkdir, readdir } from "node:fs/promises";
import path from "node:path";
import { viewports } from "../e2e/viewports.ts";

const ROOT = path.resolve(import.meta.dirname, "..");
const APP_DIR = path.join(ROOT, "src/app");
const OUT_DIR = path.join(ROOT, "screenshots");
const PORT = Number(process.env.PORT ?? 3100);

async function discoverRoutes(dir: string, segments: string[] = []): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const routes: string[] = [];
  if (entries.some((e) => e.isFile() && /^page\.(tsx|ts|jsx|js|mdx)$/.test(e.name))) {
    routes.push("/" + segments.join("/"));
  }
  for (const e of entries) {
    if (!e.isDirectory()) continue;
    const name = e.name;
    if (name.startsWith("_") || name.startsWith("@") || name === "api") continue;
    if (name.startsWith("[")) continue; // dynamic: needs explicit ROUTES
    const next = name.startsWith("(") && name.endsWith(")") ? segments : [...segments, name];
    routes.push(...(await discoverRoutes(path.join(dir, name), next)));
  }
  return routes;
}

async function waitFor(url: string, timeoutMs = 60_000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url);
      if (res.ok) return;
    } catch {
      /* not up yet */
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error(`Server at ${url} did not start within ${timeoutMs}ms`);
}

/** Scroll through the page so lazy images load, then wait for fonts + images. */
async function settle(page: Page) {
  await page.evaluate(async () => {
    for (const img of Array.from(document.images)) img.loading = "eager";
    const step = window.innerHeight;
    for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 60));
    }
    window.scrollTo(0, 0);
    await document.fonts.ready;
  });
  await page
    .waitForFunction(
      () => Array.from(document.images).every((i) => i.complete && i.naturalWidth > 0),
      null,
      {
        timeout: 15_000,
      },
    )
    .catch(() => console.warn(`  ! some images did not load on ${page.url()}`));
  await page.waitForLoadState("networkidle", { timeout: 5_000 }).catch(() => {});
}

function slug(route: string) {
  return route === "/" ? "home" : route.replace(/^\//, "").replace(/\//g, "_");
}

async function main() {
  let server: ChildProcess | undefined;
  let baseURL = process.env.BASE_URL;
  if (!baseURL) {
    baseURL = `http://localhost:${PORT}`;
    server = spawn(path.join(ROOT, "node_modules/.bin/next"), ["start", "--port", String(PORT)], {
      cwd: ROOT,
      stdio: "ignore",
    });
    await waitFor(baseURL);
  }

  const extra = (process.env.ROUTES ?? "").split(",").filter(Boolean);
  // ONLY="/a,/b" limits to those routes; VIEWPORTS="mobile,desktop" limits sizes.
  const only = (process.env.ONLY ?? "").split(",").filter(Boolean);
  const routes = only.length
    ? only
    : [...new Set([...(await discoverRoutes(APP_DIR)), ...extra])].sort();
  const wanted = (process.env.VIEWPORTS ?? "").split(",").filter(Boolean);
  await mkdir(OUT_DIR, { recursive: true });

  const browser = await chromium.launch(
    process.env.PW_CHROMIUM_PATH ? { executablePath: process.env.PW_CHROMIUM_PATH } : {},
  );
  try {
    for (const [name, viewport] of Object.entries(viewports)) {
      if (wanted.length && !wanted.includes(name)) continue;
      const context = await browser.newContext({
        viewport,
        deviceScaleFactor: 1,
      });
      const page = await context.newPage();
      page.setDefaultTimeout(30_000);
      for (const route of routes) {
        await page.goto(new URL(route, baseURL).toString(), { waitUntil: "load" });
        await settle(page);
        const file = path.join(OUT_DIR, `${slug(route)}--${name}-${viewport.width}.png`);
        await page.screenshot({ path: file, fullPage: true });
        console.log(`✓ ${route} @ ${name} → ${path.relative(ROOT, file)}`);
      }
      await context.close();
    }
  } finally {
    await browser.close();
    if (server?.pid) {
      try {
        process.kill(-server.pid, "SIGKILL");
      } catch {
        /* already gone */
      }
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
