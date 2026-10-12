"use client";

import {
  animate,
  AnimatePresence,
  motion,
  useInView,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { useEffect, useRef, useState } from "react";
import { LogoMark } from "@/components/ui/Logo";
import { Check, ContactlessIcon } from "@/components/ui/icons";
import { usePhaseLoop, useStageScale } from "@/lib/useStageScale";

const W = 600;
const H = 560;
const STEP = 1700;
const ease = [0.16, 1, 0.3, 1] as const;

const banks = [
  { id: "01", rail: "NEFT", y: 128 },
  { id: "02", rail: "CARD", y: 222 },
  { id: "03", rail: "RTGS", y: 316 },
];
const routeOrder = [1, 0, 2];

export const heroSteps = ["Credit appears", "Card lifts", "Money routes", "Vendor paid"];

export function HeroVisual({ pointer }: { pointer: { x: MotionValue<number>; y: MotionValue<number> } }) {
  const reduce = useReducedMotion();
  const { ref, scale } = useStageScale<HTMLDivElement>(W);
  const inView = useInView(ref, { margin: "-10% 0px" });
  const loop = usePhaseLoop(4, STEP, inView && !reduce);
  const phase = reduce ? 3 : loop.phase;
  const cycle = loop.cycle;
  const bank = routeOrder[cycle % routeOrder.length];

  const rx = useSpring(useTransform(pointer.y, [-1, 1], [7, -7]), { stiffness: 80, damping: 20 });
  const ry = useSpring(useTransform(pointer.x, [-1, 1], [-9, 9]), { stiffness: 80, damping: 20 });
  const sheenX = useTransform(pointer.x, [-1, 1], ["20%", "80%"]);
  const sheenY = useTransform(pointer.y, [-1, 1], ["10%", "90%"]);
  const sheen = useMotionTemplate`radial-gradient(420px circle at ${sheenX} ${sheenY}, rgba(7,242,88,0.16), transparent 60%)`;

  return (
    <div>
    <div ref={ref} className="relative w-full" style={{ height: H * scale }}>
      <div className="absolute top-0 left-0 origin-top-left" style={{ width: W, height: H, transform: `scale(${scale})` }}>
        <div style={{ perspective: 1400 }} className="size-full">
          <motion.div
            className="relative size-full"
            style={{ rotateX: reduce ? 0 : rx, rotateY: reduce ? 0 : ry, transformStyle: "preserve-3d" }}
          >
            <Rails phase={phase} bank={bank} cycle={cycle} />

            {banks.map((b, i) => (
              <BankNode key={b.id} {...b} active={phase >= 2 && bank === i} />
            ))}

            <motion.div style={{ translateZ: 70 }} className="absolute top-[34px] left-[6px] w-[252px]">
              <FacilityPanel phase={phase} cycle={cycle} />
            </motion.div>

            <motion.div
              style={{ translateZ: 40 }}
              className="absolute top-[166px] left-[64px]"
              animate={phase >= 1 ? { y: -14, rotate: -5 } : { y: 0, rotate: -8 }}
              transition={{ duration: 1.1, ease }}
            >
              <OdccCard sheen={sheen} lifted={phase >= 1} />
            </motion.div>

            <AnimatePresence>
              {phase >= 2 && (
                <motion.div
                  key={`chip-${cycle}`}
                  initial={{ opacity: 0, scale: 0.85, y: 6 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, transition: { duration: 0.25 } }}
                  transition={{ duration: 0.5, ease, delay: 0.55 }}
                  style={{ translateZ: 60 }}
                  className="absolute top-[372px] left-[418px] flex items-center gap-2 rounded-lg border border-signal/40 bg-forest-900/90 px-3 py-2 font-mono text-[12px] text-white/90 backdrop-blur"
                >
                  <span className="size-1.5 rounded-full bg-signal shadow-[0_0_10px_#07F258]" />
                  Routed · Bank {banks[bank].id}
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div style={{ translateZ: 90 }} className="absolute top-[414px] left-[238px] w-[346px]">
              <VendorPanel phase={phase} cycle={cycle} />
            </motion.div>

            <FloatingChip className="top-[18px] left-[330px]" z={30} delay={0}>
              <span className="text-signal">●</span> Policy check · within limit
            </FloatingChip>
            <FloatingChip className="top-[470px] left-[0px]" z={50} delay={1.2}>
              <span className="text-white/50">VC</span> ·· 8812 issued · vendor-locked
            </FloatingChip>
          </motion.div>
        </div>
      </div>
    </div>
    <div className="mt-8 hidden sm:block">
      <StepIndicator phase={phase} />
    </div>
    </div>
  );
}

function Rails({ phase, bank, cycle }: { phase: number; bank: number; cycle: number }) {
  const origin = { x: 404, y: 262 };
  const path = (y: number) => `M${origin.x} ${origin.y} H444 V${y + 20} H474`;
  return (
    <svg className="pointer-events-none absolute inset-0" width={W} height={H} viewBox={`0 0 ${W} ${H}`} fill="none" aria-hidden="true">
      {banks.map((b) => (
        <path key={b.id} d={path(b.y)} stroke="rgba(255,255,255,0.14)" strokeWidth="1" strokeDasharray="3 4" />
      ))}
      {phase >= 2 && (
        <g key={`route-${cycle}`}>
          <motion.path
            d={path(banks[bank].y)}
            stroke="#07F258"
            strokeWidth="1.5"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.7, ease }}
          />
          <circle r="4" fill="#07F258">
            <animateMotion dur="1.1s" repeatCount="indefinite" path={path(banks[bank].y)} />
          </circle>
          <circle r="10" fill="#07F258" opacity="0.18">
            <animateMotion dur="1.1s" repeatCount="indefinite" path={path(banks[bank].y)} />
          </circle>
        </g>
      )}
      <circle cx={origin.x} cy={origin.y} r="3.5" fill={phase >= 2 ? "#07F258" : "rgba(255,255,255,0.4)"} />
      <circle cx="444" cy={banks[bank].y + 20} r="2.5" fill={phase >= 2 ? "#07F258" : "transparent"} />
    </svg>
  );
}

function BankNode({ id, rail, y, active }: { id: string; rail: string; y: number; active: boolean }) {
  return (
    <div
      className={`absolute left-[474px] flex h-10 w-[122px] items-center justify-between rounded-lg border px-3 font-mono text-[10.5px] tracking-[0.1em] whitespace-nowrap transition-all duration-500 ${
        active ? "border-signal/70 bg-forest-700 text-white shadow-[0_0_28px_-6px_rgba(7,242,88,0.6)]" : "border-white/12 bg-forest-900/70 text-white/55"
      }`}
      style={{ top: y }}
    >
      <span className="flex items-center gap-2">
        <span className={`size-1.5 rounded-full transition-colors ${active ? "bg-signal" : "bg-white/30"}`} />
        BANK {id}
      </span>
      <span className="text-[9px] text-white/35">{rail}</span>
    </div>
  );
}

function FacilityPanel({ phase, cycle }: { phase: number; cycle: number }) {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.55)] ring-1 ring-black/5">
      <div className="flex items-center justify-between">
        <p className="label !text-[9.5px] text-muted">OD/CC facility · linked</p>
        <span className="rounded-full bg-mint px-2 py-0.5 font-mono text-[9px] tracking-wider text-leaf">LIVE</span>
      </div>
      <p className="mt-2 flex items-baseline gap-1.5 text-ink">
        <span className="tabular text-[26px] font-medium tracking-[-0.03em]">₹2.40 Cr</span>
        <span className="text-[12px] text-muted">available</span>
      </p>
      <div className="mt-3 flex h-2 overflow-hidden rounded-full bg-paper-200">
        <div className="h-full w-[46%] bg-forest" />
        <motion.div
          key={cycle}
          className="h-full bg-signal"
          initial={{ width: "0%" }}
          animate={{ width: phase >= 0 ? "24%" : "0%" }}
          transition={{ duration: 1.2, ease, delay: 0.15 }}
        />
      </div>
      <div className="mt-2.5 flex items-center gap-3 text-[11px] whitespace-nowrap text-muted">
        <span className="flex items-center gap-1.5">
          <span className="size-2 rounded-[2px] bg-forest" /> Utilised
        </span>
        <span className="flex items-center gap-1.5">
          <span className="size-2 rounded-[2px] bg-signal" /> On card
        </span>
        <span className="ml-auto tabular font-mono text-[10px] text-ink">of ₹5 Cr</span>
      </div>
    </div>
  );
}

