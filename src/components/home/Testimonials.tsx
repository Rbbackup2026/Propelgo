"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { testimonials } from "@/content/home";
import { TextLink } from "@/components/ui/Button";
import { Eyebrow, MaskLines, Reveal } from "@/components/ui/Reveal";
import { ArrowLeft, ArrowRight } from "@/components/ui/icons";

const ease = [0.16, 1, 0.3, 1] as const;
const items = testimonials.items;

export function Testimonials() {
  const [[index, dir], setState] = useState<[number, number]>([0, 1]);
  const go = (d: number) => setState(([i]) => [(i + d + items.length) % items.length, d]);
  const t = items[index];
  const others = [1, 2].map((k) => (index + k) % items.length);

  return (
    <section className="bg-white" aria-labelledby="testimonials-title">
      <div className="mx-auto max-w-[1320px] px-5 py-24 md:px-8 md:py-32">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <Eyebrow>{testimonials.eyebrow}</Eyebrow>
            <h2 id="testimonials-title" className="heading mt-6 text-[36px] text-ink md:text-[48px] lg:text-[52px]">
              <MaskLines lines={["Trusted by businesses", "building what's next."]} />
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <span className="label mr-2 hidden rounded border border-dashed border-amber/50 bg-[#fbf0d9]/60 px-2 py-1 !text-[9.5px] text-amber lg:inline">
              {testimonials.note}
            </span>
            <button
              type="button"
              aria-label="Previous testimonial"
              onClick={() => go(-1)}
              className="grid size-12 place-items-center rounded-full text-ink ring-1 ring-paper-300 transition-colors hover:bg-paper"
            >
              <ArrowLeft className="size-4" />
            </button>
            <button
              type="button"
              aria-label="Next testimonial"
              onClick={() => go(1)}
              className="grid size-12 place-items-center rounded-full bg-forest text-signal transition-colors hover:bg-forest-700"
            >
              <ArrowRight className="size-4" />
            </button>
          </div>
        </div>

        <div className="mt-14 grid gap-4 lg:grid-cols-[1.45fr_1fr]">
          <Reveal>
            <div className="relative h-full min-h-[440px] overflow-hidden rounded-[28px] border border-paper-300/80 bg-paper">
              <AnimatePresence mode="popLayout" custom={dir} initial={false}>
                <motion.figure
                  key={index}
                  custom={dir}
                  variants={{
                    enter: (d: number) => ({ opacity: 0, x: d * 60 }),
                    center: { opacity: 1, x: 0 },
                    exit: (d: number) => ({ opacity: 0, x: d * -60 }),
                  }}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.6, ease }}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.2}
                  onDragEnd={(_, info) => {
                    if (info.offset.x < -60) go(1);
                    else if (info.offset.x > 60) go(-1);
                  }}
                  className="flex h-full cursor-grab flex-col p-8 active:cursor-grabbing md:p-12"
                >
                  <div className="flex items-start justify-between">
                    <svg viewBox="0 0 40 32" className="h-8 w-10 text-leaf" fill="currentColor" aria-hidden="true">
                      <path d="M0 32V19.2C0 8.4 5.6 1.9 16.8 0l1.9 4.4c-5.5 1.6-8.4 5-8.8 10.2H17V32H0Zm22.9 0V19.2C22.9 8.4 28.5 1.9 39.7 0l1.9 4.4c-5.5 1.6-8.4 5-8.8 10.2h7.1V32h-17Z" />
                    </svg>
                    <span className="label rounded bg-white px-2 py-1 !text-[9.5px] text-muted ring-1 ring-paper-300">{t.product}</span>
                  </div>
                  <blockquote className="mt-10 max-w-[30ch] text-[24px] leading-[1.3] font-medium tracking-[-0.02em] text-ink md:text-[30px]">
                    {t.quote}
                  </blockquote>
                  <figcaption className="mt-auto flex flex-wrap items-end justify-between gap-6 pt-12">
                    <div className="flex items-center gap-3">
                      <span className="size-11 rounded-full bg-[linear-gradient(135deg,#d7f5df,#9fc7ab)]" />
                      <div>
                        <p className="text-[15px] font-medium text-ink">{t.name}</p>
                        <p className="text-[13px] text-muted">{t.role}</p>
                      </div>
                    </div>
                    <TextLink href={testimonials.cta.href}>Read customer story</TextLink>
                  </figcaption>
                </motion.figure>
              </AnimatePresence>
            </div>
          </Reveal>

          <div className="grid gap-4">
            {others.map((oi, k) => {
              const o = items[oi];
              const dark = k === 0;
              return (
                <Reveal key={k} delay={0.1 + k * 0.08}>
                  <button
                    type="button"
                    onClick={() => setState([oi, 1])}
                    className={`group block h-full w-full rounded-[28px] p-7 text-left transition-transform duration-500 ease-out-expo hover:-translate-y-1 ${
                      dark ? "bg-forest text-white" : "border border-paper-300 bg-white text-ink"
                    }`}
                  >
                    <AnimatePresence mode="wait" initial={false}>
                      <motion.div key={oi} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.35, ease }}>
                        <p className="flex items-baseline gap-3">
                          <span className={`heading text-[44px] ${dark ? "text-signal" : "text-ink"}`}>{o.metric}</span>
                          <span className={`text-[13px] ${dark ? "text-white/55" : "text-muted"}`}>{o.metricLabel}</span>
                        </p>
                        <p className={`mt-4 line-clamp-3 text-[16px] leading-relaxed ${dark ? "text-white/85" : "text-ink-soft"}`}>&ldquo;{o.quote}&rdquo;</p>
                        <div className="mt-6 flex items-center gap-3">
                          <span className={`size-8 rounded-full ${dark ? "bg-white/15" : "bg-paper-200"}`} />
                          <div>
                            <p className="text-[13.5px] font-medium">{o.name}</p>
                            <p className={`text-[12px] ${dark ? "text-white/45" : "text-muted"}`}>{o.role}</p>
                          </div>
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  </button>
                </Reveal>
              );
            })}
          </div>
        </div>

        <div className="mt-6 flex justify-center gap-2" aria-hidden="true">
          {items.map((_, i) => (
            <span key={i} className={`h-1 rounded-full transition-all duration-500 ${i === index ? "w-8 bg-forest" : "w-2 bg-paper-300"}`} />
          ))}
        </div>
      </div>
    </section>
  );
}
