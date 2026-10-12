"use client";

import { motion, useReducedMotion } from "motion/react";
import { finalCta } from "@/content/home";
import { Button } from "@/components/ui/Button";
import { Eyebrow, MaskLines, Reveal } from "@/components/ui/Reveal";

const ease = [0.16, 1, 0.3, 1] as const;

export function FinalCta() {
  const reduce = useReducedMotion();
  return (
    <section className="grain relative isolate overflow-hidden bg-forest text-white" aria-labelledby="cta-title">
      <svg className="pointer-events-none absolute inset-0 -z-10 size-full" viewBox="0 0 1440 640" preserveAspectRatio="xMaxYMid slice" fill="none" aria-hidden="true">
        {[0, 70].map((o, i) => (
          <motion.path
            key={o}
            d={`M${1040 + o} 700 L${1460 + o} 280`}
            stroke={i === 0 ? "#07F258" : "#049A39"}
            strokeOpacity={i === 0 ? 0.35 : 0.3}
            strokeWidth="1.5"
            initial={reduce ? false : { pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true, margin: "-20% 0px" }}
            transition={{ duration: 1.8, ease, delay: 0.2 + i * 0.2 }}
          />
        ))}
      </svg>
      <div className="absolute -bottom-40 -left-40 -z-10 size-[600px] rounded-full bg-[radial-gradient(circle,rgba(7,242,88,0.14),transparent_65%)]" aria-hidden="true" />

      <div className="mx-auto grid max-w-[1320px] gap-14 px-5 py-24 md:px-8 md:py-32 lg:grid-cols-[1.15fr_1fr] lg:gap-20">
        <div>
          <Eyebrow tone="dark">{finalCta.eyebrow}</Eyebrow>
          <h2 id="cta-title" className="display mt-7 text-[46px] md:text-[64px] lg:text-[76px]">
            <MaskLines
              lines={[...finalCta.title.slice(0, 1), `${finalCta.title[1]} ${finalCta.accent}`]}
              render={(line, i) =>
                i === 1 ? (
                  <>
                    {finalCta.title[1]} <span className="text-signal">{finalCta.accent}</span>
                  </>
                ) : (
                  line
                )
              }
            />
          </h2>
          <Reveal delay={0.15}>
            <p className="mt-7 max-w-[44ch] text-[17px] leading-relaxed text-white/65">{finalCta.copy}</p>
            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4">
              <Button href={finalCta.cta.href} size="lg">
                {finalCta.cta.label}
              </Button>
              <a href={`mailto:${finalCta.email}`} className="font-mono text-[13px] text-white/55 transition-colors hover:text-white">
                or write to <span className="text-white/85 underline decoration-white/25 underline-offset-4">{finalCta.email}</span>
              </a>
            </div>
          </Reveal>
        </div>

        <div className="lg:border-l lg:border-white/10 lg:pl-14">
          <p className="label !text-[10px] text-white/45">What happens next</p>
          <ol className="mt-5 border-t border-white/10">
            {finalCta.steps.map((s, i) => (
              <Reveal as="li" key={s.title} delay={0.1 + i * 0.1} className="flex gap-5 border-b border-white/10 py-6">
                <span className="grid size-10 shrink-0 place-items-center rounded-full font-mono text-[12px] text-signal ring-1 ring-signal/40">0{i + 1}</span>
                <div>
                  <p className="text-[17px] font-medium">{s.title}</p>
                  <p className="mt-1 text-[14.5px] leading-relaxed text-white/55">{s.copy}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
