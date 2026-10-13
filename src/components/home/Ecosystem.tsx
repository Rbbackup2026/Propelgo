import { ecosystem } from "@/content/home";

export function Ecosystem() {
  const row = [...ecosystem.names, ...ecosystem.names];
  return (
    <section aria-label={ecosystem.caption} className="pb-24 md:pb-32">
      <div className="container-page">
        <p className="text-center text-[14px] text-sub">{ecosystem.caption}</p>
        <div className="relative mt-8 overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]">
          <ul className="flex w-max animate-marquee items-center gap-16 motion-reduce:animate-none">
            {row.map((name, i) => (
              <li
                key={`${name}-${i}`}
                aria-hidden={i >= ecosystem.names.length}
                className="text-[19px] font-semibold tracking-[-0.02em] whitespace-nowrap text-sub/70"
              >
                {name}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
