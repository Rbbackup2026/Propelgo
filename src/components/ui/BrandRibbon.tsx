"use client";

import { motion, useReducedMotion } from "motion/react";
import { useId } from "react";

const ease = [0.16, 1, 0.3, 1] as const;

export type RibbonVariant = "twist" | "wave" | "fan" | "loop";
export const RIBBON_VARIANTS: RibbonVariant[] = ["twist", "wave", "fan", "loop"];

const f = (n: number) => n.toFixed(1);
const range = (count: number) => Array.from({ length: count }, (_, k) => k / (count - 1));

/** Each variant is a bundle of strands in its own coordinate space; fixed numbers so server and client match. */
const SHAPES: Record<RibbonVariant, { box: [number, number]; grad: [number, number, number, number]; paths: string[] }> = {
  /** Strands cross over mid-way, which reads as a single twisted ribbon falling down the left edge. */
  twist: {
    box: [400, 900],
    grad: [0, 0, 300, 900],
    paths: range(34).map((t) => {
      const x0 = -40 + t * 220;
      const x1 = 300 - t * 230;
      return `M ${f(x0)} -40 C ${f(x0 + 260)} 260, ${f(x1 - 220)} 560, ${f(x1)} 940`;
    }),
  },
  /** A horizontal silk wave entering from the left and easing out under the headline. */
  wave: {
    box: [800, 700],
    grad: [0, 0, 800, 0],
    paths: range(30).map((t) => {
      const y0 = 260 + t * 90;
      const y1 = 520 - t * 150;
      return `M -40 ${f(y0)} C 180 ${f(y0 - 260 + t * 120)}, 420 ${f(y1 + 240 - t * 80)}, 840 ${f(y1)}`;
    }),
  },
  /** Strands sweep out of the bottom-left corner like a propeller blade. */
  fan: {
    box: [500, 900],
    grad: [0, 900, 500, 0],
    paths: range(32).map((t) => {
      const ex = -20 + t * 520;
      const ey = -40 + t * t * 380;
      return `M ${f(-30 + t * 40)} 940 C ${f(40 + t * 60)} ${f(520 - t * 120)}, ${f(ex * 0.35)} ${f(ey + 120)}, ${f(ex)} ${f(ey)}`;
    }),
  },
  /** One ribbon that curls back on itself in a loop before leaving the bottom. */
  loop: {
    box: [500, 900],
    grad: [0, 0, 500, 900],
    paths: range(28).map((t) => {
      const x = -20 + t * 110;
      return `M ${f(x)} -40 C ${f(x + 560)} ${f(380 + t * 40)}, ${f(x - 380)} ${f(420 - t * 30)}, ${f(x + 200)} 940`;
    }),
  },
};

/** PropelGo's line ribbon: a bundle of thin brand-gradient strands that draws in once, then sways slowly. */
export function BrandRibbon({ variant = "twist", play = true, className = "" }: { variant?: RibbonVariant; play?: boolean; className?: string }) {
  const reduce = useReducedMotion();
  const id = `ribbon${useId().replace(/[^\w-]/g, "")}`;
  const { box, grad, paths } = SHAPES[variant];
  return (
    <svg viewBox={`0 0 ${box[0]} ${box[1]}`} preserveAspectRatio="none" className={`pointer-events-none ${className}`} fill="none" aria-hidden="true">
      <defs>
        <linearGradient id={id} x1={grad[0]} y1={grad[1]} x2={grad[2]} y2={grad[3]} gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#95de64" />
          <stop offset="40%" stopColor="#03a35f" />
          <stop offset="75%" stopColor="#017649" />
          <stop offset="100%" stopColor="#0e8ba3" />
        </linearGradient>
      </defs>
      <motion.g
        key={variant}
        animate={reduce || !play ? undefined : { x: [0, 14, 0], skewY: [0, 1.5, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 2.4 }}
      >
        {paths.map((d, i) => (
          <motion.path
            key={i}
            d={d}
            stroke={`url(#${id})`}
            strokeOpacity={0.16 + 0.18 * Math.sin((i / (paths.length - 1)) * Math.PI)}
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
            initial={reduce ? false : { pathLength: 0 }}
            animate={play ? { pathLength: 1 } : undefined}
            transition={{ duration: 1.8, ease, delay: 0.3 + i * 0.025 }}
          />
        ))}
      </motion.g>
    </svg>
  );
}
