import { Container } from "@/components/ui";
import { Link } from "@/components/ui/Link";
import { getUiStrings } from "@/lib/content";
import { HeaderShell } from "./HeaderShell";
import { LondonClock } from "./LondonClock";
import { MenuToggle } from "./MenuToggle";
import { Wordmark } from "./Wordmark";

/**
 * Fixed header. The bar uses mix-blend-difference with pure white text, so it
 * reads as ink over paper and as near-white over photography or ink sections.
 */
export function Header() {
  const copy = getUiStrings().header;
  return (
    <HeaderShell>
      <Container>
        <div className="grid h-header grid-cols-[1fr_auto_1fr] items-center gap-s">
          <div data-inert-with-menu className="justify-self-start">
            <Wordmark />
          </div>
          <div data-inert-with-menu className="hidden lg:block">
            <LondonClock label={copy.clockLabel} ariaLabel={copy.clockAria} />
          </div>
          <div className="col-start-3 flex items-center gap-m justify-self-end">
            <div data-inert-with-menu className="hidden sm:block">
              <Link href={copy.getInTouchHref} className="py-2xs label">
                {copy.getInTouch}
              </Link>
            </div>
            <MenuToggle openLabel={copy.menuOpen} closeLabel={copy.menuClose} />
          </div>
        </div>
      </Container>
    </HeaderShell>
  );
}
