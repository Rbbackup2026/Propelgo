"use client";

import { AnimatePresence, animate, motion, useMotionValue, useReducedMotion } from "motion/react";
import { usePathname } from "next/navigation";
import { useEffect, useState, useSyncExternalStore } from "react";
import { Logo, LogoMark } from "./Logo";
import { isPreloaderDone, markPreloaderDone } from "@/lib/preloader";

const ease = [0.16, 1, 0.3, 1] as const;
const inOut = [0.65, 0, 0.35, 1] as const;
/** The logo plays alone for this long before the cards begin. */
const INTRO_S = 1.1;
/** Length of the card sequence after the logo intro. */
const CARDS_S = 3.4;
const SCENE_S = INTRO_S + CARDS_S;
const CARD_W = 300;
const CARD_H = 190;

type Finish = { bg: string; ink: "light" | "dark" };

const FINISHES: Finish[] = [
  { bg: "linear-gradient(135deg,#95de64 0%,#3fae49 100%)", ink: "dark" },
  { bg: "linear-gradient(135deg,#f4f7f2 0%,#cfd8cc 100%)", ink: "dark" },
  { bg: "linear-gradient(135deg,#0e8ba3 0%,#06505e 100%)", ink: "light" },
  { bg: "linear-gradient(135deg,#d9f7be 0%,#9fd9a8 100%)", ink: "dark" },
  { bg: "linear-gradient(135deg,#1d2b24 0%,#050d09 100%)", ink: "light" },
  { bg: "linear-gradient(135deg,#f6e7c4 0%,#c9a65b 100%)", ink: "dark" },
  { bg: "linear-gradient(135deg,#03a35f 0%,#04452b 100%)", ink: "light" },
  { bg: "linear-gradient(135deg,#e8e6fb 0%,#a9a6f0 100%)", ink: "dark" },
];

/** Where each card flies during the burst, as a share of the viewport, with its spin. Fixed so server and client match. */
const BURST = [
  { x: -0.34, y: -0.3, r: -38, ry: 50 },
  { x: 0.33, y: -0.32, r: 28, ry: -40 },
  { x: 0.4, y: 0.06, r: 64, ry: 30 },
  { x: 0.3, y: 0.34, r: -22, ry: -55 },
  { x: -0.06, y: 0.4, r: 80, ry: 45 },
  { x: -0.36, y: 0.3, r: 18, ry: -35 },
  { x: -0.43, y: -0.02, r: -70, ry: 60 },
  { x: 0.04, y: -0.42, r: -12, ry: -50 },
];

