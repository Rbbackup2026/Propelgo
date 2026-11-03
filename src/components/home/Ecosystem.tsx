import Image from "next/image";
import { ecosystem } from "@/content/home";

export function Ecosystem() {
  return (
    <section aria-label={ecosystem.caption} className="relative pt-4 pb-16 md:pb-20">
      <div className="container-page">
        <div className="flex items-center gap-4">
          <span className="hidden h-px flex-1 bg-gradient-to-r from-transparent to-line sm:block" />
          <p className="w-full text-center text-[13px] font-medium tracking-[0.14em] text-sub uppercase sm:w-auto">{ecosystem.caption}</p>
          <span className="hidden h-px flex-1 bg-gradient-to-l from-transparent to-line sm:block" />
        </div>
        <div className="mt-9 divide-y divide-line/70">
          {ecosystem.groups.map((group, g) => {
            const row = [...group.logos, ...group.logos];
            return (
              <div key={group.label} className="flex flex-col items-center gap-3 py-5 md:flex-row md:gap-8">
                <p className="flex shrink-0 items-center gap-2 text-[13px] font-semibold tracking-[0.08em] text-ink uppercase md:w-32">
                  <span className="grid size-7 place-items-center rounded-lg bg-mist text-forest ring-1 ring-mint">
                    {g === 0 ? <BankIcon /> : <PartnerIcon />}
                  </span>
                  {group.label}
                </p>
                <div className="group relative w-full min-w-0 flex-1 overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_10%,#000_90%,transparent)]">
                  {/* Per-item padding instead of flex gap keeps the -50% marquee loop seamless. */}
                  <ul
                    className={`flex w-max animate-marquee items-center [animation-duration:34s] group-hover:[animation-play-state:paused] motion-reduce:animate-none ${g % 2 ? "[animation-direction:reverse]" : ""}`}
                  >
                    {row.map((logo, i) => (
                      <li key={`${logo.name}-${i}`} aria-hidden={i >= group.logos.length} className="flex h-12 shrink-0 items-center px-8 md:px-11">
                        <Image
                          src={logo.src}
                          alt={logo.name}
                          width={logo.width}
                          height={logo.height}
                          unoptimized
                          draggable={false}
                          className="transition-transform duration-300 select-none hover:-translate-y-0.5 hover:scale-105"
                        />
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function BankIcon() {
  return (
    <svg viewBox="0 0 16 16" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M2 6.2 8 2.5l6 3.7" />
      <path d="M2.5 6.5h11" />
      <path d="M4 8.5v3.5M8 8.5v3.5M12 8.5v3.5" />
      <path d="M2 13.5h12" />
    </svg>
  );
}

function PartnerIcon() {
  return (
    <svg viewBox="0 0 16 16" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="8" cy="3.5" r="1.8" />
      <circle cx="3.5" cy="12" r="1.8" />
      <circle cx="12.5" cy="12" r="1.8" />
      <path d="M7.1 5.1 4.4 10.4M8.9 5.1l2.7 5.3M5.3 12h5.4" />
    </svg>
  );
}
