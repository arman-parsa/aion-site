"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

type MenuState = {
  open: boolean;
  setOpen: (open: boolean) => void;
  toggleRef: React.RefObject<HTMLButtonElement | null>;
};

const MenuContext = createContext<MenuState | null>(null);

export function MenuProvider({ children }: { children: ReactNode }) {
  const [open, setOpenState] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const setOpen = useCallback((v: boolean) => setOpenState(v), []);
  const value = useMemo(() => ({ open, setOpen, toggleRef }), [open, setOpen]);
  return <MenuContext.Provider value={value}>{children}</MenuContext.Provider>;
}

export function useMenu(): MenuState {
  const ctx = useContext(MenuContext);
  if (!ctx) throw new Error("useMenu must be used inside <MenuProvider>");
  return ctx;
}
