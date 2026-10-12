"use client";

import { motion, useReducedMotion } from "motion/react";

const fills = [0.62, 0.84, 0.74, 0.55];

export function StatBar({ index }: { index: number }) {
  const reduce = useReducedMotion();
  return (
    <div className="mt-6 h-[3px] w-full max-w-[200px] overflow-hidden rounded-full bg-paper-300">
      <motion.div
        className="h-full rounded-full bg-leaf"
        initial={reduce ? false : { width: "0%" }}
        whileInView={{ width: `${fills[index % fills.length] * 100}%` }}
        viewport={{ once: true }}
        transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1], delay: 0.2 + index * 0.08 }}
      />
    </div>
  );
}
