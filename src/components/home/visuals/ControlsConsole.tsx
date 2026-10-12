"use client";

import { motion, useInView, useReducedMotion } from "motion/react";
import { useRef } from "react";
import { Check } from "@/components/ui/icons";
import { usePhaseLoop } from "@/lib/useStageScale";

/** A policy console where enterprise controls switch on, then a scan line sweeps each payment. */
export function ControlsConsole({ controls }: { controls: string[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const seen = useInView(ref, { once: true, margin: "-15% 0px" });
  const inView = useInView(ref, { margin: "-10% 0px" });
  const { phase } = usePhaseLoop(controls.length, 900, inView && !reduce);

  return (
    <div ref={ref} className="overflow-hidden rounded-[28px] bg-forest text-white shadow-[0_40px_80px_-40px_rgba(6,38,23,0.6)]">
      <div className="flex items-center justify-between border-b border-white/[0.08] px-6 py-4">
        <div className="flex items-center gap-2.5">
          <span className="flex gap-1">
            <span className="size-2 rounded-full bg-white/15" />
            <span className="size-2 rounded-full bg-white/15" />
            <span className="size-2 rounded-full bg-white/15" />
          </span>
          <span className="label !text-[10px] text-white/45">Policy engine · Enterprise controls</span>
        </div>
        <span className="flex items-center gap-1.5 rounded-full bg-signal/10 px-2.5 py-1 font-mono text-[10px] text-signal ring-1 ring-signal/30">
          <span className="size-1.5 animate-pulse rounded-full bg-signal" />
          {controls.length}/{controls.length} ACTIVE
        </span>
      </div>

      <div className="p-6 md:p-8">
        <p className="max-w-[30ch] text-[22px] leading-snug font-medium tracking-[-0.02em] md:text-[26px]">
          Every payment protected by enterprise-grade governance.
        </p>
        <p className="mt-2 text-[14px] text-white/50">Control without complexity.</p>

        <ul className="mt-8 grid grid-cols-2 gap-2">
          {controls.map((c, i) => {
            const scanning = !reduce && i === phase;
            return (
              <motion.li
                key={c}
                initial={reduce ? false : { opacity: 0, y: 10 }}
                animate={seen || reduce ? { opacity: 1, y: 0 } : undefined}
                transition={{ duration: 0.5, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
                className={`relative flex items-center gap-2.5 overflow-hidden rounded-xl border px-3.5 py-3.5 text-[13.5px] transition-colors duration-500 ${
                  scanning ? "border-signal/50 bg-signal/[0.08]" : "border-white/[0.08] bg-white/[0.03]"
                }`}
              >
                <span className="grid size-4 shrink-0 place-items-center rounded-full bg-signal text-forest">
                  <Check className="size-2.5" />
                </span>
                <span className="truncate text-white/85">{c}</span>
              </motion.li>
            );
          })}
        </ul>
      </div>

      <div className="flex items-center justify-between border-t border-white/[0.08] px-6 py-3.5 font-mono text-[10.5px] text-white/40">
        <span>INV-2291 · ₹4,82,500 · Kaveri Logistics</span>
        <span className="text-signal">PASSED</span>
      </div>
    </div>
  );
}
