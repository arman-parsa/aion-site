import type { ReactNode } from "react";
import { SmoothScroll } from "@/components/motion";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { Menu } from "./Menu";
import { MenuProvider } from "./MenuContext";
import { SkipLink } from "./SkipLink";

/** Header, menu, main landmark and footer shared by every public page. */
export function SiteChrome({ children }: { children: ReactNode }) {
  return (
    <>
      <span id="top" />
      <SkipLink />
      <SmoothScroll />
      <MenuProvider>
        <Header />
        <Menu />
        <main id="main" tabIndex={-1} className="outline-none">
          {children}
        </main>
      </MenuProvider>
      <Footer />
    </>
  );
}
