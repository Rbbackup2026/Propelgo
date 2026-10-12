import { ecosystem } from "@/content/home";

/** Per-name wordmark styling so the strip reads as a logo row until official SVGs arrive. */
const style: Record<string, string> = {
  "Air India Express": "font-serif italic text-[21px] tracking-[-0.01em]",
  VISA: "font-black italic text-[22px] tracking-[-0.02em]",
  Mastercard: "font-semibold text-[19px] tracking-[-0.02em]",
  RuPay: "font-extrabold italic text-[21px] tracking-[-0.03em]",
  Citi: "font-semibold text-[22px] tracking-[-0.03em] lowercase",
  SBI: "font-bold text-[20px] tracking-[0.04em]",
  "YES BANK": "font-extrabold text-[17px] tracking-[0.02em]",
  Kotak: "font-bold text-[20px] tracking-[-0.02em] lowercase",
};

export function Ecosystem() {
  const names = [...ecosystem.names, ...ecosystem.names];
  return (
    <section aria-label="Ecosystem partners" className="border-b border-paper-300/70 bg-paper">
      <div className="mx-auto flex max-w-[1320px] flex-col gap-6 px-5 py-9 md:flex-row md:items-center md:gap-10 md:px-8">
        <div className="shrink-0 md:w-[220px] md:border-r md:border-paper-300 md:pr-8">
          <p className="text-[15px] font-medium tracking-[-0.01em] text-ink">{ecosystem.title}</p>
          <p className="mt-1 text-[13px] text-muted">{ecosystem.caption}</p>
        </div>
        <div className="group relative flex-1 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
          <ul className="animate-marquee flex w-max items-center group-hover:[animation-play-state:paused]">
            {names.map((n, i) => (
              <li
                key={n + i}
                aria-hidden={i >= ecosystem.names.length}
                className={`px-8 whitespace-nowrap text-ink/45 transition-colors duration-300 hover:text-ink md:px-10 ${style[n] ?? "font-semibold text-[18px] tracking-[-0.02em]"}`}
              >
                {n}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
