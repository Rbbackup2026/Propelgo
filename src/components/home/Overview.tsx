import { overview, stats } from "@/content/home";
import { TextLink } from "@/components/ui/Button";
import { Counter } from "@/components/ui/Counter";
import { Eyebrow, MaskLines, Reveal } from "@/components/ui/Reveal";
import { ArrowUpRight } from "@/components/ui/icons";
import { EcosystemDiagram } from "./visuals/EcosystemDiagram";
import { StatBar } from "./visuals/StatBar";

export function Overview() {
  return (
    <section id="about" className="bg-paper" aria-labelledby="overview-title">
      <div className="mx-auto grid max-w-[1320px] items-center gap-14 px-5 pt-24 pb-20 md:px-8 md:pt-32 lg:grid-cols-[1.05fr_1fr] lg:gap-20">
        <Reveal className="order-2 lg:order-1">
          <EcosystemDiagram />
        </Reveal>

        <div className="order-1 lg:order-2">
          <Eyebrow>{overview.eyebrow}</Eyebrow>
          <h2 id="overview-title" className="heading mt-6 text-[36px] text-ink md:text-[48px] lg:text-[52px]">
            <MaskLines lines={["Building the", "infrastructure behind", "modern business", "payments."]} />
          </h2>
          <Reveal delay={0.1}>
            <p className="mt-7 text-[18px] leading-relaxed font-medium text-ink">{overview.lead}</p>
            <p className="mt-4 text-[16px] leading-relaxed text-ink-soft">{overview.body}</p>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="mt-8 flex items-start gap-4 rounded-2xl border border-paper-300 bg-white p-5">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-mint text-leaf">
                <ArrowUpRight className="size-4" />
              </span>
              <div>
                <p className="label !text-[10px] text-leaf">{overview.milestone.label}</p>
                <p className="mt-1.5 text-[15px] leading-snug font-medium text-ink">{overview.milestone.text}</p>
              </div>
            </div>
            <div className="mt-8">
              <TextLink href={overview.cta.href}>{overview.cta.label}</TextLink>
            </div>
          </Reveal>
        </div>
      </div>

      <div className="mx-auto max-w-[1320px] px-5 pb-24 md:px-8 md:pb-32">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <Reveal>
            <h3 className="heading text-[26px] text-ink md:text-[30px]">{stats.title}</h3>
          </Reveal>
          <p className="label w-fit rounded border border-dashed border-amber/50 bg-[#fbf0d9]/60 px-2 py-1 !text-[9.5px] text-amber">{stats.note}</p>
        </div>
        <dl className="mt-10 grid grid-cols-2 border-t border-paper-300 lg:grid-cols-4">
          {stats.items.map((s, i) => (
            <Reveal
              key={s.label}
              delay={i * 0.08}
              className="border-paper-300 py-8 pr-6 max-lg:odd:border-r max-lg:nth-[n+3]:border-t lg:not-last:border-r lg:not-first:pl-8"
            >
              <dt className="sr-only">{s.label}</dt>
              <dd>
                <p className="heading text-[34px] whitespace-nowrap text-ink sm:text-[44px] xl:text-[56px]">
                  <Counter value={s.value} prefix={s.prefix} />
                  <span className={`text-leaf ${s.suffix.length > 2 ? "text-[0.72em]" : ""}`}>{s.suffix}</span>
                </p>
                <p className="mt-2 text-[14px] text-muted">{s.label}</p>
                <StatBar index={i} />
              </dd>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  );
}
