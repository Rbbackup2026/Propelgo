"use client";

import { animate, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";

const inr = new Intl.NumberFormat("en-IN");

/** Counts up once when scrolled into view, using Indian digit grouping. */
export function Counter({
  value,
  prefix = "",
  suffix = "",
  duration = 1.8,
  className = "",
  suffixClassName = "",
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
  suffixClassName?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView || reduce) return;
    const controls = animate(0, value, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, value, duration, reduce]);

  return (
    <span ref={ref} className={`tabular ${className}`}>
      {prefix}
      {inr.format(reduce ? value : display)}
      <span className={suffixClassName}>{suffix}</span>
    </span>
  );
}
