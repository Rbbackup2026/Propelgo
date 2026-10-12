"use client";

import { motion, useInView, useReducedMotion } from "motion/react";
import { useRef } from "react";
import { LogoMark } from "@/components/ui/Logo";

const ease = [0.16, 1, 0.3, 1] as const;

const controls = [
  { label: "Supplier payments", value: "₹40 L / mo" },
  { label: "Business travel", value: "₹8 L / mo" },
  { label: "Utilities", value: "₹3 L / mo" },
];

export function OdccVisual() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });
  const on = inView || reduce;

  return (
    <div ref={ref}>
      <div className="grid grid-cols-[1fr_auto] items-center gap-4 sm:gap-6">
        <div className="rounded-2xl border border-paper-300 bg-white p-4 shadow-[0_20px_50px_-30px_rgba(6,38,23,0.35)]">
          <p className="label !text-[9.5px] text-muted">Sanctioned OD/CC limit</p>
          <p className="mt-2 flex items-baseline gap-1.5">
            <span className="tabular text-[24px] font-medium tracking-[-0.03em] text-ink">₹5.00 Cr</span>
            <span className="text-[12px] text-muted">· eligible</span>
          </p>
          <div className="mt-3 flex h-2 overflow-hidden rounded-full bg-paper-200">
            <motion.div className="h-full bg-forest" initial={{ width: "0%" }} animate={{ width: on ? "52%" : "0%" }} transition={{ duration: 1.2, ease }} />
            <motion.div
              className="h-full bg-signal"
              initial={{ width: "0%" }}
              animate={{ width: on ? "24%" : "0%" }}
              transition={{ duration: 1.1, ease, delay: 0.9 }}
            />
          </div>
          <div className="mt-2.5 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-muted">
            <span className="flex items-center gap-1.5">
              <span className="size-2 rounded-[2px] bg-forest" /> Working capital
            </span>
            <span className="flex items-center gap-1.5">
              <span className="size-2 rounded-[2px] bg-signal" /> Card spend
            </span>
          </div>
        </div>

        <motion.div
          initial={reduce ? false : { rotate: 0, y: 20, opacity: 0 }}
          animate={on ? { rotate: 6, y: 0, opacity: 1 } : undefined}
          transition={{ duration: 1.2, ease, delay: 0.5 }}
          className="relative h-[104px] w-[164px] overflow-hidden rounded-xl bg-[linear-gradient(135deg,#12452d,#062617)] p-3 shadow-[0_24px_40px_-18px_rgba(6,38,23,0.7)] sm:h-[118px] sm:w-[186px]"
        >
          <svg className="absolute -top-14 -right-14 size-40 opacity-60" viewBox="0 0 160 160" fill="none" aria-hidden="true">
            {[70, 54, 38].map((r) => (
              <circle key={r} cx="80" cy="80" r={r} stroke="rgba(255,255,255,0.08)" />
            ))}
          </svg>
          <div className="relative flex items-center justify-between">
            <LogoMark tone="dark" className="size-5" />
            <span className="label !text-[8px] text-white/50">ODCC</span>
          </div>
          <p className="relative mt-5 font-mono text-[11px] tracking-[0.14em] text-white/85 sm:mt-7">•••• 7730</p>
          <div className="relative mt-1 flex items-end justify-between">
            <span className="label !text-[7.5px] text-white/45">A. Mehta · Travel</span>
            <span className="flex -space-x-1.5" aria-label="Mastercard">
              <span className="size-3.5 rounded-full bg-[#eb001b]/90" />
              <span className="size-3.5 rounded-full bg-[#f79e1b]/90 mix-blend-screen" />
            </span>
          </div>
        </motion.div>
      </div>

      <ul className="mt-4 grid grid-cols-3 gap-2 sm:gap-3">
        {controls.map((c, i) => (
          <li key={c.label} className="rounded-xl border border-paper-300 bg-white p-3">
            <p className="label truncate !text-[8.5px] text-muted">{c.label}</p>
            <div className="mt-2 flex items-center justify-between gap-2">
              <span className="tabular truncate font-mono text-[11.5px] font-medium text-ink sm:text-[12.5px]">{c.value}</span>
              <Toggle on={Boolean(on)} delay={1.3 + i * 0.35} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Toggle({ on, delay }: { on: boolean; delay: number }) {
  return (
    <motion.span
      className="relative inline-flex h-[18px] w-8 shrink-0 items-center rounded-full p-[2px]"
      initial={{ backgroundColor: "#dedbd0" }}
      animate={{ backgroundColor: on ? "#049A39" : "#dedbd0" }}
      transition={{ duration: 0.3, delay }}
    >
      <motion.span
        className="size-[14px] rounded-full bg-white shadow"
        initial={{ x: 0 }}
        animate={{ x: on ? 14 : 0 }}
        transition={{ type: "spring", stiffness: 500, damping: 30, delay }}
      />
    </motion.span>
  );
}
