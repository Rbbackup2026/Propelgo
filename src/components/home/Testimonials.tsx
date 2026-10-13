"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Fragment, useState } from "react";
import { testimonials } from "@/content/home";
import { Button } from "@/components/ui/Button";
import { SectionIntro } from "@/components/ui/Reveal";
import { ArrowLeft, ArrowRight } from "@/components/ui/icons";

const ease = [0.16, 1, 0.3, 1] as const;

export function Testimonials() {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const count = testimonials.items.length;
  const go = (d: number) => setIndex((i) => (i + d + count) % count);
  const t = testimonials.items[index];

  return (
    <section className="py-28 md:py-36">
      <div className="container-page">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <SectionIntro eyebrow={testimonials.eyebrow} title={testimonials.title} />
          <div className="flex items-center gap-2">
            <NavButton label="Previous testimonial" onClick={() => go(-1)}>
              <ArrowLeft />
            </NavButton>
            <NavButton label="Next testimonial" onClick={() => go(1)}>
              <ArrowRight />
            </NavButton>
          </div>
        </div>

        <motion.div
          className="mt-12 cursor-grab touch-pan-y rounded-[28px] bg-mist px-7 py-10 ring-1 ring-mint active:cursor-grabbing md:px-14 md:py-16"
          drag={reduce ? false : "x"}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.12}
          onDragEnd={(_, info) => {
            if (info.offset.x < -60) go(1);
            else if (info.offset.x > 60) go(-1);
          }}
        >
          <AnimatePresence mode="wait">
            <motion.figure
              key={index}
              className="grid gap-10 md:grid-cols-[220px_minmax(0,1fr)] md:gap-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.2 } }}
            >
              <div className="md:border-r md:border-mint md:pr-10">
                <p className="text-[clamp(2.75rem,2rem+2vw,3.75rem)] leading-none font-semibold tracking-[-0.04em] text-brand">{t.metric}</p>
                <p className="mt-3 text-[15px] leading-snug text-copy">{t.metricLabel}</p>
                <p className="mt-6 inline-flex rounded-full bg-white px-3 py-1 text-[13px] font-medium text-ink ring-1 ring-mint">{t.product}</p>
              </div>
              <div>
                <blockquote className="text-[clamp(1.25rem,1.05rem+0.7vw,1.625rem)] leading-[1.45] font-medium tracking-[-0.014em] text-pretty text-ink">
                  {t.quote.split(" ").map((w, i) => (
                    <Fragment key={i}>
                      <motion.span
                        className="inline-block"
                        initial={reduce ? false : { opacity: 0, filter: "blur(6px)" }}
                        animate={{ opacity: 1, filter: "blur(0px)" }}
                        transition={{ duration: 0.5, ease, delay: i * 0.018 }}
                      >
                        {w}
                      </motion.span>{" "}
                    </Fragment>
                  ))}
                </blockquote>
                <figcaption className="mt-8 flex items-center gap-3">
                  <span className="grid size-11 place-items-center rounded-full bg-white text-[14px] font-semibold text-brand ring-1 ring-mint">
                    {t.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </span>
                  <span>
                    <span className="block text-[15px] font-semibold text-ink">{t.name}</span>
                    <span className="block text-[14px] text-copy">{t.role}</span>
                  </span>
                </figcaption>
              </div>
            </motion.figure>
          </AnimatePresence>
        </motion.div>

        <div className="mt-6 flex items-center justify-between">
          <div className="flex gap-2" role="tablist" aria-label="Testimonials">
            {testimonials.items.map((item, i) => (
              <button
                key={item.product}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={`Testimonial ${i + 1}`}
                onClick={() => setIndex(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${i === index ? "w-8 bg-brand" : "w-1.5 bg-ghost hover:bg-sub"}`}
              />
            ))}
          </div>
          <p className="text-[13px] text-sub">{testimonials.note}</p>
        </div>
        <Button href={testimonials.cta.href} variant="text" className="mt-8">
          {testimonials.cta.label}
        </Button>
      </div>
    </section>
  );
}

function NavButton({ label, onClick, children }: { label: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="grid size-12 place-items-center rounded-full text-ink ring-1 ring-line transition-colors hover:bg-surface hover:ring-ghost"
    >
      {children}
    </button>
  );
}
