import Link from "next/link";
import { resources } from "@/content/home";
import { TextLink } from "@/components/ui/Button";
import { Eyebrow, MaskLines, Reveal } from "@/components/ui/Reveal";
import { ArrowUpRight } from "@/components/ui/icons";

export function Resources() {
  return (
    <section className="bg-paper" aria-labelledby="resources-title">
      <div className="mx-auto max-w-[1320px] px-5 py-24 md:px-8 md:py-32">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <Eyebrow>{resources.eyebrow}</Eyebrow>
            <h2 id="resources-title" className="heading mt-6 text-[36px] text-ink md:text-[48px] lg:text-[52px]">
              <MaskLines lines={["Explore our latest insights."]} />
            </h2>
          </div>
          <TextLink href={resources.cta.href}>{resources.cta.label}</TextLink>
        </div>

        <ul className="mt-14 grid gap-5 md:grid-cols-3">
          {resources.items.map((r, i) => (
            <Reveal as="li" key={r.title} delay={i * 0.08}>
              <Link href={r.href} className="group block">
                <div className="relative aspect-[4/3] overflow-hidden rounded-[24px]">
                  <Art kind={r.art} />
                </div>
                <div className="mt-5 flex items-center gap-2">
                  <span className="label rounded bg-paper-200 px-2 py-1 !text-[9.5px] text-ink-soft">{r.type}</span>
                  <span className="label !text-[9.5px] text-muted">{r.read}</span>
                </div>
                <h3 className="mt-3 text-[20px] leading-snug font-medium tracking-[-0.02em] text-ink transition-colors group-hover:text-leaf">{r.title}</h3>
                <span className="mt-4 inline-flex items-center gap-1.5 border-b border-ink/25 pb-1 text-[14px] font-medium text-ink transition-colors group-hover:border-leaf">
                  Read more
                  <ArrowUpRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </Link>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Art({ kind }: { kind: string }) {
  if (kind === "rails") {
    return (
      <div className="grid-lines absolute inset-0 bg-forest">
        <svg viewBox="0 0 400 300" className="absolute inset-0 size-full" fill="none" aria-hidden="true">
          <path d="M0 210 H150 V130 H260 V90 H400" stroke="rgba(7,242,88,0.25)" strokeWidth="1.5" />
          <path
            d="M0 210 H150 V130 H260 V90 H400"
            stroke="#07F258"
            strokeWidth="1.5"
            pathLength="1"
            strokeDasharray="1"
            className="[stroke-dashoffset:0.55] transition-[stroke-dashoffset] duration-1000 ease-out-expo group-hover:[stroke-dashoffset:0]"
          />
          <circle cx="150" cy="210" r="4" fill="#07F258" />
          <circle cx="260" cy="130" r="4" fill="#07F258" />
        </svg>
        <span className="absolute top-[37%] left-[34%] grid size-14 place-items-center rounded-xl bg-signal text-forest transition-transform duration-700 ease-out-expo group-hover:translate-x-6 group-hover:-translate-y-4">
          <ArrowUpRight className="size-6" />
        </span>
      </div>
    );
  }
  if (kind === "card") {
    return (
      <div className="absolute inset-0 grid place-items-center bg-mint">
        <div className="w-[62%]">
          <div className="mx-auto aspect-[1.6] w-[78%] -rotate-6 rounded-2xl bg-[linear-gradient(135deg,#145234,#062617)] p-4 shadow-[0_30px_50px_-20px_rgba(6,38,23,0.6)] transition-transform duration-700 ease-out-expo group-hover:-translate-y-3 group-hover:rotate-0">
            <div className="flex justify-end">
              <ArrowUpRight className="size-5 text-signal" />
            </div>
          </div>
          <div className="mt-8 flex h-2 overflow-hidden rounded-full bg-white">
            <span className="h-full w-[52%] bg-forest" />
            <span className="h-full w-[10%] bg-leaf transition-[width] duration-1000 ease-out-expo group-hover:w-[30%]" />
          </div>
          <p className="label mt-3 text-center !text-[9.5px] text-forest/70">OD/CC limit → card spend</p>
        </div>
      </div>
    );
  }
  return (
    <div className="absolute inset-0 grid place-items-center bg-paper-200">
      <ul className="w-[64%] space-y-2.5">
        {[
          ["w-[58%]", "bg-mint", "w-10"],
          ["w-[44%]", "bg-mint", "w-12"],
          ["w-[52%]", "bg-[#fbf0d9]", "w-9"],
        ].map(([w, pill, pw], i) => (
          <li
            key={i}
            className="flex items-center gap-3 rounded-xl bg-white px-4 py-3.5 shadow-[0_10px_24px_-16px_rgba(6,38,23,0.4)] transition-transform duration-500 ease-out-expo group-hover:translate-x-2"
            style={{ transitionDelay: `${i * 60}ms` }}
          >
            <span className={`size-2.5 rounded-[3px] ${i === 2 ? "bg-paper-300" : "bg-forest"}`} />
            <span className={`h-1.5 rounded-full bg-paper-300 ${w}`} />
            <span className={`ml-auto h-4 rounded-full ${pill} ${pw}`} />
          </li>
        ))}
      </ul>
    </div>
  );
}
