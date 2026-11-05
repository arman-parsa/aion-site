import { cacheLife } from "next/cache";

/** Current year, cached for a day so the page stays static (Cache Components). */
export async function CopyrightYear() {
  "use cache";
  cacheLife("days");
  return <>{new Date().getFullYear()}</>;
}
