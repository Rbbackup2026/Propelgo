"use client";

import Link from "next/link";
import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import { useRef, type ReactNode } from "react";
import { ArrowUpRight } from "./icons";

type Variant = "signal" | "ink" | "ghost-dark" | "ghost-light";

const styles: Record<Variant, { base: string; knob: string }> = {
  signal: {
    base: "bg-signal text-forest hover:bg-[#2bff74] shadow-[0_0_0_1px_rgba(7,242,88,0.4),0_10px_40px_-12px_rgba(7,242,88,0.55)]",
    knob: "bg-forest text-signal",
  },
  ink: {
    base: "bg-forest text-white hover:bg-forest-700",
    knob: "bg-signal text-forest",
  },
  "ghost-dark": {
    base: "text-white ring-1 ring-inset ring-white/20 hover:ring-white/45 hover:bg-white/[0.04]",
    knob: "",
  },
  "ghost-light": {
    base: "text-ink ring-1 ring-inset ring-ink/15 hover:ring-ink/40 bg-white/40",
    knob: "",
  },
};

type Props = {
  href: string;
  children: ReactNode;
  variant?: Variant;
  size?: "sm" | "md" | "lg";
  magnetic?: boolean;
  className?: string;
};

export function Button({ href, children, variant = "signal", size = "md", magnetic = true, className = "" }: Props) {
  const ref = useRef<HTMLAnchorElement>(null);
  const reduce = useReducedMotion();
  const x = useSpring(useMotionValue(0), { stiffness: 220, damping: 18, mass: 0.4 });
  const y = useSpring(useMotionValue(0), { stiffness: 220, damping: 18, mass: 0.4 });

  const onMove = (e: React.PointerEvent) => {
    if (!magnetic || reduce || e.pointerType !== "mouse" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * 0.22);
    y.set((e.clientY - (r.top + r.height / 2)) * 0.3);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };

  const s = styles[variant];
  const hasKnob = Boolean(s.knob);
  const pad = { sm: "h-10 text-[13px]", md: "h-12 text-sm", lg: "h-14 text-[15px]" }[size];
  const padX = hasKnob
    ? { sm: "pl-4 pr-1", md: "pl-5 pr-1.5", lg: "pl-6 pr-1.5" }[size]
    : { sm: "px-4", md: "px-6", lg: "px-7" }[size];
  const knobSize = { sm: "size-8", md: "size-9", lg: "size-11" }[size];

  return (
    <motion.span style={{ x, y }} className="inline-flex" onPointerMove={onMove} onPointerLeave={reset}>
      <Link
        ref={ref}
        href={href}
        className={`group relative inline-flex items-center gap-3 rounded-full font-medium tracking-[-0.01em] transition-[background-color,box-shadow,color] duration-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-signal ${pad} ${padX} ${s.base} ${className}`}
      >
        <span>{children}</span>
        {hasKnob && (
          <span className={`relative grid ${knobSize} place-items-center overflow-hidden rounded-full ${s.knob}`}>
            <ArrowUpRight className="size-3.5 transition-transform duration-500 ease-out-expo group-hover:-translate-y-[150%] group-hover:translate-x-[150%]" />
            <ArrowUpRight className="absolute size-3.5 -translate-x-[150%] translate-y-[150%] transition-transform duration-500 ease-out-expo group-hover:translate-x-0 group-hover:translate-y-0" />
          </span>
        )}
      </Link>
    </motion.span>
  );
}

/** Underlined text link with the propel arrow. */
export function TextLink({
  href,
  children,
  tone = "light",
  className = "",
}: {
  href: string;
  children: ReactNode;
  tone?: "light" | "dark";
  className?: string;
}) {
  const color = tone === "dark" ? "text-white after:bg-white/30 hover:after:bg-signal" : "text-ink after:bg-ink/25 hover:after:bg-leaf";
  return (
    <Link
      href={href}
      className={`group relative inline-flex items-center gap-1.5 pb-1 text-[15px] font-medium after:absolute after:inset-x-0 after:bottom-0 after:h-px after:transition-colors ${color} ${className}`}
    >
      {children}
      <ArrowUpRight className="size-3.5 transition-transform duration-300 ease-out-expo group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
    </Link>
  );
}