function OdccCard({ sheen, lifted }: { sheen: MotionValue<string>; lifted: boolean }) {
  return (
    <div
      className={`relative h-[208px] w-[336px] overflow-hidden rounded-[18px] border border-white/12 bg-[linear-gradient(135deg,#12452d_0%,#0a2c1c_45%,#051e12_100%)] p-5 transition-shadow duration-700 ${
        lifted ? "shadow-[0_40px_80px_-24px_rgba(0,0,0,0.75),0_0_60px_-18px_rgba(7,242,88,0.45)]" : "shadow-[0_24px_50px_-24px_rgba(0,0,0,0.6)]"
      }`}
    >
      <svg className="absolute -top-24 -right-24 size-[320px] animate-[spin_60s_linear_infinite] opacity-60" viewBox="0 0 320 320" fill="none" aria-hidden="true">
        {[150, 125, 100, 75, 50].map((r) => (
          <circle key={r} cx="160" cy="160" r={r} stroke="rgba(255,255,255,0.07)" strokeDasharray={r === 125 ? "2 6" : undefined} />
        ))}
      </svg>
      <motion.div className="pointer-events-none absolute inset-0" style={{ background: sheen }} />
      <div className="relative flex items-start justify-between">
        <LogoMark tone="dark" className="size-7" />
        <p className="label !text-[9.5px] text-white/55">ODCC · Commercial</p>
      </div>
      <div className="relative mt-6 flex items-center gap-3">
        <div className="h-[30px] w-[40px] rounded-md bg-[linear-gradient(135deg,#d8dccf,#9aa394)] p-[5px]">
          <div className="size-full rounded-[3px] border border-black/15" />
        </div>
        <ContactlessIcon className="size-5 text-white/60" />
      </div>
      <p className="relative mt-5 font-mono text-[17px] tracking-[0.16em] text-white/90">4021 •••• •••• 7730</p>
      <div className="relative mt-2 flex items-end justify-between">
        <p className="label !text-[9px] text-white/45">Linked to OD/CC limit</p>
        <p className="text-[17px] font-bold tracking-tight text-white italic">
          Ru<span className="text-signal">Pay</span>
        </p>
      </div>
    </div>
  );
}

