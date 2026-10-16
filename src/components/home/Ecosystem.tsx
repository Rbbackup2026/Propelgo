import { ecosystem } from "@/content/home";

export function Ecosystem() {
  const row = [...ecosystem.names, ...ecosystem.names];
  return (
    <section aria-label={ecosystem.caption} className="relative pt-4 pb-16 md:pb-20">
      <div className="container-page">
        <div className="flex items-center gap-4">
          <span className="hidden h-px flex-1 bg-gradient-to-r from-transparent to-line sm:block" />
          <p className="w-full text-center text-[13px] font-medium tracking-[0.14em] text-sub uppercase sm:w-auto">{ecosystem.caption}</p>
          <span className="hidden h-px flex-1 bg-gradient-to-l from-transparent to-line sm:block" />
        </div>
        <div className="relative mt-7 overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]">
          <ul className="flex w-max animate-marquee items-center gap-3 motion-reduce:animate-none">
            {row.map((name, i) => (
              <li
                key={`${name}-${i}`}
                aria-hidden={i >= ecosystem.names.length}
                className="flex items-center gap-2.5 rounded-full bg-white px-5 py-2.5 text-[15px] font-medium tracking-[-0.01em] whitespace-nowrap text-forest ring-1 ring-mint"
              >
                <span className="size-1.5 rounded-full bg-lime" />
                {name}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
