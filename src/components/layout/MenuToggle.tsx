"use client";

import { useMenu } from "./MenuContext";

export const MENU_ID = "site-menu";

export function MenuToggle({ openLabel, closeLabel }: { openLabel: string; closeLabel: string }) {
  const { open, setOpen, toggleRef } = useMenu();
  return (
    <button
      ref={toggleRef}
      type="button"
      aria-expanded={open}
      aria-controls={MENU_ID}
      onClick={() => setOpen(!open)}
      className="cursor-pointer link-underline py-2xs label"
    >
      {open ? closeLabel : openLabel}
    </button>
  );
}
