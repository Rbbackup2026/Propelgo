"use client";

import { motion, useReducedMotion, type HTMLMotionProps } from "motion/react";
import type { ReactNode } from "react";

const ease = [0.16, 1, 0.3, 1] as const;

type RevealProps = {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: "div" | "section" | "li" | "article";
} & Omit<HTMLMotionProps<"div">, "children">;

/** Fade-and-rise once the element scrolls into view. */
export function Reveal({ children, delay = 0, y = 28, className, as = "div", ...rest }: RevealProps) {
  const reduce = useReducedMotion();
  const Comp = motion[as] as typeof motion.div;
  return (
    <Comp
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 0.9, ease, delay }}
      className={className}
      {...rest}
    >
      {children}
    </Comp>
  );
}

/** Headline that rises line by line from behind a mask. */
export function MaskLines({
  lines,
  className = "",
  lineClassName = "",
  delay = 0,
  stagger = 0.09,
  inView = true,
  render,
}: {
  lines: string[];
  className?: string;
  lineClassName?: string;
  delay?: number;
  stagger?: number;
  inView?: boolean;
  render?: (line: string, i: number) => ReactNode;
}) {
  const reduce = useReducedMotion();
  // The trigger lives on the wrapper: each line starts clipped by its mask, so it can't observe itself.
  const trigger = inView
    ? { whileInView: "show", viewport: { once: true, margin: "0px 0px -10% 0px" } }
    : { animate: "show" };
  return (
    <motion.span className={`block ${className}`} initial={reduce ? false : "hidden"} {...trigger}>
      {lines.map((line, i) => (
        <span key={line + i} className="-mb-[0.08em] block overflow-hidden pb-[0.08em]">
          <motion.span
            className={`block ${lineClassName}`}
            variants={{ hidden: { y: "105%" }, show: { y: "0%" } }}
            transition={{ duration: 1.05, ease, delay: delay + i * stagger }}
          >
            {render ? render(line, i) : line}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}

export function Eyebrow({ children, tone = "light", className = "" }: { children: ReactNode; tone?: "light" | "dark"; className?: string }) {
  return (
    <p className={`label flex items-center gap-3 ${tone === "dark" ? "text-signal" : "text-leaf"} ${className}`}>
      <span className={`h-px w-6 ${tone === "dark" ? "bg-signal/70" : "bg-leaf/70"}`} />
      {children}
    </p>
  );
}
