import { security } from "@/content/home";
import { Eyebrow, MaskLines, Reveal } from "@/components/ui/Reveal";
import { EyeIcon, LockIcon, ShieldIcon } from "@/components/ui/icons";
import { ControlsConsole } from "./visuals/ControlsConsole";

const principleIcons = [ShieldIcon, LockIcon, EyeIcon];

export function Security() {
  return (
    <section className="bg-paper" aria-labelledby="security-title">
      <div className="mx-auto grid max-w-[1320px] gap-14 px-5 py-24 md:px-8 md:py-32 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
        <div>
          <Eyebrow>{security.eyebrow}</Eyebrow>
          <h2 id="security-title" className="heading mt-6 text-[36px] text-ink md:text-[48px] lg:text-[52px]">
            <MaskLines lines={["Built for trust.", "Designed for", "enterprise."]} />
          </h2>
          <Reveal delay={0.1}>
            <p className="mt-7 max-w-[42ch] text-[16px] leading-relaxed text-ink-soft">{security.copy}</p>
          </Reveal>

          <ul className="mt-10 space-y-px overflow-hidden rounded-2xl border border-paper-300 bg-paper-300">
            {security.principles.map((p, i) => {
              const Icon = principleIcons[i];
              return (
                <Reveal as="li" key={p.title} delay={0.1 + i * 0.08} className="flex gap-4 bg-paper p-5">
                  <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-white text-leaf ring-1 ring-paper-300">
                    <Icon />
                  </span>
                  <div>
                    <p className="text-[16px] font-medium text-ink">{p.title}</p>
                    <p className="mt-1 text-[14px] leading-relaxed text-muted">{p.copy}</p>
                  </div>
                </Reveal>
              );
            })}
          </ul>
        </div>

        <div className="flex flex-col gap-4">
          <Reveal>
            <ControlsConsole controls={security.controls} />
          </Reveal>
          <Reveal delay={0.1}>
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="grid aspect-[4/3] place-items-center rounded-2xl border border-dashed border-paper-300 bg-white/60 text-center"
                >
                  <div>
                    <span className="mx-auto grid size-8 place-items-center rounded-full border border-dashed border-ink/20 text-ink/40">
                      <ShieldIcon className="size-3.5" />
                    </span>
                    <span className="label mt-2 block !text-[8.5px] text-muted">Certification</span>
                  </div>
                </div>
              ))}
            </div>
            <p className="label mt-3 w-fit rounded border border-dashed border-amber/50 bg-[#fbf0d9]/60 px-2 py-1 !text-[9.5px] text-amber">{security.badgesNote}</p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
