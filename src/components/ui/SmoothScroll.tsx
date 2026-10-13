"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/** Lenis smooth scrolling for mouse and trackpad users. */
export function SmoothScroll() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    if (reduce || coarse) return;

    const lenis = new Lenis({ lerp: 0.12, autoRaf: true, anchors: { offset: -72 } });
    return () => lenis.destroy();
  }, []);

  return null;
}
