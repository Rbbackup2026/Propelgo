"use client";

import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { useRef } from "react";
import { usePhaseLoop } from "@/lib/useStageScale";
import { RealIcon, type RealIconName } from "@/components/ui/RealIcon";

const ease = [0.16, 1, 0.3, 1] as const;

type Segment = { industry: string; city: string; count: number; icon: RealIconName };

/** Illustrative industry mix: counts sum to the headline figure, not named customers. */
const segments: Segment[] = [
  { industry: "Manufacturing", city: "Pune", count: 28, icon: "manufacturing" },
  { industry: "Pharma", city: "Hyderabad", count: 22, icon: "pharma" },
  { industry: "IT services", city: "Chennai", count: 21, icon: "it" },
  { industry: "Retail", city: "Bengaluru", count: 19, icon: "retail" },
  { industry: "Hospitality", city: "Goa", count: 16, icon: "hospitality" },
  { industry: "Aviation", city: "Mumbai", count: 14, icon: "aviation" },
];

const total = segments.reduce((sum, s) => sum + s.count, 0);
const ORDER = [1, 5, 0, 3, 2, 4];
const STEP_MS = 3200;

/** Featured "Enterprise customers" decoration: an industry mosaic where one sector lights up per new onboarding. */
export function CustomerOrbit() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-10% 0px" });
  const reduce = useReducedMotion();
  const { cycle } = usePhaseLoop(1, STEP_MS, inView && !reduce);
  const active = ORDER[cycle % ORDER.length];
  const current = segments[active];

  return (
    <div ref={ref} aria-hidden="true" className="pointer-events-none absolute inset-x-7 top-7">
      <div className="flex items-center justify-between gap-3">
        <span className="flex min-w-0 items-center gap-2 text-[12px] font-medium text-white/80">
          <span className="relative flex size-2 shrink-0">
            <span className="absolute inset-0 animate-ping rounded-full bg-lime/70 motion-reduce:animate-none" />
            <span className="relative size-2 rounded-full bg-lime" />
          </span>
          <span className="relative h-4 min-w-0 flex-1 overflow-hidden">
            <AnimatePresence initial={false} mode="popLayout">
              <motion.span
                key={cycle}
                initial={{ y: 14, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -14, opacity: 0 }}
                transition={{ duration: 0.5, ease }}
                className="block truncate"
              >
                Onboarded · {current.industry}, {current.city}
              </motion.span>
            </AnimatePresence>
          </span>
        </span>
        <span className="shrink-0 rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-medium text-white/80 ring-1 ring-white/15">
          <span className="text-lime">+18</span> this quarter
        </span>
      </div>

      <ul className="mt-4 grid grid-cols-3 gap-2">
        {segments.map((s, i) => {
          const on = i === active;
          return (
            <motion.li
              key={s.industry}
              animate={{
                backgroundColor: on ? "rgba(255,255,255,0.16)" : "rgba(255,255,255,0.06)",
                boxShadow: on ? "inset 0 0 0 1px rgba(149,222,100,0.55)" : "inset 0 0 0 1px rgba(255,255,255,0.10)",
              }}
              transition={{ duration: 0.6, ease }}
              className="relative flex flex-col gap-2.5 rounded-[16px] p-3 backdrop-blur-sm"
            >
              <div className="flex items-start justify-between">
                <motion.span
                  animate={{ scale: on ? 1.06 : 1 }}
                  transition={{ type: "spring", bounce: 0.4, visualDuration: 0.5 }}
                  className={`grid size-11 place-items-center rounded-[12px] transition-colors duration-500 ${
                    on ? "bg-white shadow-[0_6px_16px_-6px_rgba(0,0,0,0.45)]" : "bg-white/15"
                  }`}
                >
                  <RealIcon name={s.icon} className="size-9" />
                </motion.span>
                <AnimatePresence>
                  {on && (
                    <motion.span
                      key={cycle}
                      initial={{ opacity: 0, y: 6, scale: 0.8 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -6, transition: { duration: 0.25 } }}
                      transition={{ type: "spring", bounce: 0.35, visualDuration: 0.45 }}
                      className="rounded-full bg-lime px-1.5 py-0.5 text-[10px] leading-none font-semibold text-[#04452b]"
                    >
                      +1
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
              <div className="min-w-0">
                <span className="block truncate text-[12.5px] leading-tight font-semibold text-white">{s.industry}</span>
                <span className="mt-0.5 block text-[11px] truncate text-white/55 tabular-nums">{s.count} customers</span>
              </div>
            </motion.li>
          );
        })}
      </ul>

      <div className="mt-3 flex h-1.5 gap-1 overflow-hidden rounded-full">
        {segments.map((s, i) => (
          <motion.span
            key={s.industry}
            className="h-full rounded-full"
            style={{ width: `${(s.count / total) * 100}%` }}
            animate={{ backgroundColor: i === active ? "rgba(149,222,100,1)" : "rgba(255,255,255,0.22)" }}
            transition={{ duration: 0.6, ease }}
          />
        ))}
      </div>
    </div>
  );
}
