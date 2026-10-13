import Link from "next/link";
import { resources } from "@/content/home";
import { Button } from "@/components/ui/Button";
import { Reveal, SectionIntro } from "@/components/ui/Reveal";

type Art = (typeof resources.items)[number]["art"];

export function Resources() {
  return (
    <section className="pb-28 md:pb-36">
      <div className="container-page">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <SectionIntro eyebrow={resources.eyebrow} title={resources.title} />
          <Button href={resources.cta.href} variant="text" className="self-start md:self-auto">
            {resources.cta.label}
          </Button>
        </div>
        <ul className="mt-12 grid gap-6 md:grid-cols-3">
          {resources.items.map((r, i) => (
            <Reveal as="li" key={r.title} delay={i * 0.06}>
              <Link href={r.href} className="group block">
                <div className="aspect-[4/3] overflow-hidden rounded-2xl ring-1 ring-line">
                  <div className="size-full transition-transform duration-700 ease-out-expo group-hover:scale-[1.04]">
                    <Cover art={r.art} />
                  </div>
                </div>
                <p className="mt-5 flex items-center gap-2 text-[14px] text-sub">
                  <span className="font-medium text-brand">{r.type}</span>
                  <span aria-hidden="true">·</span>
                  {r.read}
                </p>
                <h3 className="mt-2 text-[19px] leading-snug font-semibold tracking-[-0.014em] text-pretty text-ink decoration-ghost underline-offset-4 group-hover:underline">
                  {r.title}
                </h3>
              </Link>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

/** Flat editorial covers, one composition per topic. */
function Cover({ art }: { art: Art }) {
  if (art === "orchestration") {
    return (
      <svg viewBox="0 0 400 300" className="size-full bg-mist" fill="none" aria-hidden="true">
        {[60, 105, 150, 195, 240].map((y, i) => (
          <path key={y} d={`M0 ${y} C 140 ${y}, 160 150, 260 150`} stroke={i === 2 ? "#017649" : "#95DE64"} strokeWidth={i === 2 ? 3 : 2} />
        ))}
        <path d="M260 150 H400" stroke="#017649" strokeWidth="3" />
        <circle cx="260" cy="150" r="22" fill="#fff" stroke="#017649" strokeWidth="3" />
        <circle cx="260" cy="150" r="8" fill="#017649" />
      </svg>
    );
  }
  if (art === "credit") {
    return (
      <svg viewBox="0 0 400 300" className="size-full bg-mint/50" fill="none" aria-hidden="true">
        {[0, 1, 2, 3, 4].map((i) => (
          <rect key={i} x={70 + i * 56} y={220 - (i + 1) * 30} width="36" height={(i + 1) * 30} rx="6" fill={i === 4 ? "#017649" : "#95DE64"} opacity={i === 4 ? 1 : 0.35 + i * 0.15} />
        ))}
        <rect x="200" y="50" width="140" height="88" rx="12" fill="#fff" stroke="#D9F7BE" strokeWidth="2" transform="rotate(-8 270 94)" />
        <rect x="216" y="70" width="24" height="18" rx="4" fill="#D9F7BE" transform="rotate(-8 270 94)" />
        <path d="M60 240h290" stroke="#D9F7BE" strokeWidth="2" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 400 300" className="size-full bg-surface" fill="none" aria-hidden="true">
      {[0, 1, 2].map((row) =>
        [0, 1, 2, 3].map((col) => {
          const lit = (row === 1 && col === 2) || (row === 0 && col === 0);
          return (
            <g key={`${row}-${col}`} transform={`translate(${52 + col * 78} ${52 + row * 70})`}>
              <rect width="64" height="54" rx="8" fill={lit ? "#017649" : "#fff"} stroke={lit ? "none" : "#E8E8E8"} />
              <rect x="10" y="12" width="28" height="4" rx="2" fill={lit ? "#95DE64" : "#E8E8E8"} />
              <rect x="10" y="22" width="40" height="4" rx="2" fill={lit ? "#ffffff" : "#EAEAEA"} opacity={lit ? 0.4 : 1} />
              <rect x="10" y="38" width="20" height="6" rx="3" fill={lit ? "#ffffff" : "#D9F7BE"} opacity={lit ? 0.8 : 1} />
            </g>
          );
        }),
      )}
    </svg>
  );
}
