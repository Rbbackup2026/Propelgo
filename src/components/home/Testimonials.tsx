"use client";

import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { Fragment, useRef, useState } from "react";
import { testimonials } from "@/content/home";
import { Button } from "@/components/ui/Button";
import { SectionIntro } from "@/components/ui/Reveal";
import { ArrowLeft, ArrowRight } from "@/components/ui/icons";

const ease = [0.16, 1, 0.3, 1] as const;
const DURATION = 7000;

const THEMES: Record<string, { accent: string; tint: string; ring: string; glow: string }> = {
  Versa: { accent: "#017649", tint: "#f6ffee", ring: "#d9f7be", glow: "rgba(149,222,100,0.45)" },
  ODCC: { accent: "#5b57d9", tint: "#f5f4ff", ring: "#e1dffb", glow: "rgba(146,141,245,0.4)" },
  "Orchestration Layer": { accent: "#0e8ba3", tint: "#effafc", ring: "#cdeef4", glow: "rgba(77,196,214,0.4)" },
};
const GLOW_X = ["18%", "82%", "50%"];

export function Testimonials() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-20% 0px" });
  const [[index, dir], setState] = useState<[number, number]>([0, 1]);
  const [held, setHeld] = useState(false);
  const count = testimonials.items.length;
  const go = (d: number) => setState(([i]) => [(i + d + count) % count, d]);
  const jump = (i: number) => setState(([cur]) => [i, i >= cur ? 1 : -1]);
  const t = testimonials.items[index];
  const theme = THEMES[t.product] ?? THEMES.Versa;
  const playing = inView && !held && !reduce;

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

        <div
          ref={ref}
          onMouseEnter={() => setHeld(true)}
          onMouseLeave={() => setHeld(false)}
          onFocus={() => setHeld(true)}
          onBlur={() => setHeld(false)}
        >
          <motion.div
            className="relative mt-12 cursor-grab touch-pan-y overflow-hidden rounded-[28px] px-7 py-10 active:cursor-grabbing md:px-14 md:py-16"
            initial={false}
            animate={{ backgroundColor: theme.tint, boxShadow: `inset 0 0 0 1px ${theme.ring}` }}
            transition={{ duration: 0.9, ease }}
            drag={reduce ? false : "x"}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.12}
            onDragEnd={(_, info) => {
              if (info.offset.x < -60) go(1);
              else if (info.offset.x > 60) go(-1);
            }}
          >
            <motion.div
              className="pointer-events-none absolute top-1/2 size-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
              initial={false}
              animate={{ left: GLOW_X[index % GLOW_X.length], background: `radial-gradient(circle, ${theme.glow}, transparent 65%)` }}
              transition={{ duration: 1.4, ease }}
              aria-hidden="true"
            />

            <AnimatePresence mode="wait" custom={dir} initial={false}>
              <motion.figure key={index} custom={dir} className="relative grid gap-10 md:grid-cols-[220px_minmax(0,1fr)] md:min-h-[236px] md:gap-16">
                <QuoteMark color={theme.accent} reduce={!!reduce} />

                <div className="md:border-r md:border-black/[0.07] md:pr-10">
                  <div className="overflow-hidden pb-1">
                    <motion.p
                      className="text-[clamp(2.75rem,2rem+2vw,3.75rem)] leading-none font-semibold tracking-[-0.04em]"
                      style={{ color: theme.accent }}
                      initial={reduce ? false : { y: "105%", opacity: 0 }}
                      animate={{ y: "0%", opacity: 1 }}
                      exit={reduce ? undefined : { y: "-105%", opacity: 0, transition: { duration: 0.3, ease } }}
                      transition={{ duration: 0.75, ease }}
                    >
                      {t.metric}
                    </motion.p>
                  </div>
                  <motion.p
                    className="mt-3 text-[15px] leading-snug text-copy"
                    initial={reduce ? false : { opacity: 0, x: dir * 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={reduce ? undefined : { opacity: 0, transition: { duration: 0.2 } }}
                    transition={{ duration: 0.6, ease, delay: 0.12 }}
                  >
                    {t.metricLabel}
                  </motion.p>
                  <motion.p
                    className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-[13px] font-medium text-ink shadow-[0_1px_0_rgba(0,0,0,0.04)] ring-1 ring-black/[0.06]"
                    initial={reduce ? false : { opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={reduce ? undefined : { opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                    transition={{ type: "spring", bounce: 0.4, visualDuration: 0.5, delay: 0.2 }}
                  >
                    <span className="size-1.5 rounded-full" style={{ backgroundColor: theme.accent }} />
                    {t.product}
                  </motion.p>
                </div>

                <div>
                  <blockquote className="text-[clamp(1.25rem,1.05rem+0.7vw,1.625rem)] leading-[1.45] font-medium tracking-[-0.014em] text-pretty text-ink md:pr-14">
                    {t.quote.split(" ").map((w, i) => (
                      <Fragment key={i}>
                        <span className="-mb-[0.15em] inline-block overflow-hidden pb-[0.15em] align-bottom">
                          <motion.span
                            className="inline-block"
                            initial={reduce ? false : { y: "110%", rotate: dir * 4 }}
                            animate={{ y: "0%", rotate: 0 }}
                            exit={reduce ? undefined : { y: "-110%", transition: { duration: 0.28, ease, delay: i * 0.004 } }}
                            transition={{ duration: 0.7, ease, delay: 0.1 + i * 0.022 }}
                          >
                            {w}
                          </motion.span>
                        </span>{" "}
                      </Fragment>
                    ))}
                  </blockquote>
                  <motion.figcaption
                    className="mt-8 flex items-center gap-3"
                    initial={reduce ? false : { opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduce ? undefined : { opacity: 0, transition: { duration: 0.2 } }}
                    transition={{ duration: 0.6, ease, delay: 0.45 }}
                  >
                    <span className="grid size-11 place-items-center rounded-full bg-white text-[14px] font-semibold ring-1 ring-black/[0.06]" style={{ color: theme.accent }}>
                      {t.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </span>
                    <span>
                      <span className="block text-[15px] font-semibold text-ink">{t.name}</span>
                      <span className="block text-[14px] text-copy">{t.role}</span>
                    </span>
                  </motion.figcaption>
                </div>
              </motion.figure>
            </AnimatePresence>
          </motion.div>

          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="grid flex-1 grid-cols-3 gap-3 sm:max-w-[460px]" role="tablist" aria-label="Testimonials">
              {testimonials.items.map((item, i) => {
                const c = THEMES[item.product]?.accent ?? THEMES.Versa.accent;
                const done = i < index;
                const current = i === index;
                return (
                  <button
                    key={item.product}
                    type="button"
                    role="tab"
                    aria-selected={current}
                    aria-label={`Testimonial ${i + 1}: ${item.product}`}
                    onClick={() => jump(i)}
                    className="group text-left"
                  >
                    <span className={`block truncate text-[12.5px] font-medium transition-colors duration-300 ${current ? "text-ink" : "text-sub group-hover:text-copy"}`}>
                      {item.product}
                    </span>
                    <span className="mt-2 block h-[3px] overflow-hidden rounded-full bg-black/[0.07]">
                      {current ? (
                        <span
                          key={index}
                          className="block h-full origin-left rounded-full"
                          style={{
                            backgroundColor: c,
                            animation: reduce ? undefined : `t-progress ${DURATION}ms linear forwards`,
                            animationPlayState: playing ? "running" : "paused",
                            transform: reduce ? "scaleX(1)" : undefined,
                          }}
                          onAnimationEnd={() => go(1)}
                        />
                      ) : (
                        <span
                          className="block h-full origin-left rounded-full transition-transform duration-500"
                          style={{ backgroundColor: c, transform: `scaleX(${done ? 1 : 0})`, opacity: 0.35 }}
                        />
                      )}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
        <Button href={testimonials.cta.href} variant="text" className="mt-8">
          {testimonials.cta.label}
        </Button>
      </div>
    </section>
  );
}

function QuoteMark({ color, reduce }: { color: string; reduce: boolean }) {
  return (
    <motion.svg
      viewBox="0 0 64 48"
      className="pointer-events-none absolute -top-4 right-0 hidden w-16 md:block"
      initial={reduce ? false : { opacity: 0, scale: 0.6, rotate: -12 }}
      animate={{ opacity: 0.16, scale: 1, rotate: 0 }}
      exit={reduce ? undefined : { opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
      transition={{ type: "spring", bounce: 0.45, visualDuration: 0.6, delay: 0.15 }}
      aria-hidden="true"
    >
      <path
        fill={color}
        d="M0 48V30C0 14 8 4 24 0l3 7c-8 3-12 8-13 15h12v26H0Zm37 0V30c0-16 8-26 24-30l3 7c-8 3-12 8-13 15h12v26H37Z"
      />
    </motion.svg>
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
