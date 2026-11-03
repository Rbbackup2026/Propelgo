"use client";

import { AnimatePresence, animate, motion, useInView, useMotionValue, useReducedMotion, useSpring, useTransform, type MotionValue } from "motion/react";
import { useEffect, useState } from "react";
import { hero } from "@/content/home";
import { Button } from "@/components/ui/Button";
import { BrandRibbon } from "@/components/ui/BrandRibbon";
import { LogoMark } from "@/components/ui/Logo";
import { GRADIENT_TEXT } from "@/components/ui/Reveal";
import { Check, ContactlessIcon } from "@/components/ui/icons";
import { usePreloaderDone } from "@/lib/preloader";
import { useStageScale } from "@/lib/useStageScale";
import { OdccScene, RoutingScene } from "./HeroScenes";

const ease = [0.16, 1, 0.3, 1] as const;
/** Lets the preloader curtain clear before copy rises. */
const BASE = 0.35;
const HIGHLIGHT_WORDS = 4;
const STAGE_W = 640;
const STAGE_H = 590;
const inr = new Intl.NumberFormat("en-IN");

/** Figures and vendors mirror the Versa dashboard screens. */
const TXNS = [
  { vendor: "RoadRider Fleet Management", initials: "RF", last4: "5678", amount: 18400 },
  { vendor: "StayEase Hospitality", initials: "SH", last4: "4021", amount: 16700 },
  { vendor: "AirLink Booking Services", initials: "AB", last4: "7713", amount: 15200 },
  { vendor: "TransGlobal Logistics", initials: "TL", last4: "3390", amount: 9800 },
  { vendor: "Vendor Atlas, Mumbai", initials: "VA", last4: "1184", amount: 32000 },
];

