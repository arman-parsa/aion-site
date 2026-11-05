import { describe, expect, it } from "vitest";
import { isOpen, zonedParts } from "./london";

const hours = { days: [1, 2, 3, 4, 5], open: "09:00", close: "17:30", timeZone: "Europe/London" };

describe("London time helpers", () => {
  it("formats London time across BST", () => {
    // 2026-07-01 07:56 UTC = 08:56 BST
    expect(zonedParts(Date.UTC(2026, 6, 1, 7, 56)).hhmm).toBe("08:56");
    // 2026-01-15 07:56 UTC = 07:56 GMT
    expect(zonedParts(Date.UTC(2026, 0, 15, 7, 56)).hhmm).toBe("07:56");
  });

  it("knows office hours", () => {
    expect(isOpen(Date.UTC(2026, 0, 14, 10, 0), hours)).toBe(true); // Wed 10:00
    expect(isOpen(Date.UTC(2026, 0, 14, 17, 30), hours)).toBe(false); // Wed 17:30
    expect(isOpen(Date.UTC(2026, 0, 17, 10, 0), hours)).toBe(false); // Sat
  });
});