/** Brand intro: a PropelGo card spins in, a burst of cards flies out and gathers back into one stack, then the card opens onto the page. */
export function Preloader() {
  const isHome = usePathname() === "/";
  const reduce = useReducedMotion();
  const [finished, setFinished] = useState(isPreloaderDone);
  const visible = isHome && !finished && !isPreloaderDone();
  const progress = useMotionValue(0);
  const view = useViewport();

  useEffect(() => {
    const root = document.documentElement;
    if (!isHome || isPreloaderDone()) {
      markPreloaderDone();
      root.style.overflow = "";
      return;
    }
    root.style.overflow = "hidden";
    let cancelled = false;
    const run = animate(progress, 1, { duration: reduce ? 0.6 : SCENE_S, ease: "linear" });
    Promise.all([run, document.fonts?.ready]).then(() => {
      if (cancelled) return;
      markPreloaderDone();
      setFinished(true);
    });
    return () => {
      cancelled = true;
      run.stop();
      root.style.overflow = "";
    };
  }, [isHome, progress, reduce]);

  const cardScale = Math.min(1, view.w / 520);
  const frame = { w: view.w - 32, h: view.h - 32 };

  return (
    <>
      <noscript>
        <style>{"#preloader{display:none}"}</style>
      </noscript>
      <AnimatePresence onExitComplete={() => (document.documentElement.style.overflow = "")}>
        {visible && (
          <motion.div
            key="preloader"
            id="preloader"
            className="fixed inset-0 z-[100] overflow-hidden bg-[#03130b]"
            aria-hidden="true"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: inOut, delay: 0.35 }}
          >
            <motion.div
              className="absolute top-1/2 left-1/2 size-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(149,222,100,0.22),rgba(1,118,73,0.08)_45%,transparent)]"
              initial={{ scale: 0.3, opacity: 0 }}
              animate={{ scale: [0.3, 1, 1.15, 0.9], opacity: [0, 1, 1, 0.8] }}
              transition={{ duration: SCENE_S, times: [0, 0.3, 0.5, 1], ease: "easeOut" }}
            />

            <div className="absolute inset-0 flex items-center justify-center [perspective:1400px]">
              {!reduce && (
                <motion.div
                  className="absolute"
                  initial={{ opacity: 0, scale: 0.86, filter: "blur(8px)" }}
                  animate={{ opacity: [0, 1, 1, 0], scale: [0.86, 1, 1.04, 0.55], filter: ["blur(8px)", "blur(0px)", "blur(0px)", "blur(6px)"] }}
                  transition={{ duration: INTRO_S + 0.25, times: [0, 0.4, 0.75, 1], ease: inOut }}
                >
                  <Logo tone="dark" className="h-12 w-auto drop-shadow-[0_0_24px_rgba(149,222,100,0.45)] md:h-14" />
                </motion.div>
              )}

              {!reduce && <Rays />}

              {!reduce &&
                BURST.map((b, i) => (
                  <motion.div
                    key={i}
                    className="absolute"
                    style={{ width: CARD_W, height: CARD_H, scale: cardScale }}
                    initial={{ x: 0, y: 0, rotate: 0, rotateY: 0, scale: 0.2 * cardScale, opacity: 0 }}
                    animate={{
                      x: [0, b.x * view.w, b.x * view.w * 1.08, -10 + i * 3, 0],
                      y: [0, b.y * view.h, b.y * view.h * 1.08, 14 - i * 4, 0],
                      rotate: [0, b.r, b.r * 1.3, -6 + i * 1.5, 0],
                      rotateY: [0, b.ry, b.ry * 0.6, 0, 0],
                      scale: [0.2 * cardScale, 0.82 * cardScale, 0.78 * cardScale, 0.92 * cardScale, 0.92 * cardScale],
                      opacity: [0, 1, 1, 1, 0],
                    }}
                    transition={{ duration: 2.3, delay: INTRO_S + 0.75 + i * 0.03, times: [0, 0.28, 0.5, 0.82, 1], ease: inOut }}
                  >
                    <Card finish={FINISHES[i]} />
                  </motion.div>
                ))}

              <motion.div
                className="absolute"
                style={{ width: CARD_W, height: CARD_H }}
                initial={reduce ? { opacity: 0, scale: cardScale } : { opacity: 0, rotateY: 88, rotate: -24, scale: 0.45 * cardScale }}
                animate={
                  reduce
                    ? { opacity: 1 }
                    : {
                        opacity: [0, 1, 1, 1, 1],
                        rotateY: [88, 0, 0, 0, 0],
                        rotate: [-24, -10, -10, 0, 0],
                        scale: [0.45 * cardScale, 0.8 * cardScale, 0.8 * cardScale, 1.05 * cardScale, 1.05 * cardScale],
                      }
                }
                transition={{ duration: CARDS_S - 0.2, delay: reduce ? 0 : INTRO_S - 0.15, times: [0, 0.22, 0.72, 0.92, 1], ease }}
                exit={{ scale: 1.6 * cardScale, opacity: 0, transition: { duration: 0.55, ease: inOut } }}
              >
                <motion.div
                  className="pointer-events-none absolute -inset-1 rounded-[22px]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 1, 0.55, 1, 1] }}
                  transition={{ duration: CARDS_S, delay: reduce ? 0 : INTRO_S - 0.15, times: [0, 0.22, 0.6, 0.9, 1] }}
                  style={{ boxShadow: "0 0 0 1.5px rgba(149,222,100,0.9), 0 0 28px 6px rgba(149,222,100,0.55), 0 0 90px 20px rgba(3,163,95,0.35)" }}
                />
                <Card finish={{ bg: "linear-gradient(135deg,#0c8a52 0%,#062617 78%)", ink: "light" }} hero />
              </motion.div>

              {!reduce && (
                <motion.div
                  className="pointer-events-none absolute rounded-[28px]"
                  style={{ boxShadow: "inset 0 0 0 1.5px rgba(149,222,100,0.85), 0 0 40px 4px rgba(149,222,100,0.35)" }}
                  initial={{ width: CARD_W * cardScale, height: CARD_H * cardScale, opacity: 0 }}
                  exit={{ width: [CARD_W * cardScale, frame.w], height: [CARD_H * cardScale, frame.h], opacity: [1, 1, 0] }}
                  transition={{ duration: 1, ease: inOut }}
                />
              )}
            </div>

            <div className="absolute inset-x-0 bottom-0 h-[2px] bg-white/10">
              <motion.div style={{ scaleX: progress }} className="h-full origin-left bg-gradient-to-r from-lime to-brand" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

const SERVER_VIEW = { w: 1440, h: 900 };
let clientView = SERVER_VIEW;

function subscribeViewport(onChange: () => void) {
  window.addEventListener("resize", onChange);
  return () => window.removeEventListener("resize", onChange);
}

/** Viewport size as a stable snapshot; the server renders a desktop default. */
function useViewport() {
  return useSyncExternalStore(
    subscribeViewport,
    () => {
      if (clientView.w !== window.innerWidth || clientView.h !== window.innerHeight) clientView = { w: window.innerWidth, h: window.innerHeight };
      return clientView;
    },
    () => SERVER_VIEW,
  );
}

/** Thin streaks of light that shoot out from the card as the burst begins. */
function Rays() {
  return (
    <>
      {Array.from({ length: 10 }, (_, i) => (
        <motion.span
          key={i}
          className="absolute top-1/2 left-1/2 h-px w-[46vw] origin-left bg-gradient-to-r from-lime/0 via-lime/70 to-lime/0"
          style={{ rotate: i * 36 + 8 }}
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: [0, 1, 1.1], opacity: [0, 0.9, 0] }}
          transition={{ duration: 1.1, delay: INTRO_S + 0.62 + (i % 3) * 0.05, ease: "easeOut" }}
        />
      ))}
    </>
  );
}

