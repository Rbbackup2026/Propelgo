"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Scales a fixed-size design stage to fit its container width, so intricate
 * product visuals keep their full composition from desktop down to mobile.
 */
export function useStageScale<T extends HTMLElement>(stageWidth: number, max = 1) {
  const ref = useRef<T>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const scale = width ? Math.min(max, width / stageWidth) : 1;
  return { ref, scale, width };
}

/** Advances a looping phase index while `active` is true. */
export function usePhaseLoop(phases: number, stepMs: number, active: boolean) {
  const [state, setState] = useState({ phase: 0, cycle: 0 });

  useEffect(() => {
    if (!active) return;
    const id = setInterval(() => {
      setState((s) => (s.phase + 1 >= phases ? { phase: 0, cycle: s.cycle + 1 } : { phase: s.phase + 1, cycle: s.cycle }));
    }, stepMs);
    return () => clearInterval(id);
  }, [phases, stepMs, active]);

  return state;
}
