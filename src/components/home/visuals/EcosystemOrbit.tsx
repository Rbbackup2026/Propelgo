"use client";

import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { overview } from "@/content/home";
import { LogoMark } from "@/components/ui/Logo";
import { useStageScale } from "@/lib/useStageScale";

const SIZE = 520;
const C = SIZE / 2;
const R = 196;
const ease = [0.16, 1, 0.3, 1] as const;

const nodes = overview.nodes.map((n, i) => {
  const a = ((-90 + i * 60) * Math.PI) / 180;
  return { ...n, x: C + Math.cos(a) * R, y: C + Math.sin(a) * R };
});

export function EcosystemOrbit() {
  const { ref, scale } = useStageScale<HTMLDivElement>(SIZE);
  const inView = useInView(ref, { margin: "-15% 0px" });
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const [hold, setHold] = useState(false);

  useEffect(() => {
    if (!inView || hold || reduce) return;
    const t = setInterval(() => setActive((a) => (a + 1) % nodes.length), 2800);
    return () => clearInterval(t);
  }, [inView, hold, reduce]);

  // On narrow screens the stage shrinks, so labels are set larger to stay legible.
  const compact = scale < 0.8;
  const n = nodes[active];
  // Spoke stops at the edge of the centre disc.
  const dx = n.x - C;
  const dy = n.y - C;
  const len = Math.hypot(dx, dy);
  const sx = C + (dx / len) * 98;
  const sy = C + (dy / len) * 98;

  return (
    <div className="mx-auto w-full max-w-[520px]">
      <div ref={ref} className="relative w-full" style={{ height: SIZE * scale }}>
        <div className="absolute top-0 left-0 origin-top-left" style={{ width: SIZE, height: SIZE, transform: `scale(${scale})` }}>
          <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="absolute inset-0" fill="none" aria-hidden="true">
            <circle cx={C} cy={C} r={R} stroke="#E8E8E8" />
            <circle cx={C} cy={C} r={R - 58} stroke="#E8E8E8" strokeDasharray="2 6" />
            <motion.circle
              cx={C}
              cy={C}
              r={R}
              stroke="#95DE64"
              strokeWidth="2"
              strokeLinecap="round"
              initial={reduce ? false : { pathLength: 0 }}
              animate={inView ? { pathLength: 1 } : undefined}
              transition={{ duration: 1.8, ease }}
              style={{ rotate: -90, transformOrigin: "center" }}
              opacity={0.5}
            />
            <motion.line
              key={active}
              x1={sx}
              y1={sy}
              x2={n.x}
              y2={n.y}
              stroke="#017649"
              strokeWidth="1.5"
              initial={reduce ? false : { pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.6, ease }}
            />
          </svg>

          <div
            className="absolute grid size-[196px] place-items-center rounded-full bg-white text-center shadow-[0_20px_50px_-24px_rgba(6,38,23,0.3)] ring-1 ring-line"
            style={{ left: C - 98, top: C - 98 }}
          >
            <div className="px-6">
              <LogoMark className="mx-auto size-8" />
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={active}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.3 }}
                >
                  <p className={`mt-3 font-semibold tracking-[-0.01em] text-ink ${compact ? "text-[22px] leading-tight" : "text-[16px]"}`}>
                    {n.verb} <span className="text-brand">{n.noun.toLowerCase()}</span>
                  </p>
                  {!compact && <p className="mt-1 text-[12px] leading-snug text-copy">{n.line}</p>}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {nodes.map((node, i) => {
            const on = i === active;
            return (
              <button
                key={node.noun}
                type="button"
                onMouseEnter={() => {
                  setHold(true);
                  setActive(i);
                }}
                onMouseLeave={() => setHold(false)}
                onFocus={() => setActive(i)}
                onClick={() => {
                  setHold(true);
                  setActive(i);
                }}
                aria-pressed={on}
                className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full font-medium whitespace-nowrap transition-[background-color,color,box-shadow] duration-300 ${
                  compact ? "px-5 py-2.5 text-[19px]" : "px-4 py-2 text-[14px]"
                } ${on ? "bg-brand text-white shadow-[0_10px_24px_-10px_rgba(1,118,73,0.6)]" : "bg-white text-ink ring-1 ring-line hover:ring-ghost"}`}
                style={{ left: node.x, top: node.y }}
              >
                {node.noun}
              </button>
            );
          })}
        </div>
      </div>
      {compact && (
        <p aria-live="polite" className="mt-4 min-h-[3em] text-center text-[15px] leading-relaxed text-copy">
          {n.line}
        </p>
      )}
    </div>
  );
}
