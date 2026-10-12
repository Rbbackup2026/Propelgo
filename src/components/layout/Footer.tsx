import Link from "next/link";
import { finalCta, footer } from "@/content/home";
import { Logo } from "@/components/ui/Logo";

export function Footer() {
  return (
    <footer className="bg-forest-950 text-white">
      <div className="mx-auto max-w-[1320px] px-5 pt-20 pb-10 md:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_2fr]">
          <div>
            <Logo tone="dark" className="h-9 w-auto" />
            <p className="mt-5 max-w-[32ch] text-[14.5px] leading-relaxed text-white/55">{footer.blurb}</p>
            <a href={`mailto:${finalCta.email}`} className="mt-6 inline-block font-mono text-[12.5px] text-white/75 hover:text-signal">
              {finalCta.email}
            </a>
          </div>
          <nav aria-label="Footer" className="grid grid-cols-2 gap-10 sm:grid-cols-4">
            {footer.columns.map((col) => (
              <div key={col.title}>
                <p className="label !text-[10px] text-white/40">{col.title}</p>
                <ul className="mt-5 space-y-3">
                  {col.links.map((l) => (
                    <li key={l.name}>
                      <Link href={l.href} className="text-[14.5px] text-white/75 transition-colors hover:text-white">
                        {l.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <p
          aria-hidden="true"
          className="mt-20 overflow-hidden text-[21vw] leading-[0.8] font-medium tracking-[-0.06em] whitespace-nowrap text-transparent select-none [-webkit-text-stroke:1px_rgba(255,255,255,0.1)] xl:text-[292px]"
        >
          PropelGo
        </p>

        <div className="mt-8 flex flex-col gap-5 border-t border-white/10 pt-8 text-[13px] text-white/45 md:flex-row md:items-center md:justify-between">
          <p>© 2026 PropelGo. All rights reserved.</p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {footer.legal.map((l) => (
              <li key={l.name}>
                <Link href={l.href} className="hover:text-white">
                  {l.name}
                </Link>
              </li>
            ))}
            {footer.social.map((s) => (
              <li key={s.name}>
                <a href={s.href} target="_blank" rel="noreferrer" className="text-white/75 hover:text-white">
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
