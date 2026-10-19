"use client";

import { motion } from "motion/react";
import type { ProductKey } from "@/content/home";

export const PRODUCT_ACCENT: Record<ProductKey, { main: string; light: string; tint: string; glow: string }> = {
  versa: { main: "#017649", light: "#2fc47f", tint: "#e3f8d6", glow: "rgba(1,118,73,0.45)" },
  odcc: { main: "#5b57d9", light: "#8f8bf2", tint: "#e9e8fd", glow: "rgba(91,87,217,0.45)" },
  orchestration: { main: "#0e8ba3", light: "#4fc6d8", tint: "#d9f3f7", glow: "rgba(14,139,163,0.45)" },
};

const spring = { type: "spring", bounce: 0.35, visualDuration: 0.45 } as const;

/** Gradient app-style tile with a duotone glyph; the glyph acts out its product on hover. */
export function ProductIcon({ kind, active, className = "size-12" }: { kind: ProductKey; active: boolean; className?: string }) {
  const a = PRODUCT_ACCENT[kind];
  return (
    <motion.span
      className={`relative grid shrink-0 place-items-center overflow-hidden rounded-2xl ${className}`}
      style={{
        background: `linear-gradient(145deg, ${a.light} 0%, ${a.main} 70%)`,
        boxShadow: `0 10px 22px -10px ${a.glow}, inset 0 1px 0 rgba(255,255,255,0.35)`,
      }}
      animate={{ rotate: active ? -6 : 0, scale: active ? 1.08 : 1 }}
      transition={spring}
    >
      <span className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/25 to-transparent" />
      <svg viewBox="0 0 24 24" fill="none" className="relative size-[58%]" aria-hidden="true">
        {kind === "versa" && <Versa active={active} />}
        {kind === "odcc" && <Odcc active={active} />}
        {kind === "orchestration" && <Orchestration active={active} />}
      </svg>
    </motion.span>
  );
}

/** An invoice that a card slides over to settle. */
function Versa({ active }: { active: boolean }) {
  return (
    <>
      <path d="M5 3.5h9l4 4V20a.5.5 0 0 1-.5.5h-12A.5.5 0 0 1 5 20V4a.5.5 0 0 1 .5-.5Z" fill="#fff" fillOpacity=".22" stroke="#fff" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M8 9h5M8 12h6" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
      <motion.g initial={false} animate={{ x: active ? -2 : 0, y: active ? -2 : 0 }} transition={spring}>
        <rect x="10.5" y="14" width="11" height="7" rx="1.6" fill="#fff" />
        <path d="M10.5 16.4h11" stroke="currentColor" strokeWidth="1.2" className="text-black/25" />
        <motion.path
          d="m13 19 1.2 1.1 2.3-2.3"
          stroke="#017649"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={false}
          animate={{ pathLength: active ? 1 : 0, opacity: active ? 1 : 0 }}
          transition={{ duration: 0.35, delay: active ? 0.15 : 0 }}
        />
      </motion.g>
    </>
  );
}

/** A card drawing on a credit limit gauge. */
function Odcc({ active }: { active: boolean }) {
  return (
    <>
      <path d="M4 10.5a8 8 0 0 1 16 0" stroke="#fff" strokeOpacity=".35" strokeWidth="2" strokeLinecap="round" />
      <motion.path
        d="M4 10.5a8 8 0 0 1 16 0"
        stroke="#fff"
        strokeWidth="2"
        strokeLinecap="round"
        initial={false}
        animate={{ pathLength: active ? 0.85 : 0.5 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      />
      <rect x="4" y="12.5" width="16" height="9" rx="2" fill="#fff" fillOpacity=".22" stroke="#fff" strokeWidth="1.5" />
      <rect x="6.5" y="15" width="3.5" height="2.6" rx=".6" fill="#fff" />
      <path d="M6.5 19.4h7" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" />
    </>
  );
}

/** One input fanning out to three routes, nodes lighting in turn. */
function Orchestration({ active }: { active: boolean }) {
  const outs = [5.5, 12, 18.5];
  return (
    <>
      <path d="M3 12h5" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
      {outs.map((y) => (
        <path key={y} d={`M14 12c3 0 2.5 ${y - 12} 5 ${y - 12}`} stroke="#fff" strokeOpacity=".8" strokeWidth="1.5" strokeLinecap="round" />
      ))}
      <rect x="8" y="8.5" width="6" height="7" rx="1.8" fill="#fff" />
      {outs.map((y, i) => (
        <motion.circle
          key={y}
          cx="20"
          cy={y}
          r="1.9"
          fill="#fff"
          initial={false}
          animate={{ scale: active ? [1, 1.45, 1] : 1, opacity: active ? 1 : 0.85 }}
          transition={{ duration: 0.5, delay: active ? i * 0.12 : 0 }}
          style={{ transformOrigin: `20px ${y}px` }}
        />
      ))}
    </>
  );
}
