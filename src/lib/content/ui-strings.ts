/**
 * UI strings for components that may end up in client bundles (Link,
 * error boundary). Imports only the small ui object so the full content
 * bundle and Zod stay server-side. Validated at build by load.ts.
 */
export { ui as uiStrings } from "@/content/en/ui";
