import Image from "next/image";
import { ecosystem } from "@/content/home";

export function Ecosystem() {
  const row = [...ecosystem.logos, ...ecosystem.logos];
  return (
    <section aria-label={ecosystem.caption} className="relative pt-4 pb-16 md:pb-20">
      <div className="container-page">
        <div className="flex items-center gap-4">
          <span className="hidden h-px flex-1 bg-gradient-to-r from-transparent to-line sm:block" />
          <p className="w-full text-center text-[13px] font-medium tracking-[0.14em] text-sub uppercase sm:w-auto">{ecosystem.caption}</p>
          <span className="hidden h-px flex-1 bg-gradient-to-l from-transparent to-line sm:block" />
        </div>
        <div className="group relative mt-9 overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]">
          {/* Per-item padding instead of flex gap keeps the -50% marquee loop seamless. */}
          <ul className="flex w-max animate-marquee items-center [animation-duration:38s] group-hover:[animation-play-state:paused] motion-reduce:animate-none">
            {row.map((logo, i) => (
              <li key={`${logo.name}-${i}`} aria-hidden={i >= ecosystem.logos.length} className="flex h-12 shrink-0 items-center px-8 md:px-11">
                <Image
                  src={logo.src}
                  alt={logo.name}
                  width={logo.width}
                  height={logo.height}
                  unoptimized
                  draggable={false}
                  className="opacity-55 grayscale transition-[opacity,filter] duration-300 select-none hover:opacity-100 hover:grayscale-0"
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
