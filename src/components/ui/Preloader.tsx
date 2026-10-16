"use client";

import { AnimatePresence, animate, motion, useMotionValue, useReducedMotion, useTransform } from "motion/react";
import { useEffect, useState } from "react";
import { LOGO_GREEN, LOGO_MARK, LOGO_WORD } from "./Logo";
import { markPreloaderDone } from "@/lib/preloader";

const ease = [0.16, 1, 0.3, 1] as const;
const curtain = [0.76, 0, 0.24, 1] as const;
const COUNT_S = 2.6;
const HOLD_MS = 350;
const MARK = 92;

/** Brand intro: the mark draws itself, the wordmark unfolds, then two curtains lift off the page. */
export function Preloader() {
  const reduce = useReducedMotion();
  const [visible, setVisible] = useState(true);
  const progress = useMotionValue(0);
  const pct = useTransform(() => String(Math.round(progress.get())).padStart(3, "0"));
  const bar = useTransform(() => progress.get() / 100);

  useEffect(() => {
    const root = document.documentElement;
    root.style.overflow = "hidden";
    let cancelled = false;
    const count = animate(progress, 100, { duration: reduce ? 0.4 : COUNT_S, ease: [0.65, 0, 0.35, 1] });
    Promise.all([count, document.fonts?.ready])
      .then(() => new Promise((r) => setTimeout(r, reduce ? 0 : HOLD_MS)))
      .then(() => {
      if (cancelled) return;
      markPreloaderDone();
      setVisible(false);
    });
    return () => {
      cancelled = true;
      count.stop();
    };
  }, [progress, reduce]);

  const at = (s: number) => (reduce ? 0 : s);

  return (
    <>
      <noscript>
        <style>{"#preloader{display:none}"}</style>
      </noscript>
      <AnimatePresence onExitComplete={() => (document.documentElement.style.overflow = "")}>
        {visible && (
          <motion.div key="preloader" id="preloader" className="fixed inset-0 z-[100]" aria-hidden="true" exit={{ opacity: 1 }} transition={{ duration: 1.1 }}>
            <motion.div
              className="absolute inset-0 bg-[linear-gradient(160deg,#95de64,#017649)]"
              initial={{ clipPath: "inset(0% 0% 0% 0%)" }}
              exit={{ clipPath: "inset(0% 0% 100% 0%)" }}
              transition={{ duration: 0.95, ease: curtain, delay: 0.14 }}
            />
            <motion.div
              className="absolute inset-0 overflow-hidden bg-[#fbfff6]"
              initial={{ clipPath: "inset(0% 0% 0% 0%)" }}
              exit={{ clipPath: "inset(0% 0% 100% 0%)" }}
              transition={{ duration: 0.9, ease: curtain }}
            >
              <div className="absolute inset-0 bg-[radial-gradient(rgba(1,118,73,0.12)_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(circle_at_center,#000,transparent_70%)]" />
              <motion.div
                className="absolute top-1/2 left-1/2 size-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(149,222,100,0.5),transparent)]"
                initial={{ scale: 0.4, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1.6, ease }}
              />
              {!reduce &&
                [0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    className="absolute top-1/2 left-1/2 size-[180px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-brand/25"
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 3.2, opacity: [0, 0.8, 0] }}
                    transition={{ duration: 2.4, ease: "easeOut", delay: 0.5 + i * 0.55, repeat: Infinity, repeatDelay: 0.6 }}
                  />
                ))}

              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                exit={{ y: -60, opacity: 0, scale: 0.94 }}
                transition={{ duration: 0.5, ease }}
              >
                <svg viewBox="0 0 40.5 40" width={MARK} height={MARK} className="shrink-0 overflow-visible">
                  <motion.path
                    d={LOGO_MARK.disc}
                    fill="none"
                    stroke="#017649"
                    strokeWidth="0.7"
                    initial={{ pathLength: 0, opacity: 1 }}
                    animate={{ pathLength: 1, opacity: 0 }}
                    transition={{ pathLength: { duration: at(0.9), ease: "easeInOut" }, opacity: { delay: at(1.1), duration: 0.3 } }}
                  />
                  <motion.path
                    d={LOGO_MARK.disc}
                    fill="#062617"
                    style={{ transformOrigin: "20.2px 20px" }}
                    initial={{ scale: 0.7, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", bounce: 0.35, visualDuration: 0.5, delay: at(0.7) }}
                  />
                  <motion.path
                    d={LOGO_MARK.p}
                    fill="white"
                    fillRule="evenodd"
                    clipRule="evenodd"
                    style={{ transformOrigin: "15px 20px" }}
                    initial={{ scale: 0.4, rotate: -120, opacity: 0 }}
                    animate={{ scale: 1, rotate: 0, opacity: 1 }}
                    transition={{ type: "spring", bounce: 0.25, visualDuration: 0.6, delay: at(0.95) }}
                  />
                  <motion.path
                    d={LOGO_MARK.arrow}
                    fill={LOGO_GREEN}
                    fillRule="evenodd"
                    clipRule="evenodd"
                    initial={{ x: -9, y: 9, opacity: 0 }}
                    animate={{ x: 0, y: 0, opacity: 1 }}
                    transition={{ type: "spring", bounce: 0.3, visualDuration: 0.5, delay: at(1.15) }}
                  />
                  <motion.path
                    d={LOGO_MARK.dot}
                    fill="white"
                    fillRule="evenodd"
                    clipRule="evenodd"
                    style={{ transformOrigin: "27.3px 17px" }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", bounce: 0.5, visualDuration: 0.4, delay: at(1.3) }}
                  />
                </svg>

                <motion.div
                  className="overflow-hidden"
                  initial={{ width: 0 }}
                  animate={{ width: (MARK * 116) / 40 }}
                  transition={{ duration: at(0.9), ease, delay: at(1.25) }}
                >
                  <svg viewBox="46 0 116 40" height={MARK} width={(MARK * 116) / 40} className="block">
                    {LOGO_WORD.map((l, i) => (
                      <motion.path
                        key={i}
                        d={l.d}
                        fill={l.go ? "#049A39" : "#062617"}
                        fillRule={l.evenOdd ? "evenodd" : undefined}
                        clipRule={l.evenOdd ? "evenodd" : undefined}
                        initial={{ y: 16, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: at(0.6), ease, delay: at(1.4 + i * 0.06) }}
                      />
                    ))}
                  </svg>
                </motion.div>
              </motion.div>

              <div className="absolute inset-x-5 bottom-6 flex items-end justify-between md:inset-x-10 md:bottom-8">
                <motion.span className="tabular text-[clamp(2.5rem,1.5rem+3vw,4.5rem)] leading-none font-semibold tracking-[-0.05em] text-forest/90">
                  {pct}
                </motion.span>
                <span className="mb-2 size-2 animate-pulse rounded-full bg-lime" />
              </div>
              <div className="absolute inset-x-0 bottom-0 h-[3px] bg-mint">
                <motion.div style={{ scaleX: bar }} className="h-full origin-left bg-gradient-to-r from-lime to-brand" />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
