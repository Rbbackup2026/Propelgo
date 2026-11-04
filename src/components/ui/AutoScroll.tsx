"use client";

import { animate, motion, useMotionValue, useReducedMotion, type AnimationPlaybackControls } from "motion/react";
import { useEffect, useSyncExternalStore } from "react";
import { usePreloaderDone } from "@/lib/preloader";

const IDLE_MS = 4000;
const STORAGE_KEY = "pg-autoscroll";
const ease = [0.65, 0, 0.35, 1] as const;

const prefListeners = new Set<() => void>();

function readOff() {
  try {
    return sessionStorage.getItem(STORAGE_KEY) === "off";
  } catch {
    return false;
  }
}

function writeOff(off: boolean) {
  try {
    sessionStorage.setItem(STORAGE_KEY, off ? "off" : "on");
  } catch {}
  prefListeners.forEach((l) => l());
}

function useAutoScrollOff() {
  return useSyncExternalStore(
    (l) => {
      prefListeners.add(l);
      return () => prefListeners.delete(l);
    },
    readOff,
    () => false,
  );
}

/** Next stop: the next section if it starts within a screen, otherwise one screen down. Null at the bottom. */
function nextTarget() {
  const y = window.scrollY;
  const vh = window.innerHeight;
  const max = document.documentElement.scrollHeight - vh;
  if (y >= max - 4) return null;
  const tops = Array.from(document.querySelectorAll<HTMLElement>("main > *, body > footer, footer")).map((el) => Math.round(el.getBoundingClientRect().top + y));
  const next = tops.sort((a, b) => a - b).find((t) => t > y + 40);
  const target = next !== undefined && next - y <= vh ? next : y + Math.round(vh * 0.85);
  return Math.min(target, max);
}

/** Glides the home page to the next section after 4s without input. Any scroll, touch, key or click hands control back to the visitor. */
export function AutoScroll() {
  const reduce = useReducedMotion();
  const ready = usePreloaderDone();
  const off = useAutoScrollOff();
  const progress = useMotionValue(0);
  const active = ready && !off && !reduce;

  useEffect(() => {
    if (!active) return;
    let timer = 0;
    let glide: AnimationPlaybackControls | null = null;
    let countdown: AnimationPlaybackControls | null = null;
    let lastY = -1;
    let held = false;

    const schedule = () => {
      window.clearTimeout(timer);
      countdown?.stop();
      if (held || nextTarget() === null) {
        progress.set(0);
        return;
      }
      countdown = animate(progress, [0, 1], { duration: IDLE_MS / 1000, ease: "linear" });
      timer = window.setTimeout(step, IDLE_MS);
    };

    const step = () => {
      const to = nextTarget();
      progress.set(0);
      if (to === null) return;
      if (document.hidden) return schedule();
      const from = window.scrollY;
      glide = animate(from, to, {
        duration: Math.min(1.4, 0.7 + Math.abs(to - from) / 1600),
        ease,
        onUpdate: (v) => {
          lastY = Math.round(v);
          window.scrollTo(0, v);
        },
        onComplete: () => {
          glide = null;
          schedule();
        },
      });
    };

    const interrupt = () => {
      glide?.stop();
      glide = null;
      schedule();
    };

    const onScroll = () => {
      if (glide || Math.abs(window.scrollY - lastY) <= 2) return;
      lastY = -1;
      schedule();
    };

    /** Hovering a [data-autoscroll-pause] region holds the countdown until the cursor leaves. */
    const setHeld = (next: boolean) => {
      if (next === held) return;
      held = next;
      if (!glide) schedule();
    };
    const onPointerOver = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      setHeld(e.target instanceof Element && !!e.target.closest("[data-autoscroll-pause]"));
    };
    const onPointerOut = (e: PointerEvent) => {
      if (e.pointerType === "mouse" && !e.relatedTarget) setHeld(false);
    };

    const opts = { passive: true } as const;
    window.addEventListener("pointerover", onPointerOver, opts);
    window.addEventListener("pointerout", onPointerOut, opts);
    window.addEventListener("wheel", interrupt, opts);
    window.addEventListener("touchstart", interrupt, opts);
    window.addEventListener("pointerdown", interrupt, opts);
    window.addEventListener("keydown", interrupt);
    window.addEventListener("scroll", onScroll, opts);
    schedule();

    return () => {
      window.clearTimeout(timer);
      glide?.stop();
      countdown?.stop();
      progress.set(0);
      window.removeEventListener("pointerover", onPointerOver);
      window.removeEventListener("pointerout", onPointerOut);
      window.removeEventListener("wheel", interrupt);
      window.removeEventListener("touchstart", interrupt);
      window.removeEventListener("pointerdown", interrupt);
      window.removeEventListener("keydown", interrupt);
      window.removeEventListener("scroll", onScroll);
    };
  }, [active, progress]);

  if (reduce) return null;

  return (
    <button
      type="button"
      onClick={() => writeOff(!off)}
      aria-pressed={!off}
      aria-label={off ? "Turn on auto scroll" : "Pause auto scroll"}
      title={off ? "Auto scroll is off" : "Auto scroll is on"}
      className="fixed right-5 bottom-5 z-40 grid size-12 place-items-center rounded-full bg-white/95 text-brand shadow-[0_12px_40px_-12px_rgba(31,31,31,0.3)] ring-1 ring-line backdrop-blur transition-transform duration-300 hover:scale-105 active:scale-95"
    >
      <svg viewBox="0 0 48 48" className="absolute inset-0 size-full -rotate-90" aria-hidden="true">
        <circle cx="24" cy="24" r="21" fill="none" stroke="#eef2ee" strokeWidth="2" />
        <motion.circle cx="24" cy="24" r="21" fill="none" stroke="#017649" strokeWidth="2" strokeLinecap="round" style={{ pathLength: progress }} />
      </svg>
      {off ? (
        <svg viewBox="0 0 16 16" className="relative size-4" fill="currentColor" aria-hidden="true">
          <path d="M5 3.2v9.6a.6.6 0 0 0 .92.5l7.3-4.8a.6.6 0 0 0 0-1L5.92 2.7A.6.6 0 0 0 5 3.2z" />
        </svg>
      ) : (
        <svg viewBox="0 0 16 16" className="relative size-4" fill="currentColor" aria-hidden="true">
          <rect x="4" y="3" width="2.6" height="10" rx="0.8" />
          <rect x="9.4" y="3" width="2.6" height="10" rx="0.8" />
        </svg>
      )}
    </button>
  );
}
