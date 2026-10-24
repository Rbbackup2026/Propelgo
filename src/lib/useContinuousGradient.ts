"use client";

import { useLayoutEffect, useRef } from "react";

export const BRAND_GRADIENT = "linear-gradient(90deg,#017649 0%,#03a35f 45%,#5fbf3f 100%)";

/**
 * Stretches one gradient across every `[data-gradient-word]` inside the returned ref, in reading order,
 * so a phrase split into separately animated words (or wrapped over lines) still reads as a single sweep.
 * Uses offsetWidth, which ignores transforms, so entrance animations don't skew the measurement.
 */
export function useContinuousGradient<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useLayoutEffect(() => {
    const root = ref.current;
    if (!root) return;

    const layout = () => {
      const words = Array.from(root.querySelectorAll<HTMLElement>("[data-gradient-word]"));
      const widths = words.map((w) => w.offsetWidth);
      const total = widths.reduce((a, b) => a + b, 0);
      let x = 0;
      words.forEach((w, i) => {
        w.style.backgroundImage = BRAND_GRADIENT;
        w.style.backgroundSize = `${total}px 100%`;
        w.style.backgroundPosition = `${-x}px 0`;
        x += widths[i];
      });
    };

    layout();
    document.fonts?.ready.then(layout);
    const ro = new ResizeObserver(layout);
    ro.observe(root);
    return () => ro.disconnect();
  }, []);

  return ref;
}