export function HeroC() {
  const reduce = useReducedMotion();
  const ready = usePreloaderDone() || !!reduce;
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const mx = useSpring(px, { stiffness: 60, damping: 18, mass: 0.8 });
  const my = useSpring(py, { stiffness: 60, damping: 18, mass: 0.8 });

  const onMove = (e: React.PointerEvent<HTMLElement>) => {
    if (reduce || e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width - 0.5);
    py.set((e.clientY - r.top) / r.height - 0.5);
  };

  const rise = (delay: number) =>
    reduce ? {} : { initial: { opacity: 0, y: 18 }, animate: ready ? { opacity: 1, y: 0 } : undefined, transition: { duration: 0.9, ease, delay: BASE + delay } };

  const words = hero.headline.split(" ");

  return (
    <section
      onPointerMove={onMove}
      onPointerLeave={() => {
        px.set(0);
        py.set(0);
      }}
      className="relative isolate overflow-hidden pt-[112px] pb-12 md:pt-[136px] md:pb-16 lg:flex lg:min-h-[88svh] lg:items-center"
    >
      <Backdrop />
      {/* The same ribbon treatment as the team section, falling down the left edge as the earlier hero did. */}
      <BrandRibbon
        variant="twist"
        play={ready}
        pulse
        className="absolute top-0 left-0 -z-10 h-[78%] w-[min(34vw,420px)] opacity-90 [mask-image:radial-gradient(115%_100%_at_0%_0%,#000_35%,transparent_80%)] max-md:h-[45%] max-md:w-[55vw]"
      />
      <div className="container-page grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,600px)] lg:gap-8">
        <div className="relative max-w-[560px]">
          <h1 className="text-[clamp(2rem,1.5rem+1.7vw,3rem)] leading-[1.07] font-semibold tracking-[-0.035em] text-balance text-ink">
            {words.map((w, i) => (
              <span key={i} className="inline-block overflow-hidden pb-[0.08em] align-bottom">
                <motion.span
                  className={`inline-block ${i >= words.length - HIGHLIGHT_WORDS ? GRADIENT_TEXT : ""}`}
                  initial={reduce ? false : { y: "105%" }}
                  animate={ready ? { y: 0 } : undefined}
                  transition={{ duration: 0.9, ease, delay: BASE + 0.08 + i * 0.045 }}
                >
                  {w}
                  {i < words.length - 1 ? "\u00a0" : ""}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p {...rise(0.35)} className="mt-5 max-w-[520px] text-[16.5px] leading-[1.65] text-pretty text-copy md:text-[17.5px]">
            {hero.copy}
          </motion.p>

          <motion.div {...rise(0.45)} className="mt-8 flex flex-wrap items-center gap-4">
            <Button href={hero.primaryCta.href} size="lg" className="shadow-[0_14px_30px_-14px_rgba(1,118,73,0.7)]">
              {hero.primaryCta.label}
            </Button>
          </motion.div>
        </div>

        <Stage ready={ready} mx={mx} my={my} />
      </div>
    </section>
  );
}

function Backdrop() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
      <div className="absolute -top-[20%] right-[-12%] size-[780px] animate-blob-a rounded-full bg-[radial-gradient(closest-side,rgba(149,222,100,0.34),transparent)] motion-reduce:animate-none" />
      <div className="absolute top-[18%] right-[18%] size-[560px] animate-blob-b rounded-full bg-[radial-gradient(closest-side,rgba(14,139,163,0.14),transparent)] motion-reduce:animate-none" />
      <div className="absolute top-[-10%] left-[-10%] size-[520px] rounded-full bg-[radial-gradient(closest-side,rgba(217,247,190,0.6),transparent)]" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-white" />
    </div>
  );
}

type Parallax = { nearX: MotionValue<number>; nearY: MotionValue<number>; farX: MotionValue<number> };

/** Each product scene stays up for one full run of its own story before the next slides in. */
const SCENES = [
  { key: "versa", ms: 9400 },
  { key: "odcc", ms: 7800 },
  { key: "routing", ms: 8700 },
] as const;

function Stage({ ready, mx, my }: { ready: boolean; mx: MotionValue<number>; my: MotionValue<number> }) {
  const { ref, scale } = useStageScale<HTMLDivElement>(STAGE_W);
  const inView = useInView(ref, { margin: "0px 0px -10% 0px" });
  const reduce = useReducedMotion();
  const live = ready && inView && !reduce;

  const rotateY = useTransform(mx, [-0.5, 0.5], [-7, 7]);
  const rotateX = useTransform(my, [-0.5, 0.5], [6, -6]);
  const nearX = useTransform(mx, [-0.5, 0.5], [-14, 14]);
  const nearY = useTransform(my, [-0.5, 0.5], [-10, 10]);
  const farX = useTransform(mx, [-0.5, 0.5], [8, -8]);
  const parallax = { nearX, nearY, farX };

  const [scene, setScene] = useState(0);
  useEffect(() => {
    if (!live) return;
    const id = setTimeout(() => setScene((s) => (s + 1) % SCENES.length), SCENES[scene].ms);
    return () => clearTimeout(id);
  }, [live, scene]);

  return (
    <div ref={ref} className="relative w-full" style={{ height: STAGE_H * scale }}>
      <div className="absolute top-0 left-0 origin-top-left" style={{ width: STAGE_W, height: STAGE_H, transform: `scale(${scale})` }}>
        <AnimatePresence initial={false}>
          <motion.div
            key={SCENES[scene].key}
            className="absolute inset-0"
            initial={{ opacity: 0, x: 70, scale: 0.95, filter: "blur(8px)" }}
            animate={{ opacity: 1, x: 0, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, x: -70, scale: 0.95, filter: "blur(8px)" }}
            transition={{ duration: 0.8, ease }}
          >
            {scene === 0 && <VersaScene ready={ready} live={live} rotateX={rotateX} rotateY={rotateY} {...parallax} />}
            {scene === 1 && <OdccScene live={live} {...parallax} />}
            {scene === 2 && <RoutingScene live={live} {...parallax} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function VersaScene({
  ready,
  live,
  rotateX,
  rotateY,
  nearX,
  nearY,
  farX,
}: Parallax & { ready: boolean; live: boolean; rotateX: MotionValue<number>; rotateY: MotionValue<number> }) {
  const reduce = useReducedMotion();
  const [phase, round] = useIssueCycle(live);
  const shown: Phase = reduce ? 2 : phase;

  const pop = (delay: number, y = 30) =>
    reduce
      ? {}
      : { initial: { opacity: 0, y, scale: 0.96 }, animate: ready ? { opacity: 1, y: 0, scale: 1 } : undefined, transition: { type: "spring" as const, bounce: 0.22, visualDuration: 0.9, delay: BASE + delay } };

  return (
    <>
      <div className="absolute inset-0 [perspective:1400px]">
        <motion.div style={reduce ? undefined : { rotateX, rotateY }} className="absolute inset-0 preserve-3d">
          <motion.div {...pop(0.15, 50)} className="absolute top-[40px] left-[30px]">
            <Console live={live} ready={ready} />
          </motion.div>
        </motion.div>
      </div>

      <motion.div style={reduce ? undefined : { x: farX }} className="absolute top-0 right-0">
        <motion.div {...pop(0.75, -16)}>
          <ApprovalPill live={live} />
        </motion.div>
      </motion.div>

      <motion.div style={reduce ? undefined : { x: nearX }} className="pointer-events-none absolute inset-0">
        <motion.div {...pop(1)} className="absolute inset-0">
          <Wire phase={shown} round={round} />
        </motion.div>
      </motion.div>

      <motion.div style={reduce ? undefined : { x: nearX, y: nearY }} className="absolute right-[-6px] bottom-[34px]">
        <motion.div {...pop(0.6)}>
          <VirtualCard phase={shown} round={round} />
        </motion.div>
      </motion.div>

      <motion.div style={reduce ? undefined : { x: nearX }} className="absolute bottom-0 left-0">
        <motion.div {...pop(0.9)}>
          <ApiCard phase={shown} round={round} />
        </motion.div>
      </motion.div>
    </>
  );
}

/* ---------------- Console ---------------- */

const NAV: { group: string; items: { name: string; badge?: string }[] }[] = [
  { group: "Core", items: [{ name: "Dashboard" }, { name: "Fund projection" }] },
  { group: "Payments", items: [{ name: "Transactions" }, { name: "Payment links" }] },
  { group: "Cards", items: [{ name: "Parent cards" }, { name: "Virtual cards" }] },
  { group: "Admin", items: [{ name: "Approvals", badge: "7" }, { name: "Manage vendor" }] },
];

function Console({ live, ready }: { live: boolean; ready: boolean }) {
  return (
    <div className="h-[408px] w-[580px] overflow-hidden rounded-[18px] bg-white shadow-[0_2px_4px_rgba(6,38,23,0.04),0_40px_80px_-30px_rgba(6,38,23,0.32)] ring-1 ring-black/[0.07]">
      <div className="flex h-9 items-center gap-3 border-b border-line/80 bg-[#fbfcfb] px-3.5">
        <span className="flex gap-1.5">
          {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
            <span key={c} className="size-2.5 rounded-full opacity-80" style={{ backgroundColor: c }} />
          ))}
        </span>
        <span className="mx-auto flex h-[22px] w-[260px] items-center justify-center gap-1.5 rounded-md bg-white text-[10.5px] text-sub ring-1 ring-line">
          <svg viewBox="0 0 12 12" className="size-2.5" fill="none" aria-hidden="true">
            <rect x="2.5" y="5.5" width="7" height="5" rx="1.2" stroke="currentColor" />
            <path d="M4 5.5V4a2 2 0 1 1 4 0v1.5" stroke="currentColor" />
          </svg>
          app.propelgo.in/versa/dashboard
        </span>
        <span className="grid size-6 place-items-center rounded-full bg-mint text-[9.5px] font-semibold text-forest">HM</span>
      </div>

      <div className="flex h-[calc(100%-36px)]">
        <aside className="w-[128px] shrink-0 border-r border-line/70 bg-[#fafbfa] px-2.5 py-3">
          <div className="flex items-center gap-1.5 px-1.5">
            <LogoMark className="size-5" />
            <span className="text-[12px] font-semibold tracking-[-0.01em] text-ink">Versa</span>
          </div>
          {NAV.map((g) => (
            <div key={g.group} className="mt-3">
              <p className="px-1.5 text-[8.5px] font-semibold tracking-[0.12em] text-sub uppercase">{g.group}</p>
              <ul className="mt-1 space-y-0.5">
                {g.items.map((it) => {
                  const on = it.name === "Dashboard";
                  return (
                    <li
                      key={it.name}
                      className={`flex items-center justify-between rounded-md px-1.5 py-[3px] text-[10px] ${on ? "bg-white font-medium text-forest shadow-[0_1px_2px_rgba(0,0,0,0.05)] ring-1 ring-mint" : "text-copy"}`}
                    >
                      {it.name}
                      {it.badge && <span className="rounded-full bg-[#fdf3e6] px-1.5 text-[8.5px] font-semibold text-[#9a5410]">{it.badge}</span>}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </aside>

        <div className="min-w-0 flex-1 px-4 py-3">
          <div className="flex items-center justify-between">
            <p className="text-[13px] font-semibold tracking-[-0.01em] text-ink">Dashboard</p>
            <span className="flex rounded-md bg-surface p-0.5 text-[9.5px] ring-1 ring-line">
              <span className="px-1.5 py-0.5 text-sub">Weekly</span>
              <span className="rounded bg-white px-1.5 py-0.5 font-medium text-ink shadow-[0_1px_2px_rgba(0,0,0,0.06)]">Monthly</span>
            </span>
          </div>

          <div className="mt-2.5 grid grid-cols-3 gap-2">
            <Kpi label="Total cards" value={240} run={ready} delta="12.5%" />
            <Kpi label="Settled" value={39.4} run={ready} money />
            <Kpi label="Authorised" value={41.2} run={ready} money />
          </div>

          <SpendChart ready={ready} />
          <Feed live={live} />
        </div>
      </div>
    </div>
  );
}

function Kpi({ label, value, run, delta, money }: { label: string; value: number; run: boolean; delta?: string; money?: boolean }) {
  const mv = useMotionValue(0);
  const text = useTransform(mv, (v) => (money ? `₹${v.toFixed(1)}L` : inr.format(Math.round(v))));
  const reduce = useReducedMotion();
  useEffect(() => {
    if (reduce) return mv.set(value);
    if (!run) return;
    const c = animate(mv, value, { duration: 1.6, ease, delay: BASE + 0.6 });
    return () => c.stop();
  }, [run, value, mv, reduce]);
  return (
    <div className="rounded-lg bg-white px-2.5 py-2 ring-1 ring-line">
      <p className="text-[9.5px] text-sub">{label}</p>
      <div className="mt-0.5 flex items-baseline gap-1.5">
        <motion.span className="tabular text-[15px] font-semibold tracking-[-0.02em] text-ink">{text}</motion.span>
        {delta && <span className="text-[9px] font-semibold text-success">↑ {delta}</span>}
      </div>
    </div>
  );
}

const SPEND = "M0 70 C 22 64, 34 52, 56 54 S 92 34, 116 38 S 152 22, 176 28 S 214 10, 240 16 S 280 6, 300 8 S 340 2, 356 4";

function SpendChart({ ready }: { ready: boolean }) {
  const reduce = useReducedMotion();
  return (
    <div className="mt-2.5 rounded-lg bg-white px-2.5 pt-2 pb-1.5 ring-1 ring-line">
      <div className="flex items-center justify-between">
        <p className="text-[9.5px] text-sub">Spend overview</p>
        <p className="flex items-center gap-2 text-[9px] text-sub">
          <span className="flex items-center gap-1">
            <span className="size-1.5 rounded-full bg-brand" />
            Settled
          </span>
          <span className="flex items-center gap-1">
            <span className="size-1.5 rounded-full bg-[#0e8ba3]" />
            Authorised
          </span>
        </p>
      </div>
      <svg viewBox="0 0 356 78" className="mt-1 h-[70px] w-full overflow-visible" fill="none" aria-hidden="true">
        <defs>
          <linearGradient id="c-spend-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#95de64" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#95de64" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[18, 38, 58].map((y) => (
          <line key={y} x1="0" x2="356" y1={y} y2={y} stroke="#f0f0f0" strokeDasharray="2 4" />
        ))}
        <motion.path
          d="M0 74 C 30 70, 50 62, 80 62 S 130 48, 160 50 S 210 34, 240 36 S 300 22, 356 18"
          stroke="#0e8ba3"
          strokeOpacity="0.55"
          strokeWidth="1.5"
          strokeDasharray="3 3"
          initial={reduce ? false : { pathLength: 0 }}
          animate={ready ? { pathLength: 1 } : undefined}
          transition={{ duration: 1.6, ease, delay: BASE + 0.9 }}
        />
        <motion.path
          d={`${SPEND} L356 78 L0 78 Z`}
          fill="url(#c-spend-fill)"
          initial={reduce ? false : { opacity: 0 }}
          animate={ready ? { opacity: 1 } : undefined}
          transition={{ duration: 0.8, delay: BASE + 1.6 }}
        />
        <motion.path
          d={SPEND}
          stroke="#017649"
          strokeWidth="2"
          strokeLinecap="round"
          initial={reduce ? false : { pathLength: 0 }}
          animate={ready ? { pathLength: 1 } : undefined}
          transition={{ duration: 1.6, ease, delay: BASE + 0.8 }}
        />
        {ready && !reduce && (
          <g>
            <circle r="3.5" fill="#017649" stroke="#fff" strokeWidth="1.5">
              <animateMotion dur="6s" repeatCount="indefinite" path={SPEND} begin="2.6s" />
            </circle>
          </g>
        )}
      </svg>
      <div className="flex justify-between px-0.5 text-[8px] text-sub">
        {["Jun", "Jul", "Aug", "Sep", "Oct", "Nov"].map((m) => (
          <span key={m}>{m}</span>
        ))}
      </div>
    </div>
  );
}

function Feed({ live }: { live: boolean }) {
  const [head, setHead] = useState(2);
  useEffect(() => {
    if (!live) return;
    const id = setInterval(() => setHead((h) => h + 1), 2600);
    return () => clearInterval(id);
  }, [live]);
  const rows = [head, head - 1, head - 2];
  return (
    <div className="mt-2.5">
      <div className="flex items-center justify-between">
        <p className="text-[9.5px] text-sub">Live transactions</p>
        <span className="flex items-center gap-1 text-[9px] font-medium text-success">
          <span className="size-1.5 animate-pulse rounded-full bg-success" />
          Live
        </span>
      </div>
      <ul className="relative mt-1 h-[96px] overflow-hidden">
        <AnimatePresence initial={false}>
          {rows.map((n, i) => {
            const t = TXNS[((n % TXNS.length) + TXNS.length) % TXNS.length];
            return (
              <motion.li
                key={n}
                layout
                initial={{ opacity: 0, y: -18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease }}
                className="flex h-8 items-center gap-2 border-b border-line/60 last:border-0"
              >
                <span className="grid size-5 shrink-0 place-items-center rounded-full bg-mist text-[8px] font-semibold text-forest ring-1 ring-mint">{t.initials}</span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[10.5px] font-medium text-ink">{t.vendor}</span>
                  <span className="block text-[8.5px] text-sub">Virtual card •••• {t.last4}</span>
                </span>
                <span className="tabular text-[10.5px] font-semibold text-ink">₹{inr.format(t.amount)}</span>
                <Status fresh={i === 0 && live} />
              </motion.li>
            );
          })}
        </AnimatePresence>
      </ul>
    </div>
  );
}

function Status({ fresh }: { fresh: boolean }) {
  const [settled, setSettled] = useState(!fresh);
  useEffect(() => {
    if (!fresh) return;
    const t = setTimeout(() => setSettled(true), 1300);
    return () => clearTimeout(t);
  }, [fresh]);
  return (
    <span
      className={`w-[62px] rounded-full py-0.5 text-center text-[8.5px] font-semibold transition-colors duration-500 ${
        settled ? "bg-mint text-forest" : "bg-[#e6f5f8] text-[#0a6a7d]"
      }`}
    >
      {settled ? "Settled" : "Authorised"}
    </span>
  );
}

/* ---------------- Floating cards ---------------- */

/* ---------------- Card issuing flow ---------------- */

type Phase = 0 | 1 | 2;
const ISSUE_CYCLE_MS = 9000;
const CARD_NUMBER = "•••• •••• •••• 5678";
const WIRE = "M 288 486 C 330 486, 352 498, 404 492";
const ISSUE_STEPS = ["Vendor verified", "Limit check passed", "Card tokenised"];

/** Request (0) → backend processing (1) → card created (2), on a loop. */
function useIssueCycle(live: boolean): [Phase, number] {
  const [state, setState] = useState<{ phase: Phase; round: number }>({ phase: 0, round: 0 });
  useEffect(() => {
    if (!live) return;
    let steps: ReturnType<typeof setTimeout>[] = [];
    const run = () => {
      setState((s) => ({ phase: 0, round: s.round + 1 }));
      steps = [setTimeout(() => setState((s) => ({ ...s, phase: 1 })), 1500), setTimeout(() => setState((s) => ({ ...s, phase: 2 })), 3000)];
    };
    const first = setTimeout(run, 200);
    const id = setInterval(run, ISSUE_CYCLE_MS);
    return () => {
      clearTimeout(first);
      clearInterval(id);
      steps.forEach(clearTimeout);
    };
  }, [live]);
  return [state.phase, state.round];
}

function Wire({ phase, round }: { phase: Phase; round: number }) {
  return (
    <svg viewBox={`0 0 ${STAGE_W} ${STAGE_H}`} width={STAGE_W} height={STAGE_H} className="absolute inset-0" fill="none" aria-hidden="true">
      <path d={WIRE} stroke="#03a35f" strokeOpacity={0.4} strokeWidth={1.5} strokeDasharray="3 4" strokeLinecap="round" />
      {phase === 1 && (
        <motion.path
          key={round}
          d={WIRE}
          stroke="#03a35f"
          strokeWidth={2.5}
          strokeLinecap="round"
          style={{ filter: "drop-shadow(0 0 4px rgba(3,163,95,0.7))" }}
          initial={{ pathLength: 0.28, pathOffset: 0, opacity: 0 }}
          animate={{ pathOffset: 0.72, opacity: [0, 1, 1, 0] }}
          transition={{ delay: 0.85, duration: 0.65, ease: "easeInOut" }}
        />
      )}
      <circle cx="288" cy="486" r="3.5" fill="#fff" stroke="#03a35f" strokeWidth="1.5" />
      <circle cx="404" cy="492" r="3.5" fill="#fff" stroke="#03a35f" strokeWidth="1.5" />
      {phase === 2 && (
        <motion.circle
          key={`ping-${round}`}
          cx="404"
          cy="492"
          fill="#03a35f"
          initial={{ r: 3.5, opacity: 0.5 }}
          animate={{ r: 14, opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      )}
    </svg>
  );
}

function VirtualCard({ phase, round }: { phase: Phase; round: number }) {
  const reduce = useReducedMotion();
  const made = phase === 2;
  return (
    <div className="animate-float motion-reduce:animate-none">
      <div className="relative h-[146px] w-[232px] rotate-[5deg]">
        <div className="absolute inset-0 rounded-[18px] border-[1.5px] border-dashed border-brand/40 bg-white/90 p-4 shadow-[0_20px_40px_-24px_rgba(6,38,23,0.35)] backdrop-blur">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <LogoMark className="size-5 opacity-50" />
              <span className="h-2 w-14 rounded-full bg-line" />
            </span>
            <span className="flex items-center gap-1 text-[9.5px] font-medium text-brand">
              {phase === 1 && <span className="size-2.5 animate-spin rounded-full border border-mint border-t-brand" />}
              {phase === 1 ? "Issuing card" : "Awaiting request"}
            </span>
          </div>
          <span className="mt-7 block h-2 w-28 animate-pulse rounded-full bg-line/80" />
          <span className="mt-2 block h-2.5 w-40 animate-pulse rounded-full bg-line" />
          <span className="mt-3 flex justify-between">
            <span className="h-2 w-16 animate-pulse rounded-full bg-line/80" />
            <span className="h-2 w-8 animate-pulse rounded-full bg-line/80" />
          </span>
        </div>

        <motion.div
          initial={reduce ? false : { clipPath: "inset(0% 0% 0% 100% round 18px)" }}
          animate={
            made
              ? { clipPath: ["inset(0% 100% 0% 0% round 18px)", "inset(0% 0% 0% 0% round 18px)"] }
              : { clipPath: "inset(0% 0% 0% 100% round 18px)" }
          }
          transition={{ duration: made ? 0.8 : 0.45, ease }}
          className="absolute inset-0 overflow-hidden rounded-[18px] p-4 text-white shadow-[0_30px_60px_-24px_rgba(6,38,23,0.6)]"
          style={{ background: "linear-gradient(135deg, #03b468 0%, #017649 40%, #04452b 78%, #062617 100%)" }}
        >
          <svg viewBox="0 0 232 146" className="pointer-events-none absolute inset-0" fill="none" aria-hidden="true">
            {[0, 1, 2, 3, 4].map((i) => (
              <circle key={i} cx="220" cy="-6" r={46 + i * 26} stroke="white" strokeOpacity={0.08} />
            ))}
          </svg>
          <span className="pointer-events-none absolute inset-y-0 left-0 w-1/3 animate-shine bg-gradient-to-r from-transparent via-white/20 to-transparent motion-reduce:hidden" />
          <div className="relative flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <LogoMark tone="dark" className="size-5" />
              <span className="text-[11px] font-semibold">PropelGo</span>
            </span>
            <ContactlessIcon className="size-4 text-white/75" />
          </div>
          <p className="relative mt-6 text-[9.5px] text-white/60">Virtual card · RoadRider Fleet</p>
          <p key={round} className="tabular relative mt-0.5 text-[13px] tracking-[0.14em]">
            <span className="sr-only">Card ending 5678</span>
            {CARD_NUMBER.split("").map((ch, i) => (
              <motion.span
                key={i}
                aria-hidden="true"
                initial={reduce ? false : { opacity: 0 }}
                animate={made ? { opacity: 1 } : undefined}
                transition={{ duration: 0.15, delay: 0.45 + i * 0.025 }}
              >
                {ch}
              </motion.span>
            ))}
          </p>
          <div className="relative mt-2 flex items-center justify-between text-[9px] text-white/70">
            <span>Limit ₹1,00,000</span>
            <span>12/26</span>
          </div>
        </motion.div>

        {made && !reduce && (
          <motion.span
            key={`edge-${round}`}
            className="absolute inset-y-2 w-[2px] rounded-full bg-white shadow-[0_0_14px_4px_rgba(149,222,100,0.85)]"
            initial={{ left: "0%", opacity: 1 }}
            animate={{ left: "100%", opacity: [1, 1, 0] }}
            transition={{ duration: 0.8, ease }}
          />
        )}

        <AnimatePresence>
          {made && (
            <motion.span
              key={`badge-${round}`}
              initial={reduce ? false : { scale: 0.6, opacity: 0, y: 4 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", bounce: 0.45, visualDuration: 0.35, delay: reduce ? 0 : 0.9 }}
              className="absolute -top-3 -left-2 flex items-center gap-1 rounded-full bg-white px-2 py-0.5 text-[9.5px] font-semibold text-forest shadow-[0_8px_18px_-8px_rgba(6,38,23,0.45)] ring-1 ring-mint"
            >
              <span className="size-1.5 rounded-full bg-brand" />
              Card active
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function ApprovalPill({ live }: { live: boolean }) {
  const [round, setRound] = useState(0);
  useEffect(() => {
    if (!live) return;
    const id = setInterval(() => setRound((r) => r + 1), 5200);
    return () => clearInterval(id);
  }, [live]);
  return (
    <div className="flex w-[236px] items-center gap-3 rounded-2xl bg-white/95 p-3 shadow-[0_20px_40px_-20px_rgba(6,38,23,0.35)] ring-1 ring-black/[0.06] backdrop-blur">
      <div className="min-w-0 flex-1">
        <p className="text-[9.5px] text-sub">Maker–checker</p>
        <p className="tabular text-[12.5px] font-semibold text-ink">₹2,48,500 approved</p>
      </div>
      <div key={round} className="flex -space-x-1.5">
        {["RK", "AS"].map((a, i) => (
          <motion.span
            key={a}
            initial={{ backgroundColor: "#fafafa", color: "#8c8c8c" }}
            animate={{ backgroundColor: "#d9f7be", color: "#062617" }}
            transition={{ duration: 0.4, delay: 0.3 + i * 0.5 }}
            className="relative grid size-7 place-items-center rounded-full text-[9.5px] font-semibold ring-2 ring-white"
          >
            {a}
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", bounce: 0.4, visualDuration: 0.3, delay: 0.5 + i * 0.5 }}
              className="absolute -right-0.5 -bottom-0.5 grid size-3.5 place-items-center rounded-full bg-brand text-white ring-2 ring-white"
            >
              <Check className="size-2" />
            </motion.span>
          </motion.span>
        ))}
      </div>
    </div>
  );
}

const API_LINES: { k?: string; v: string; tone?: "str" | "num" | "arr" }[] = [
  { v: "{" },
  { k: "vendor", v: '"RoadRider Fleet"', tone: "str" },
  { k: "limit", v: "100000", tone: "num" },
  { k: "controls", v: '["ECOM", "DOMESTIC"]', tone: "arr" },
  { k: "expiry", v: '"2026-12-31"', tone: "str" },
  { v: "}" },
];

function ApiCard({ phase, round }: { phase: Phase; round: number }) {
  const reduce = useReducedMotion();
  const step = 0.16;
  const fade = { initial: reduce ? false : { opacity: 0, y: 4 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -4 }, transition: { duration: 0.25 } } as const;
  return (
    <div className="w-[284px] overflow-hidden rounded-2xl bg-white/95 shadow-[0_24px_50px_-24px_rgba(6,38,23,0.38)] ring-1 ring-black/[0.06] backdrop-blur">
      <div className="flex items-center gap-2 border-b border-line/70 px-3.5 py-2">
        <span className="rounded bg-mint px-1.5 py-0.5 font-mono text-[9px] font-bold text-forest">POST</span>
        <span className="font-mono text-[10.5px] text-ink">/v1/cards/virtual</span>
        <span className="ml-auto flex items-center gap-1 text-[9px] font-medium text-sub">
          <span className="relative flex size-1.5">
            <span className="absolute inset-0 animate-ping-soft rounded-full bg-lime motion-reduce:hidden" />
            <span className="relative size-1.5 rounded-full bg-brand" />
          </span>
          api.propelgo.in
        </span>
      </div>
      <div className="px-3.5 py-2.5 font-mono text-[10.5px] leading-[1.65]">
        <div key={round}>
          {API_LINES.map((l, i) => (
            <motion.div
              key={i}
              initial={reduce ? false : { opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.15 + i * step }}
              className={l.k ? "pl-3.5" : ""}
            >
              {l.k && <span className="text-[#5b57d9]">&quot;{l.k}&quot;</span>}
              {l.k && <span className="text-sub">: </span>}
              <span className={l.tone === "num" ? "text-[#d9822b]" : l.tone ? "text-brand" : "text-sub"}>{l.v}</span>
              {l.k && i < API_LINES.length - 2 && <span className="text-sub">,</span>}
            </motion.div>
          ))}
        </div>

        <div className="mt-2 h-[62px] text-[10px] leading-[16px]">
          <AnimatePresence mode="wait" initial={false}>
            {phase === 0 && (
              <motion.div key="send" {...fade} className="flex h-full items-center gap-2 rounded-lg bg-surface px-2.5 text-sub">
                <span className="flex gap-0.5">
                  {[0, 1, 2].map((d) => (
                    <span key={d} className="size-1 animate-pulse rounded-full bg-sub" style={{ animationDelay: `${d * 160}ms` }} />
                  ))}
                </span>
                Sending request to PropelGo
              </motion.div>
            )}
            {phase === 1 && (
              <motion.ul key="process" {...fade} className="h-full rounded-lg bg-surface px-2.5 py-[7px]">
                {ISSUE_STEPS.map((s, i) => (
                  <motion.li
                    key={s}
                    initial={reduce ? false : { opacity: 0, x: -4 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.25, delay: i * 0.4 }}
                    className="flex items-center gap-1.5 text-copy"
                  >
                    <span className="relative grid size-3 place-items-center">
                      <span className="absolute inset-0 animate-spin rounded-full border border-line border-t-brand" />
                      <motion.span
                        initial={reduce ? false : { scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", bounce: 0.4, visualDuration: 0.3, delay: 0.3 + i * 0.4 }}
                        className="relative grid size-3 place-items-center rounded-full bg-brand text-white"
                      >
                        <Check className="size-2" />
                      </motion.span>
                    </span>
                    {s}
                  </motion.li>
                ))}
              </motion.ul>
            )}
            {phase === 2 && (
              <motion.div key="done" {...fade} className="flex h-full flex-col justify-center gap-0.5 rounded-lg bg-mist px-2.5 ring-1 ring-mint">
                <span className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-forest">
                    <span className="grid size-3.5 place-items-center rounded-full bg-brand text-white">
                      <Check className="size-2" />
                    </span>
                    201 · card_live
                  </span>
                  <span className="text-copy">•••• 5678</span>
                </span>
                <span className="pl-5 text-sub">Issued in 1.4 s · webhook sent</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