const statusByPhase = [
  { label: "Raised", tone: "bg-paper-200 text-ink-soft" },
  { label: "Approval 1/2", tone: "bg-[#fbf0d9] text-amber" },
  { label: "Approved", tone: "bg-mint text-leaf" },
  { label: "Paid", tone: "bg-signal text-forest" },
];

function VendorPanel({ phase, cycle }: { phase: number; cycle: number }) {
  const s = statusByPhase[phase];
  return (
    <div
      className={`rounded-2xl bg-white p-4 shadow-[0_30px_70px_-24px_rgba(0,0,0,0.6)] ring-1 transition-[box-shadow] duration-500 ${
        phase === 3 ? "ring-signal/70" : "ring-black/5"
      }`}
    >
      <div className="flex items-center justify-between">
        <p className="label !text-[9.5px] text-muted">Versa · Vendor payment</p>
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={s.label}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.3 }}
            className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium ${s.tone}`}
          >
            {phase === 3 && <Check className="size-2.5" />}
            {s.label}
          </motion.span>
        </AnimatePresence>
      </div>
      <div className="mt-3 flex items-end justify-between">
        <div>
          <p className="text-[15px] font-medium tracking-[-0.01em] text-ink">Kaveri Logistics Pvt Ltd</p>
          <p className="mt-0.5 font-mono text-[11px] text-muted">Virtual card ·· 8812 · INV-2291</p>
        </div>
        <Amount cycle={cycle} />
      </div>
      <div className="mt-3.5 flex items-center gap-3 border-t border-paper-200 pt-3 text-[11.5px] text-muted">
        <div className="flex -space-x-1.5">
          <span className="grid size-5 place-items-center rounded-full bg-forest text-[8px] font-semibold text-white ring-2 ring-white">AM</span>
          <span className="grid size-5 place-items-center rounded-full bg-leaf text-[8px] font-semibold text-white ring-2 ring-white">RK</span>
        </div>
        <Tick on={phase >= 1}>Maker</Tick>
        <Tick on={phase >= 2}>Checker</Tick>
        <motion.span animate={{ opacity: phase >= 3 ? 1 : 0.35 }} className="ml-auto font-mono text-[10.5px] text-ink">
          Reconciled to ERP
        </motion.span>
      </div>
    </div>
  );
}

function Tick({ on, children }: { on: boolean; children: React.ReactNode }) {
  return (
    <span className={`flex items-center gap-1 transition-colors duration-300 ${on ? "text-ink" : ""}`}>
      {children}
      <span
        className={`grid size-3.5 place-items-center rounded-full transition-all duration-300 ${
          on ? "scale-100 bg-leaf text-white" : "scale-75 bg-paper-200 text-transparent"
        }`}
      >
        <Check className="size-2" />
      </span>
    </span>
  );
}

const inr = new Intl.NumberFormat("en-IN");

function Amount({ cycle }: { cycle: number }) {
  const [v, setV] = useState(482500);
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    const c = animate(0, 482500, { duration: 1.3, ease, onUpdate: (n) => setV(Math.round(n)) });
    return () => c.stop();
  }, [cycle]);
  return <p className="tabular text-[22px] font-medium tracking-[-0.03em] text-ink">₹{inr.format(v)}</p>;
}

function FloatingChip({ children, className, z, delay }: { children: React.ReactNode; className: string; z: number; delay: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      style={{ translateZ: z }}
      animate={reduce ? undefined : { y: [0, -7, 0] }}
      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay }}
      className={`absolute flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 font-mono text-[10.5px] tracking-wide whitespace-nowrap text-white/70 backdrop-blur-md ${className}`}
    >
      {children}
    </motion.div>
  );
}

/** Normalised pointer position (-1..1) over a region, used to drive the hero tilt. */
export function usePointer() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const onPointerMove = (e: React.PointerEvent<HTMLElement>) => {
    if (e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    x.set(((e.clientX - r.left) / r.width) * 2 - 1);
    y.set(((e.clientY - r.top) / r.height) * 2 - 1);
  };
  const onPointerLeave = () => {
    x.set(0);
    y.set(0);
  };
  return { x, y, handlers: { onPointerMove, onPointerLeave } };
}

export function StepIndicator({ phase }: { phase: number }) {
  return (
    <ol className="grid grid-cols-4 gap-3">
      {heroSteps.map((s, i) => (
        <li key={s} className="relative">
          <div className="h-px w-full bg-white/12">
            <motion.div className="h-px bg-signal" animate={{ width: i <= phase ? "100%" : "0%" }} transition={{ duration: i === phase ? STEP / 1000 : 0.3, ease: "linear" }} />
          </div>
          <p className={`label mt-2.5 !text-[10px] transition-colors ${i === phase ? "text-white" : "text-white/35"}`}>
            0{i + 1} · {s}
          </p>
        </li>
      ))}
    </ol>
  );
}
