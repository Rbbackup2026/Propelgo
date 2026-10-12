"use client";

import { motion, useReducedMotion } from "motion/react";
import { LogoMark } from "@/components/ui/Logo";
import { Check } from "@/components/ui/icons";
import { usePhaseLoop } from "@/lib/useStageScale";

const ease = [0.16, 1, 0.3, 1] as const;

export function CapabilityArt({ index, active }: { index: number; active: boolean }) {
  const Art = [RoutingArt, CardsArt, WorkflowArt, LedgerArt][index];
  return <Art active={active} />;
}

function useLoop(n: number, ms: number, active: boolean) {
  const reduce = useReducedMotion();
  const { phase } = usePhaseLoop(n, ms, active && !reduce);
  return reduce ? n - 1 : phase;
}

/* 01 — Payment orchestration */
function RoutingArt({ active }: { active: boolean }) {
  const phase = useLoop(3, 1600, active);
  const dests = [
    { label: "Bank 01", meta: "NEFT", y: 50 },
    { label: "Bank 02", meta: "Virtual card", y: 150 },
    { label: "Card network", meta: "RuPay", y: 250 },
  ];
  const order = [1, 0, 2];
  const target = order[phase];
  const path = (y: number) => `M200 170 H290 V${y + 22} H350`;
  return (
    <svg viewBox="0 0 520 340" className="size-full" fill="none" aria-hidden="true">
      <rect x="10" y="140" width="130" height="60" rx="12" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.14)" />
      <text x="26" y="164" fill="rgba(255,255,255,0.45)" fontSize="10" fontFamily="var(--font-mono)" letterSpacing="1.2">PAYMENT</text>
      <text x="26" y="186" fill="#fff" fontSize="16" fontFamily="var(--font-sans)">₹4,82,500</text>
      <path d="M140 170 H160" stroke="#07F258" strokeWidth="1.5" />
      <rect x="160" y="146" width="48" height="48" rx="12" fill="#07F258" />
      <path d="m176 178 16-16m-11 0h11v11" stroke="#062617" strokeWidth="2.2" />
      {dests.map((d, i) => (
        <g key={d.label}>
          <path d={path(d.y)} stroke={i === target ? "#07F258" : "rgba(255,255,255,0.12)"} strokeWidth={i === target ? 1.6 : 1} style={{ transition: "stroke .4s" }} />
          <rect
            x="350"
            y={d.y}
            width="160"
            height="44"
            rx="10"
            fill={i === target ? "rgba(7,242,88,0.1)" : "rgba(255,255,255,0.03)"}
            stroke={i === target ? "rgba(7,242,88,0.7)" : "rgba(255,255,255,0.12)"}
            style={{ transition: "all .4s" }}
          />
          <text x="366" y={d.y + 27} fill={i === target ? "#fff" : "rgba(255,255,255,0.6)"} fontSize="13" fontFamily="var(--font-sans)">
            {d.label}
          </text>
          <text x="496" y={d.y + 27} textAnchor="end" fill={i === target ? "#07F258" : "rgba(255,255,255,0.3)"} fontSize="9" fontFamily="var(--font-mono)">
            {d.meta.toUpperCase()}
          </text>
        </g>
      ))}
      <circle key={target} r="4.5" fill="#07F258">
        <animateMotion dur="1.2s" repeatCount="indefinite" path={path(dests[target].y)} />
      </circle>
      <text x="10" y="320" fill="rgba(255,255,255,0.35)" fontSize="10" fontFamily="var(--font-mono)" letterSpacing="1.2">
        RULE · ROUTE BY AMOUNT, VENDOR AND RAIL
      </text>
    </svg>
  );
}

/* 02 — Virtual & commercial cards */
function CardsArt({ active }: { active: boolean }) {
  const reduce = useReducedMotion();
  const open = active || reduce;
  const cards = [
    { label: "Vendor · Kaveri Logistics", num: "8812", rot: -14, x: -120, y: 20 },
    { label: "Travel · A. Mehta", num: "7730", rot: 0, x: 0, y: -10 },
    { label: "Utilities · Recurring", num: "3047", rot: 14, x: 120, y: 20 },
  ];
  const chips = ["Limit ₹2,00,000", "Vendor-locked", "Valid 30 days", "Single use"];
  return (
    <div className="relative grid size-full place-items-center">
      <div className="relative h-[170px] w-[260px] max-sm:-mt-10 max-sm:scale-[0.62]">
        {cards.map((c, i) => (
          <motion.div
            key={c.num}
            className={`absolute inset-0 overflow-hidden rounded-2xl border p-4 ${
              i === 1 ? "z-10 border-signal/50 bg-[linear-gradient(135deg,#145234,#0a2c1c)]" : "border-white/12 bg-[linear-gradient(135deg,#0f3a26,#051e12)]"
            }`}
            animate={open ? { rotate: c.rot, x: c.x, y: c.y } : { rotate: 0, x: 0, y: 0 }}
            transition={{ duration: 1, ease, delay: open ? 0.1 + i * 0.06 : 0 }}
          >
            <div className="flex items-center justify-between">
              <LogoMark tone="dark" className="size-6" />
              <span className="font-mono text-[9px] tracking-[0.14em] text-white/45">VIRTUAL</span>
            </div>
            <p className="mt-9 font-mono text-[14px] tracking-[0.16em] text-white/85">•••• {c.num}</p>
            <p className="mt-1.5 font-mono text-[9px] tracking-[0.12em] text-white/45 uppercase">{c.label}</p>
          </motion.div>
        ))}
      </div>
      <ul className="absolute bottom-2 left-1/2 flex w-full max-w-[360px] -translate-x-1/2 flex-wrap justify-center gap-2 sm:bottom-6">
        {chips.map((c, i) => (
          <motion.li
            key={c}
            initial={false}
            animate={open ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
            transition={{ duration: 0.5, ease, delay: open ? 0.6 + i * 0.12 : 0 }}
            className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.05] px-3 py-1.5 font-mono text-[10.5px] text-white/75"
          >
            <span className="size-1.5 rounded-full bg-signal" />
            {c}
          </motion.li>
        ))}
      </ul>
    </div>
  );
}

