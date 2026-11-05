import { Container } from "@/components/ui";
import { Link } from "@/components/ui/Link";
import { getUiStrings } from "@/lib/content";
import { HeaderShell } from "./HeaderShell";
import { LondonClock } from "./LondonClock";
import { MenuToggle } from "./MenuToggle";
import { Wordmark } from "./Wordmark";

/** Fixed header: wordmark, live London clock (desktop), Get in touch, Menu. */
export function Header() {
  const copy = getUiStrings().header;
  return (
    <HeaderShell>
      <Container>
        <div className="grid h-header grid-cols-[1fr_auto_1fr] items-center gap-s">
          <div className="flex items-center justify-self-start">
            <Wordmark />
          </div>
          <div data-inert-with-menu className="hidden items-center lg:flex">
            <LondonClock label={copy.clockLabel} ariaLabel={copy.clockAria} />
          </div>
          <div className="col-start-3 flex items-center gap-m justify-self-end">
            <div data-inert-with-menu className="hidden items-center sm:flex">
              <Link
                href={copy.getInTouchHref}
                underline="none"
                className="inline-flex items-center border border-solid border-current px-s py-xs label leading-none transition-colors duration-base ease-out-expo hover:bg-current/10 focus-visible:bg-current/10"
              >
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
