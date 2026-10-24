"use client";

import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { useRef } from "react";
import { LogoMark } from "@/components/ui/Logo";
import { usePhaseLoop } from "@/lib/useStageScale";

const ease = [0.16, 1, 0.3, 1] as const;

type Industry = { name: string; icon: string };

/** 24px stroke icons, one per customer industry. */
const industries: Industry[] = [
  { name: "Aviation", icon: "M3 13.5 21 8l-1-2-8 2.5L7 4H5l3 5.5-4 1.2L2.5 9H1l1.5 4.5zM4 19h16" },
  { name: "Hospitality", icon: "M3 18V8m0 6h18v4M3 11h7a3 3 0 0 1 3 3M16 11h2a3 3 0 0 1 3 3" },
  { name: "Manufacturing", icon: "M3 20V10l5 3V10l5 3V6h3v14H3zM7 17h2m3 0h2" },
  { name: "Pharma", icon: "m10.5 4.5 9 9a4.24 4.24 0 0 1-6 6l-9-9a4.24 4.24 0 0 1 6-6zM8 13l5-5" },
  { name: "Retail", icon: "M5 8h14l-1 12H6L5 8zm4 0V6a3 3 0 0 1 6 0v2" },
  { name: "IT services", icon: "M4 5h16v11H4zM9 20h6M12 16v4" },
];

const OUTER_SPIN = "animate-[spin_48s_linear_infinite]";
const OUTER_UNSPIN = "animate-[spin_48s_linear_infinite_reverse]";
const PULSE_MS = 2600;

/** Unit-circle coordinate to a CSS percentage, rounded so server and client render identical strings. */
const pct = (v: number) => `${(50 + 50 * v).toFixed(3)}%`;

const ring = "absolute rounded-full ring-1 ring-white/15";
const sweepMask = "radial-gradient(closest-side, transparent calc(100% - 2px), #000 calc(100% - 2px))";

/**
 * Featured "Enterprise customers" decoration: industries orbit the PropelGo mark; every pulse one
 * lights up and the onboarding ticker names it. Positions are percentages so it scales with the tile.
 */
export function CustomerOrbit() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-10% 0px" });
  const reduce = useReducedMotion();
  const playing = inView && !reduce;
  const { cycle } = usePhaseLoop(1, PULSE_MS, playing);
  const active = cycle % industries.length;

  return (
    <>
      <div className="pointer-events-none absolute top-7 left-7 z-10 flex items-center gap-2 rounded-full bg-white/12 py-1.5 pr-3.5 pl-2.5 ring-1 ring-white/20 backdrop-blur-sm">
        <span className="relative grid size-2.5 place-items-center">
          <span className="absolute inset-0 animate-ping-soft rounded-full bg-lime motion-reduce:hidden" />
          <span className="relative size-2 rounded-full bg-lime" />
        </span>
        <span className="text-[12.5px] text-white/75">Onboarded</span>
        <span className="relative h-[18px] w-[104px] overflow-hidden">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={active}
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: "0%", opacity: 1 }}
              exit={{ y: "-100%", opacity: 0 }}
              transition={{ duration: 0.45, ease }}
              className="absolute inset-0 text-[12.5px] leading-[18px] font-semibold whitespace-nowrap text-white"
            >
              {industries[active].name}
            </motion.span>
          </AnimatePresence>
        </span>
      </div>

      <div
        ref={ref}
        aria-hidden="true"
        className="pointer-events-none absolute top-[88px] left-1/2 size-[236px] -translate-x-1/2 sm:top-9 sm:right-9 sm:left-auto sm:size-[256px] sm:translate-x-0"
      >
        <div className="absolute -inset-[18%] rounded-full bg-[radial-gradient(closest-side,rgba(149,222,100,0.22),transparent)]" />
        <div className={`${ring} inset-0`} />
        <div className="absolute inset-[24%] rounded-full border border-dashed border-white/25" />
        <div
          className="absolute inset-0 animate-[spin_7s_linear_infinite] rounded-full motion-reduce:hidden"
          style={{ background: "conic-gradient(from 0deg, transparent 0deg 290deg, rgba(149,222,100,0.95) 360deg)", WebkitMask: sweepMask, mask: sweepMask }}
        />

        <div className="absolute inset-[24%] animate-[spin_30s_linear_infinite_reverse] motion-reduce:animate-none">
          {[0, 120, 240].map((deg) => (
            <span
              key={deg}
              className="absolute size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-lime/80 shadow-[0_0_10px_rgba(149,222,100,0.8)]"
              style={{ left: pct(Math.cos((deg * Math.PI) / 180)), top: pct(Math.sin((deg * Math.PI) / 180)) }}
            />
          ))}
        </div>

        <div className="absolute inset-0 grid place-items-center">
          <span className="relative grid size-[60px] place-items-center rounded-full bg-white/12 ring-1 ring-white/25 backdrop-blur-sm">
            <span className="absolute inset-0 animate-ping-soft rounded-full bg-white/10 motion-reduce:hidden" />
            <LogoMark tone="dark" className="relative size-8" />
          </span>
        </div>

        <div className={`absolute inset-0 ${OUTER_SPIN} motion-reduce:animate-none`}>
          {industries.map((ind, i) => {
            const a = (i / industries.length) * Math.PI * 2 - Math.PI / 2;
            const on = i === active;
            return (
              <span
                key={ind.name}
                className="absolute -translate-x-1/2 -translate-y-1/2"
                style={{ left: pct(Math.cos(a)), top: pct(Math.sin(a)) }}
              >
                <span className={`relative block ${OUTER_UNSPIN} motion-reduce:animate-none`}>
                  {on && playing && (
                    <motion.span
                      key={cycle}
                      className="absolute inset-0 rounded-full ring-2 ring-lime"
                      initial={{ scale: 1, opacity: 0.9 }}
                      animate={{ scale: 2.1, opacity: 0 }}
                      transition={{ duration: 1.2, ease: "easeOut" }}
                    />
                  )}
                  <motion.span
                    className="relative grid size-9 place-items-center rounded-full shadow-[0_8px_18px_-8px_rgba(0,0,0,0.45)]"
                    initial={false}
                    animate={on ? { scale: 1.18, backgroundColor: "#95de64", color: "#062617" } : { scale: 1, backgroundColor: "#ffffff", color: "#017649" }}
                    transition={{ type: "spring", bounce: 0.4, visualDuration: 0.4 }}
                  >
                    <svg viewBox="0 0 24 24" className="size-[18px]" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                      <path d={ind.icon} />
                    </svg>
                  </motion.span>
                </span>
              </span>
            );
          })}
        </div>
      </div>
    </>
  );
}