/* 03 — Workflow automation */
function WorkflowArt({ active }: { active: boolean }) {
  const phase = useLoop(4, 1100, active);
  const steps = [
    { who: "Maker", what: "Payment raised", by: "A. Mehta · Finance" },
    { who: "Checker", what: "Reviewed & approved", by: "R. Kapoor · Controller" },
    { who: "Release", what: "Paid on virtual card", by: "Policy engine · auto" },
  ];
  return (
    <div className="grid size-full place-items-center">
      <ol className="relative w-full max-w-[360px]">
        <span className="absolute top-6 bottom-6 left-[19px] w-px bg-white/10" />
        <motion.span
          className="absolute top-6 left-[19px] w-px origin-top bg-signal"
          style={{ height: "calc(100% - 48px)" }}
          animate={{ scaleY: Math.min(phase, 2) / 2 }}
          transition={{ duration: 0.6, ease }}
        />
        {steps.map((s, i) => {
          const done = phase > i;
          const current = phase === i;
          return (
            <li key={s.who} className="relative flex items-center gap-4 py-3">
              <span
                className={`relative z-10 grid size-10 shrink-0 place-items-center rounded-full border transition-all duration-500 ${
                  done ? "border-signal bg-signal text-forest" : current ? "border-signal bg-forest-800 text-signal" : "border-white/15 bg-forest-900 text-white/30"
                }`}
              >
                {done ? <Check className="size-3.5" /> : <span className="font-mono text-[11px]">0{i + 1}</span>}
                {current && <span className="animate-pulse-ring absolute inset-0 rounded-full bg-signal/30" />}
              </span>
              <div
                className={`flex-1 rounded-xl border px-4 py-3 transition-all duration-500 ${
                  done || current ? "border-white/15 bg-white/[0.05]" : "border-white/[0.06] bg-transparent opacity-50"
                }`}
              >
                <p className="font-mono text-[9.5px] tracking-[0.14em] text-signal uppercase">{s.who}</p>
                <p className="mt-0.5 text-[14px] text-white">{s.what}</p>
                <p className="text-[11.5px] text-white/45">{s.by}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

/* 04 — Reconciliation & visibility */
function LedgerArt({ active }: { active: boolean }) {
  const phase = useLoop(4, 1000, active);
  const rows = ["₹4,82,500", "₹1,26,000", "₹68,240"];
  const matched = Math.min(phase, 3);
  return (
    <div className="grid size-full place-items-center">
      <div className="w-full max-w-[400px]">
        <div className="grid grid-cols-[1fr_56px_1fr_24px] items-center gap-2 pb-2 font-mono text-[9.5px] tracking-[0.14em] text-white/40">
          <span>PAYMENT</span>
          <span />
          <span>LEDGER</span>
          <span />
        </div>
        {rows.map((r, i) => {
          const ok = i < matched;
          return (
            <div key={r} className="grid grid-cols-[1fr_56px_1fr_24px] items-center gap-2 border-t border-white/[0.08] py-3">
              <span className="tabular font-mono text-[13px] text-white">{r}</span>
              <svg viewBox="0 0 56 4" className="h-1 w-full" aria-hidden="true">
                <line x1="0" y1="2" x2="56" y2="2" stroke="rgba(255,255,255,0.15)" strokeDasharray="2 3" />
                <motion.line
                  x1="0"
                  y1="2"
                  x2="56"
                  y2="2"
                  stroke="#07F258"
                  strokeDasharray="2 3"
                  initial={false}
                  animate={{ pathLength: ok ? 1 : 0, opacity: ok ? 1 : 0 }}
                  transition={{ duration: 0.4 }}
                />
              </svg>
              <span className={`tabular font-mono text-[13px] transition-colors duration-300 ${ok ? "text-white" : "text-white/35"}`}>{ok ? r : "pending"}</span>
              <span
                className={`grid size-5 place-items-center rounded-full transition-all duration-300 ${
                  ok ? "scale-100 bg-signal text-forest" : "scale-75 border border-white/20 text-transparent"
                }`}
              >
                <Check className="size-2.5" />
              </span>
            </div>
          );
        })}
        <div className="mt-4 rounded-lg bg-signal/10 px-3 py-2.5 ring-1 ring-signal/30">
          <div className="flex items-center justify-between font-mono text-[10.5px] tracking-[0.1em] text-signal">
            <span>{matched} OF 3 MATCHED</span>
            <span>{Math.round((matched / 3) * 100)}%</span>
          </div>
          <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/10">
            <motion.div className="h-full bg-signal" animate={{ width: `${(matched / 3) * 100}%` }} transition={{ duration: 0.5, ease }} />
          </div>
        </div>
      </div>
    </div>
  );
}
