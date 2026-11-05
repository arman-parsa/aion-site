/**
 * Full-page PNGs of every route at every viewport → /screenshots (gitignored).
 *
 *   pnpm build && pnpm screenshot           # starts `next start` itself
 *   BASE_URL=http://localhost:3000 pnpm screenshot   # use a running server
 *
 * Routes are discovered from src/app (page.tsx files, route groups stripped,
 * dynamic segments skipped). Add extra paths with ROUTES="/a,/b".
 */
import { chromium } from "@playwright/test";
import { spawn, type ChildProcess } from "node:child_process";
import { mkdir, readdir } from "node:fs/promises";
import path from "node:path";
import { viewports } from "../e2e/viewports.ts";

const ROOT = path.resolve(import.meta.dirname, "..");
const APP_DIR = path.join(ROOT, "src/app");
const OUT_DIR = path.join(ROOT, "screenshots");
const PORT = Number(process.env.PORT ?? 3100);

async function discoverRoutes(
  dir: string,
  segments: string[] = [],
): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const routes: string[] = [];
  if (
    entries.some(
      (e) => e.isFile() && /^page\.(tsx|ts|jsx|js|mdx)$/.test(e.name),
    )
  ) {
    routes.push("/" + segments.join("/"));
  }
  for (const e of entries) {
    if (!e.isDirectory()) continue;
    const name = e.name;
    if (name.startsWith("_") || name.startsWith("@") || name === "api")
      continue;
    if (name.startsWith("[")) continue; // dynamic: needs explicit ROUTES
    const next =
      name.startsWith("(") && name.endsWith(")")
        ? segments
        : [...segments, name];
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

function slug(route: string) {
  return route === "/" ? "home" : route.replace(/^\//, "").replace(/\//g, "_");
}

async function main() {
  let server: ChildProcess | undefined;
  let baseURL = process.env.BASE_URL;
  if (!baseURL) {
    baseURL = `http://localhost:${PORT}`;
    server = spawn("pnpm", ["start", "--port", String(PORT)], {
      cwd: ROOT,
      stdio: "ignore",
    });
    await waitFor(baseURL);
  }

  const extra = (process.env.ROUTES ?? "").split(",").filter(Boolean);
  const routes = [
    ...new Set([...(await discoverRoutes(APP_DIR)), ...extra]),
  ].sort();
  await mkdir(OUT_DIR, { recursive: true });

  const browser = await chromium.launch(
    process.env.PW_CHROMIUM_PATH
      ? { executablePath: process.env.PW_CHROMIUM_PATH }
      : {},
  );
  try {
    for (const [name, viewport] of Object.entries(viewports)) {
      const context = await browser.newContext({
        viewport,
        deviceScaleFactor: 1,
      });
      const page = await context.newPage();
      for (const route of routes) {
        await page.goto(new URL(route, baseURL).toString(), {
          waitUntil: "networkidle",
        });
        const file = path.join(
          OUT_DIR,
          `${slug(route)}--${name}-${viewport.width}.png`,
        );
        await page.screenshot({ path: file, fullPage: true });
        console.log(`✓ ${route} @ ${name} → ${path.relative(ROOT, file)}`);
      }
      await context.close();
    }
  } finally {
    await browser.close();
    server?.kill();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
