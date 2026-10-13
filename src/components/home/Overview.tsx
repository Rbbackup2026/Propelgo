import { overview, stats } from "@/content/home";
import { Button } from "@/components/ui/Button";
import { Counter } from "@/components/ui/Counter";
import { Eyebrow, Reveal } from "@/components/ui/Reveal";
import { EcosystemOrbit } from "./visuals/EcosystemOrbit";

export function Overview() {
  return (
    <section id="about" className="bg-surface py-28 md:py-40">
      <div className="container-page">
        <div className="grid items-center gap-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,520px)] lg:gap-20">
          <Reveal className="max-w-[540px]">
            <Eyebrow>{overview.eyebrow}</Eyebrow>
            <h2 className="mt-4 text-h2 text-balance text-ink">{overview.title}</h2>
            <p className="mt-6 text-lead text-pretty text-ink">{overview.lead}</p>
            <p className="mt-4 text-body text-pretty text-copy">{overview.body}</p>
            <p className="mt-8 border-l-2 border-lime pl-4 text-[15px] leading-relaxed text-copy">{overview.milestone}</p>
            <Button href={overview.cta.href} variant="text" className="mt-8">
              {overview.cta.label}
            </Button>
          </Reveal>
          <Reveal delay={0.1}>
            <EcosystemOrbit />
          </Reveal>
        </div>

        <div className="mt-28 md:mt-36">
          <Reveal>
            <h3 className="max-w-[24ch] text-h3 text-ink">{stats.title}</h3>
          </Reveal>
          <dl className="mt-10 grid grid-cols-2 gap-y-10 border-t border-line pt-10 lg:grid-cols-4">
            {stats.items.map((s, i) => (
              <Reveal key={s.label} delay={i * 0.06} className={`pr-6 ${i % 2 === 1 ? "pl-6" : ""} lg:px-8 lg:first:pl-0 ${i > 0 ? "lg:border-l lg:border-line" : ""}`}>
                <dt className="text-[15px] text-copy">{s.label}</dt>
                <dd className="mt-3 text-[clamp(2rem,1.5rem+1.6vw,2.75rem)] leading-none font-semibold tracking-[-0.03em] whitespace-nowrap text-ink">
                  <Counter value={s.value} prefix={s.prefix} suffix={s.suffix} suffixClassName={s.suffix.length > 2 ? "text-[0.6em] tracking-[-0.01em]" : ""} />
                </dd>
              </Reveal>
            ))}
          </dl>
          <p className="mt-8 text-[13px] text-sub">{stats.note}</p>
        </div>
      </div>
    </section>
  );
}
