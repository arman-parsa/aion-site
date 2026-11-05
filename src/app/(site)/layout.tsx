import { Footer, Header, Menu, MenuProvider, SkipLink } from "@/components/layout";
import { SmoothScroll } from "@/components/motion";

export default function SiteLayout({ children }: LayoutProps<"/">) {
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
