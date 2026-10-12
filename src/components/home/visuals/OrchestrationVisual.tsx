"use client";

import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { LogoMark } from "@/components/ui/Logo";
import { usePhaseLoop, useStageScale } from "@/lib/useStageScale";

const W = 640;
const H = 340;
const NODE_W = 156;
const NODE_H = 44;
const rowsY = [36, 112, 188, 264];
const CENTER = { x: 218, y: 95, w: 204, h: 150 };
const MID_Y = CENTER.y + CENTER.h / 2;

const enterprise = [
  { name: "ERP", meta: "SAP" },
  { name: "Treasury", meta: "TMS" },
  { name: "Procure-to-pay", meta: "P2P" },
  { name: "Your app", meta: "API" },
];
const ecosystem = [
  { name: "Bank 01", meta: "NEFT" },
  { name: "Bank 02", meta: "CARD" },
  { name: "Card networks", meta: "RUPAY" },
  { name: "Providers", meta: "PSP" },
];

const rules = [
  { from: 0, to: 1, lines: ["IF vendor_pay > ₹1L", "→ route: Bank 02", "  · virtual card", "→ reconcile: ERP"] },
  { from: 3, to: 2, lines: ["IF spend.type = travel", "→ route: ODCC card", "  · network: RuPay", "→ limit: ₹8L / mo"] },
  { from: 2, to: 0, lines: ["IF payout ≤ ₹2L", "→ route: Bank 01", "  · rail: NEFT", "→ settle: same day"] },
];

const BUS_L = 188;
const BUS_R = 452;
const leftPath = (i: number) => `M${NODE_W} ${rowsY[i] + NODE_H / 2} H${BUS_L} V${MID_Y} H${CENTER.x}`;
const rightPath = (j: number) => `M${CENTER.x + CENTER.w} ${MID_Y} H${BUS_R} V${rowsY[j] + NODE_H / 2} H${W - NODE_W}`;
const fullPath = (i: number, j: number) =>
  `M${NODE_W} ${rowsY[i] + NODE_H / 2} H${BUS_L} V${MID_Y} H${CENTER.x + CENTER.w} H${BUS_R} V${rowsY[j] + NODE_H / 2} H${W - NODE_W}`;

export function OrchestrationVisual() {
  const reduce = useReducedMotion();
  const { ref, scale } = useStageScale<HTMLDivElement>(W);
  const inView = useInView(ref, { margin: "-10% 0px" });
  const { phase } = usePhaseLoop(rules.length, 3200, inView && !reduce);
  const rule = rules[phase];

  return (
    <div ref={ref} className="relative w-full" style={{ height: H * scale + 40 * scale }}>
      <div className="absolute top-0 left-0 origin-top-left" style={{ width: W, height: H + 40, transform: `scale(${scale})` }}>
        <div className="label mb-3 flex justify-between !text-[10px] text-white/40">
          <span>Enterprise</span>
          <span>Ecosystem</span>
        </div>
        <div className="relative" style={{ width: W, height: H }}>
          <svg className="absolute inset-0" width={W} height={H} viewBox={`0 0 ${W} ${H}`} fill="none" aria-hidden="true">
            {rowsY.map((_, i) => (
              <path key={`l${i}`} d={leftPath(i)} stroke="rgba(255,255,255,0.12)" />
            ))}
            {rowsY.map((_, j) => (
              <path key={`r${j}`} d={rightPath(j)} stroke="rgba(255,255,255,0.12)" />
            ))}
            <AnimatePresence>
              <motion.g key={phase} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
                <motion.path
                  d={leftPath(rule.from)}
                  stroke="#07F258"
                  strokeWidth="1.5"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.6 }}
                />
                <motion.path
                  d={rightPath(rule.to)}
                  stroke="#07F258"
                  strokeWidth="1.5"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                />
                {!reduce && (
                  <>
                    <circle r="4" fill="#07F258">
                      <animateMotion dur="1.6s" repeatCount="indefinite" path={fullPath(rule.from, rule.to)} />
                    </circle>
                    <circle r="11" fill="#07F258" opacity="0.15">
                      <animateMotion dur="1.6s" repeatCount="indefinite" path={fullPath(rule.from, rule.to)} />
                    </circle>
                  </>
                )}
              </motion.g>
            </AnimatePresence>
          </svg>

          {enterprise.map((n, i) => (
            <Node key={n.name} {...n} x={0} y={rowsY[i]} active={rule.from === i} />
          ))}
          {ecosystem.map((n, j) => (
            <Node key={n.name} {...n} x={W - NODE_W} y={rowsY[j]} active={rule.to === j} />
          ))}

          <div
            className="absolute rounded-2xl bg-signal p-3.5 text-forest shadow-[0_0_60px_-10px_rgba(7,242,88,0.55)]"
            style={{ left: CENTER.x, top: CENTER.y, width: CENTER.w, height: CENTER.h }}
          >
            <p className="flex items-center gap-2 text-[13px] font-semibold">
              <LogoMark className="size-5" />
              PropelGo layer
            </p>
            <div className="mt-2.5 h-[88px] overflow-hidden rounded-lg bg-forest/90 p-2.5 font-mono text-[10.5px] leading-[1.55] text-signal">
              <TypedRule key={phase} lines={rule.lines} instant={Boolean(reduce)} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Node({ name, meta, x, y, active }: { name: string; meta: string; x: number; y: number; active: boolean }) {
  return (
    <div
      className={`absolute flex items-center justify-between gap-2 rounded-lg border px-3 text-[13px] whitespace-nowrap transition-all duration-500 ${
        active ? "border-signal/70 bg-forest-700 text-white shadow-[0_0_24px_-6px_rgba(7,242,88,0.5)]" : "border-white/10 bg-white/[0.03] text-white/70"
      }`}
      style={{ left: x, top: y, width: NODE_W, height: NODE_H }}
    >
      <span>{name}</span>
      <span className={`font-mono text-[9.5px] tracking-wider ${active ? "text-signal" : "text-white/35"}`}>{meta}</span>
    </div>
  );
}

function TypedRule({ lines, instant }: { lines: string[]; instant: boolean }) {
  const full = lines.join("\n");
  const [n, setN] = useState(instant ? full.length : 0);
  useEffect(() => {
    if (instant) return;
    const id = setInterval(() => setN((v) => (v >= full.length ? v : v + 1)), 22);
    return () => clearInterval(id);
  }, [full, instant]);
  return (
    <pre className="font-mono whitespace-pre">
      {full.slice(0, n)}
      <span className="ml-px inline-block h-[11px] w-[6px] translate-y-[1px] animate-pulse bg-signal" />
    </pre>
  );
}
