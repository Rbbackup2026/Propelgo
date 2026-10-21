"use client";

import { motion } from "motion/react";
import type { ProductKey } from "@/content/home";
import { RealIcon } from "@/components/ui/RealIcon";

export const PRODUCT_ACCENT: Record<ProductKey, { main: string; light: string; tint: string; glow: string }> = {
  versa: { main: "#017649", light: "#2fc47f", tint: "#e3f8d6", glow: "rgba(1,118,73,0.45)" },
  odcc: { main: "#5b57d9", light: "#8f8bf2", tint: "#e9e8fd", glow: "rgba(91,87,217,0.45)" },
  orchestration: { main: "#0e8ba3", light: "#4fc6d8", tint: "#d9f3f7", glow: "rgba(14,139,163,0.45)" },
};

const spring = { type: "spring", bounce: 0.35, visualDuration: 0.45 } as const;

/** Tinted app-style tile holding the product's 3D icon; it tilts and lifts on hover. */
export function ProductIcon({ kind, active, className = "size-12" }: { kind: ProductKey; active: boolean; className?: string }) {
  const a = PRODUCT_ACCENT[kind];
  return (
    <motion.span
      className={`relative grid shrink-0 place-items-center rounded-2xl ${className}`}
      style={{
        background: `linear-gradient(145deg, #ffffff 0%, ${a.tint} 100%)`,
        boxShadow: `0 10px 22px -12px ${a.glow}, inset 0 0 0 1px rgba(255,255,255,0.9)`,
      }}
      animate={{ rotate: active ? -6 : 0, scale: active ? 1.08 : 1 }}
      transition={spring}
    >
      <motion.span className="grid size-[78%] place-items-center" animate={{ y: active ? -2 : 0 }} transition={spring}>
        <RealIcon name={kind} className="size-full" />
      </motion.span>
    </motion.span>
  );
}
