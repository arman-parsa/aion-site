/** Join class names, dropping falsy values. (No merging: avoid conflicting utilities by design.) */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}
