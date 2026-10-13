"use client";

import { motion, useReducedMotion } from "motion/react";
import { useState, type ReactNode } from "react";

type FaceProps = { flip: () => void; hover: boolean };

/** Click-to-flip card. Each face receives a `flip` toggle; the hidden face is inert. */
export function FlipCard({
  front,
  back,
  frontClassName = "",
  backClassName = "",
  className = "h-[520px]",
  delay = 0,
}: {
  front: (p: FaceProps) => ReactNode;
  back: (p: FaceProps) => ReactNode;
  frontClassName?: string;
  backClassName?: string;
  className?: string;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  const [flipped, setFlipped] = useState(false);
  const [hover, setHover] = useState(false);
  const flip = () => setFlipped((f) => !f);

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay }}
      className={`relative [perspective:1600px] ${className}`}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <motion.div
        className="preserve-3d relative size-full"
        initial={false}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 70, damping: 15, mass: 0.9 }}
      >
        <div inert={flipped} className={`backface-hidden absolute inset-0 overflow-hidden ${frontClassName}`}>
          {front({ flip, hover: hover && !flipped })}
        </div>
        <div inert={!flipped} className={`backface-hidden absolute inset-0 overflow-hidden [transform:rotateY(180deg)] ${backClassName}`}>
          {back({ flip, hover: hover && flipped })}
        </div>
      </motion.div>
    </motion.div>
  );
}

export function FlipIcon({ className = "size-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={className} aria-hidden="true">
      <path d="M2.5 6.5A5.5 5.5 0 0 1 12.6 4.4M13.5 9.5a5.5 5.5 0 0 1-10.1 2.1" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M12.9 1.8v2.9H10M3.1 14.2v-2.9H6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
