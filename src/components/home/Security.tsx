"use client";

import Image from "next/image";
import { motion, useInView, useReducedMotion } from "motion/react";
import { useRef } from "react";
import { security } from "@/content/home";
import { Eyebrow, Reveal } from "@/components/ui/Reveal";
import { Check } from "@/components/ui/icons";
import { usePhaseLoop } from "@/lib/useStageScale";

const ease = [0.16, 1, 0.3, 1] as const;

export function Security() {
  const ref = useRef<HTMLUListElement>(null);
  const inView = useInView(ref, { margin: "-15% 0px" });
  const reduce = useReducedMotion();
  const playing = inView && !reduce;
  // A verification highlight walks the row, one certificate at a time.
  const { cycle } = usePhaseLoop(1, 1800, playing);
  const active = playing ? cycle % security.certifications.length : -1;

  return (
    <section aria-labelledby="security-title" className="py-20 md:py-28">
      <div className="container-page">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)] lg:items-end lg:gap-16">
          <Reveal>
            <Eyebrow>{security.eyebrow}</Eyebrow>
            <h2 id="security-title" className="mt-3 max-w-[22ch] text-[clamp(1.625rem,1.3rem+1vw,2.125rem)] leading-tight font-semibold tracking-[-0.022em] text-ink">
              {security.title}
            </h2>
          </Reveal>
          <Reveal delay={0.06}>
            <p className="text-[16px] leading-relaxed text-copy">{security.copy}</p>
          </Reveal>
        </div>

        <ul ref={ref} className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 md:mt-12 md:gap-4 lg:grid-cols-6">
          {security.certifications.map((c, i) => {
            const on = i === active;
            return (
              <motion.li
                key={c.name}
                initial={reduce ? false : { opacity: 0, y: 24, scale: 0.96 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "0px 0px -8% 0px" }}
                transition={{ duration: 0.7, ease, delay: i * 0.07 }}
                whileHover={reduce ? undefined : { y: -6 }}
                className="group relative flex flex-col overflow-hidden rounded-2xl bg-white ring-1 ring-line transition-shadow duration-500 hover:shadow-[0_24px_44px_-26px_rgba(6,38,23,0.35)]"
              >
                <span
                  className={`pointer-events-none absolute inset-0 rounded-2xl ring-2 ring-brand/35 transition-opacity duration-500 group-hover:opacity-100 ${on ? "opacity-100" : "opacity-0"}`}
                  aria-hidden="true"
                />
                <motion.span
                  className="absolute top-3 right-3 grid size-5 place-items-center rounded-full bg-brand text-white"
                  initial={false}
                  animate={{ scale: on ? 1 : 0, opacity: on ? 1 : 0 }}
                  transition={{ type: "spring", bounce: 0.5, visualDuration: 0.35 }}
                  aria-hidden="true"
                >
                  <Check className="size-2.5" />
                </motion.span>

                <div className="relative grid h-[112px] place-items-center px-5 pt-4">
                  <Image
                    src={c.src}
                    alt={`${c.name} certification`}
                    width={c.width}
                    height={c.height}
                    sizes="160px"
                    className="max-h-[76px] w-auto object-contain mix-blend-multiply transition-transform duration-500 ease-out-expo group-hover:scale-[1.06]"
                  />
                </div>
                <div className="border-t border-line/70 px-4 py-3 text-center">
                  <p className="text-[13.5px] font-semibold text-ink">{c.name}</p>
                  <p className="mt-0.5 text-[12px] text-sub">{c.line}</p>
                </div>
              </motion.li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