function Card({ finish, hero = false }: { finish: Finish; hero?: boolean }) {
  const light = finish.ink === "light";
  return (
    <div className="relative size-full overflow-hidden rounded-[20px] shadow-[0_30px_60px_-20px_rgba(0,0,0,0.6)] [backface-visibility:hidden]" style={{ background: finish.bg }}>
      <div className="absolute inset-0 bg-[linear-gradient(115deg,transparent_30%,rgba(255,255,255,0.22)_45%,transparent_60%)]" />
      <div className="absolute inset-0 rounded-[20px] ring-1 ring-white/15 ring-inset" />
      <div className="absolute top-5 left-5">
        {hero ? <Logo tone="dark" className="h-7 w-auto" /> : <LogoMark tone={light ? "dark" : "light"} className="size-8" />}
      </div>
      <svg viewBox="0 0 24 24" className={`absolute top-5 right-5 size-6 ${light ? "text-white/70" : "text-black/40"}`} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
        <path d="M8 8.5a5 5 0 0 1 0 7M11.5 6a8.5 8.5 0 0 1 0 12M15 3.5a12 12 0 0 1 0 17" />
      </svg>
      <div className="absolute top-[78px] left-5 h-[30px] w-[40px] rounded-[6px] bg-[linear-gradient(135deg,#f3dc9b,#c9a24f)] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.15)]">
        <div className="absolute inset-x-0 top-1/2 h-px bg-black/20" />
        <div className="absolute inset-y-0 left-1/2 w-px bg-black/20" />
      </div>
      <div className="absolute inset-x-5 bottom-5 flex items-end justify-between gap-3">
        <span className={`tabular truncate text-[15px] leading-none tracking-[0.18em] ${light ? "text-white/85" : "text-black/60"}`}>{hero ? "•••• 4021" : "•••• •••• •••• 4021"}</span>
        {hero && <span className="shrink-0 text-[11px] leading-none font-medium tracking-[0.14em] text-lime uppercase">Business</span>}
      </div>
    </div>
  );
}
