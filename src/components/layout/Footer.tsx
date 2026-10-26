import Link from "next/link";
import { finalCta, footer } from "@/content/home";
import { BrandRibbon, type RibbonVariant } from "@/components/ui/BrandRibbon";
import { Logo } from "@/components/ui/Logo";

export function Footer({ ribbon }: { ribbon?: RibbonVariant }) {
  return (
    <footer className="relative isolate overflow-hidden border-t border-line bg-surface">
      {ribbon && (
        <BrandRibbon
          variant={ribbon}
          light
          pulse={ribbon !== "twist"}
          className="absolute top-0 right-0 -z-10 h-[340px] w-[min(30vw,380px)] -scale-x-100 [mask-image:radial-gradient(115%_100%_at_0%_0%,#000_35%,transparent_80%)] max-md:h-[240px] max-md:w-[55vw]"
        />
      )}
      <div className="container-page pt-20 pb-10">
        <div className="grid gap-14 lg:grid-cols-[1.1fr_2fr]">
          <div>
            <Logo className="h-8 w-auto" />
            <p className="mt-5 max-w-[34ch] text-[15px] leading-relaxed text-copy">{footer.blurb}</p>
            <a href={`mailto:${finalCta.email}`} className="mt-5 inline-block text-[15px] font-medium text-ink hover:text-brand">
              {finalCta.email}
            </a>
          </div>
          <nav aria-label="Footer" className="grid grid-cols-2 gap-10 sm:grid-cols-4">
            {footer.columns.map((col) => (
              <div key={col.title}>
                <p className="text-[14px] font-semibold text-ink">{col.title}</p>
                <ul className="mt-4 space-y-3">
                  {col.links.map((l) => (
                    <li key={l.name}>
                      <Link href={l.href} className="text-[15px] text-copy transition-colors hover:text-ink">
                        {l.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="mt-20 flex flex-col gap-5 border-t border-line pt-8 text-[14px] text-sub md:flex-row md:items-center md:justify-between">
          <p>© 2026 PropelGo. All rights reserved.</p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {footer.legal.map((l) => (
              <li key={l.name}>
                <Link href={l.href} className="hover:text-ink">
                  {l.name}
                </Link>
              </li>
            ))}
            {footer.social.map((s) => (
              <li key={s.name}>
                <a href={s.href} target="_blank" rel="noreferrer" className="text-copy hover:text-ink">
                  {s.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
