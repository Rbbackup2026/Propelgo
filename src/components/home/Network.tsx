"use client";

import { motion, useReducedMotion } from "motion/react";
import { network } from "@/content/home";
import { Eyebrow, HighlightTitle, Reveal } from "@/components/ui/Reveal";
import { PaymentGlobe } from "./visuals/PaymentGlobe";

const ease = [0.16, 1, 0.3, 1] as const;
const RAIL_COLORS = ["#017649", "#5b57d9", "#0e8ba3", "#c8507a", "#d9822b", "#2f6fd8"];

const STREAKS = [
  { left: "6%", color: "#c8507a", dur: "7s", delay: "0s", opacity: 0.55 },
  { left: "22%", color: "#5b57d9", dur: "9s", delay: "-3s", opacity: 0.45 },
  { left: "58%", color: "#0e8ba3", dur: "8s", delay: "-5s", opacity: 0.4 },
  { left: "74%", color: "#c8507a", dur: "10s", delay: "-1.5s", opacity: 0.35 },
];

export function Network() {
  const reduce = useReducedMotion();
  return (
    <section aria-labelledby="network-title" className="py-14 md:py-20">
      <div className="container-page">
        <div className="relative overflow-hidden rounded-[32px] bg-[linear-gradient(160deg,#ffffff_0%,#fbfbff_45%,#f1f0ff_100%)] ring-1 ring-[#ecebfa]">
          <div className="pointer-events-none absolute inset-0" aria-hidden="true">
            <div className="absolute -top-40 -right-40 size-[720px] rounded-full bg-[radial-gradient(closest-side,rgba(200,80,122,0.08),transparent)]" />
            <div className="absolute -bottom-48 -left-32 size-[640px] rounded-full bg-[radial-gradient(closest-side,rgba(91,87,217,0.1),transparent)]" />
            {!reduce &&
              STREAKS.map((s) => (
                <span
                  key={s.left}
                  className="absolute -top-[30%] h-[170%] w-px origin-top -rotate-[38deg] animate-[streak_linear_infinite] bg-no-repeat"
                  style={{
                    left: s.left,
                    opacity: s.opacity,
                    animationDuration: s.dur,
                    animationDelay: s.delay,
                    backgroundImage: `linear-gradient(to bottom, transparent, ${s.color}, transparent)`,
                    backgroundSize: "100% 28%",
                  }}
                />
              ))}
          </div>

          <div className="relative grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <div className="relative z-10 px-7 pt-10 md:px-12 md:pt-12 lg:pb-12">
              <Reveal>
                <Eyebrow>{network.eyebrow}</Eyebrow>
                <h2 id="network-title" className="mt-3 max-w-[16ch] text-[clamp(2rem,1.4rem+2vw,3.25rem)] leading-[1.05] font-semibold tracking-[-0.035em] text-ink">
                  <HighlightTitle text={network.title} phrase={network.highlight} />
                </h2>
                <p className="mt-5 max-w-[46ch] text-[16.5px] leading-relaxed text-copy">{network.copy}</p>
              </Reveal>

              <ul className="mt-8 flex flex-wrap gap-2">
                {network.rails.map((r, i) => (
                  <motion.li
                    key={r}
                    initial={reduce ? false : { opacity: 0, y: 10, scale: 0.9 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: "spring", bounce: 0.4, visualDuration: 0.5, delay: 0.2 + i * 0.06 }}
                    className="inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-1.5 text-[13.5px] font-medium text-ink shadow-[0_1px_2px_rgba(31,31,31,0.05)] ring-1 ring-black/[0.06]"
                  >
                    <span className="size-1.5 rounded-full" style={{ backgroundColor: RAIL_COLORS[i % RAIL_COLORS.length] }} />
                    {r}
                  </motion.li>
                ))}
              </ul>

              <ul className="mt-8 grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
                {network.points.map((p, i) => (
                  <motion.li
                    key={p.title}
                    initial={reduce ? false : { opacity: 0, x: -14 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, ease, delay: 0.3 + i * 0.08 }}
                    className="flex gap-3"
                  >
                    <span className="mt-1.5 h-4 w-[3px] shrink-0 rounded-full" style={{ backgroundColor: RAIL_COLORS[(i * 2 + 1) % RAIL_COLORS.length] }} />
                    <span>
                      <span className="block text-[15px] font-semibold text-ink">{p.title}</span>
                      <span className="mt-0.5 block text-[14.5px] leading-relaxed text-copy">{p.line}</span>
                    </span>
                  </motion.li>
                ))}
              </ul>
            </div>

            <div className="relative h-[280px] overflow-hidden sm:h-[340px] lg:h-auto">
              <PaymentGlobe className="absolute top-2 left-1/2 w-[400px] -translate-x-1/2 sm:w-[480px] lg:top-1/2 lg:w-[min(600px,100%)] lg:-translate-y-[44%]" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
