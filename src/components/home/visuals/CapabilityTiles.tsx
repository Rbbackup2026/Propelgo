"use client";

import { AnimatePresence, motion } from "motion/react";
import type { CapabilityKey } from "@/content/home";
import { Check, ContactlessIcon } from "@/components/ui/icons";
import { RealIcon } from "@/components/ui/RealIcon";
import { usePhaseLoop } from "@/lib/useStageScale";
import { useMediaQuery } from "@/lib/useMediaQuery";

const ease = [0.16, 1, 0.3, 1] as const;
const inr = new Intl.NumberFormat("en-IN");

export type Accent = { solid: string; deep: string; soft: string; glow: string };

/** One accent per capability so the bento reads as four distinct tools rather than one green block. */
export const ACCENTS: Record<CapabilityKey, Accent> = {
  routing: { solid: "#017649", deep: "#015c39", soft: "#e9f7ef", glow: "rgba(1,118,73,0.14)" },
  cards: { solid: "#5b57d9", deep: "#3f3bb3", soft: "#efeefd", glow: "rgba(91,87,217,0.14)" },
  workflow: { solid: "#d9822b", deep: "#9a5410", soft: "#fdf3e6", glow: "rgba(217,130,43,0.16)" },
  reconcile: { solid: "#0e8ba3", deep: "#0a6a7d", soft: "#e6f5f8", glow: "rgba(14,139,163,0.14)" },
};

export function CapabilityTileArt({ kind, playing }: { kind: CapabilityKey; playing: boolean }) {
  if (kind === "routing") return <RouterArt playing={playing} />;
  if (kind === "cards") return <DeckArt playing={playing} />;
  if (kind === "workflow") return <ApprovalArt playing={playing} />;
  return <ReconArt playing={playing} />;
}

export function CapabilityGlyph({ kind, className = "size-8" }: { kind: CapabilityKey; className?: string }) {
  return <RealIcon name={kind} className={className} />;
}

/* ---------- 1. Orchestration: each payment is evaluated by the router and sent down its rail. ---------- */

const R = ACCENTS.routing;
const HUB = { x: 262, y: 120 };
const LANE_X = 404;
const lanes = [
  { label: "Bank A", y: 48, base: 128 },
  { label: "Bank B", y: 120, base: 342 },
  { label: "Card network", y: 192, base: 96 },
];
const routed = [
  { amount: "₹14.2L", lane: 0, rule: "Above ₹10L  →  Bank A" },
  { amount: "₹86K", lane: 1, rule: "Under ₹1L  →  Bank B" },
  { amount: "₹2.4L", lane: 2, rule: "Card spend  →  Network" },
  { amount: "₹22.7L", lane: 0, rule: "Above ₹10L  →  Bank A" },
  { amount: "₹48K", lane: 1, rule: "Under ₹1L  →  Bank B" },
];

const lanePath = (y: number) => `M ${HUB.x + 34} ${HUB.y} C ${HUB.x + 92} ${HUB.y}, ${LANE_X - 62} ${y}, ${LANE_X} ${y}`;

function laneSamples(y: number, n = 12) {
  const [x0, y0, x1, y1, x2, y2, x3, y3] = [HUB.x + 34, HUB.y, HUB.x + 92, HUB.y, LANE_X - 62, y, LANE_X - 20, y];
  const xs: number[] = [];
  const ys: number[] = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const u = 1 - t;
    xs.push(u * u * u * x0 + 3 * u * u * t * x1 + 3 * u * t * t * x2 + t * t * t * x3);
    ys.push(u * u * u * y0 + 3 * u * u * t * y1 + 3 * u * t * t * y2 + t * t * t * y3);
  }
  return { xs, ys };
}

function routedCount(lane: number, upTo: number) {
  const perCycle = routed.filter((r) => r.lane === lane).length;
  const full = Math.floor(upTo / routed.length);
  const rest = routed.slice(0, upTo % routed.length).filter((r) => r.lane === lane).length;
  return full * perCycle + rest;
}

function RouterArt({ playing }: { playing: boolean }) {
  // phase 0: payment travels into the router, 1: routed down its lane
  const { phase, cycle } = usePhaseLoop(2, 1400, playing);
  const p = routed[cycle % routed.length];
  const out = laneSamples(lanes[p.lane].y);
  // Phones crop to router and lanes so labels stay legible; payments then enter from the edge.
  const compact = useMediaQuery("(max-width: 639px)");

  return (
    <svg viewBox={compact ? "150 4 404 232" : "0 0 560 240"} className="absolute inset-0 m-auto h-full w-full max-w-[640px] px-4" fill="none">
      <path d={`M 110 ${HUB.y} H ${HUB.x - 34}`} stroke="#e8e8e8" strokeWidth="2" strokeDasharray="4 6" />
      {lanes.map((l) => (
        <path key={l.label} d={lanePath(l.y)} stroke="#e8e8e8" strokeWidth="2" />
      ))}
      {phase === 1 && (
        <motion.path
          key={`lane-${cycle}`}
          d={lanePath(lanes[p.lane].y)}
          stroke={R.solid}
          strokeWidth="2.5"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.8, ease }}
        />
      )}

      <g>
        <rect x="16" y="98" width="94" height="44" rx="12" fill="#fff" stroke="#e8e8e8" />
        <text x="63" y="117" textAnchor="middle" className="fill-ink text-[13px] font-semibold">
          ERP
        </text>
        <text x="63" y="133" textAnchor="middle" className="fill-sub text-[10.5px]">
          Payables
        </text>
      </g>

      <g className="origin-[262px_120px] animate-[spin_14s_linear_infinite] motion-reduce:animate-none">
        <circle cx={HUB.x} cy={HUB.y} r="52" stroke={R.solid} strokeOpacity="0.35" strokeDasharray="3 7" />
      </g>
      <motion.g
        key={`hub-${cycle}-${phase}`}
        style={{ transformOrigin: `${HUB.x}px ${HUB.y}px` }}
        initial={{ scale: phase === 1 ? 1.1 : 1 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", bounce: 0.5, visualDuration: 0.4 }}
      >
        <rect x={HUB.x - 34} y={HUB.y - 34} width="68" height="68" rx="18" fill={R.solid} />
        <path d={`M ${HUB.x - 14} ${HUB.y} h 8 c 6 0 6 -10 13 -10 h 7 M ${HUB.x - 6} ${HUB.y} c 6 0 6 10 13 10 h 7 M ${HUB.x - 6} ${HUB.y} h 20`} stroke="#fff" strokeWidth="2.2" strokeLinecap="round" />
      </motion.g>

      <AnimatePresence mode="wait">
        <motion.text
          key={`rule-${cycle}`}
          x={HUB.x}
          y={HUB.y + 82}
          textAnchor="middle"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.35 }}
          style={{ fill: R.deep }}
          className="text-[12px] font-semibold whitespace-pre"
        >
          {p.rule}
        </motion.text>
      </AnimatePresence>

      {lanes.map((l, i) => {
        const on = phase === 1 && p.lane === i;
        const count = l.base + routedCount(i, cycle) + (on ? 1 : 0);
        return (
          <g key={l.label}>
            <rect
              x={LANE_X}
              y={l.y - 20}
              width="140"
              height="40"
              rx="12"
              fill={on ? R.soft : "#fff"}
              stroke={on ? R.solid : "#e8e8e8"}
              className="transition-[fill,stroke] duration-300"
            />
            <text x={LANE_X + 14} y={l.y + 4.5} className="fill-ink text-[12.5px] font-medium">
              {l.label}
            </text>
            <text x={LANE_X + 126} y={l.y + 4.5} textAnchor="end" className="tabular text-[12.5px] font-semibold" style={{ fill: on ? R.solid : "#8c8c8c" }}>
              {count}
            </text>
          </g>
        );
      })}

      <motion.g
        key={`chip-${cycle}-${phase}`}
        initial={phase === 0 ? { x: 70, y: HUB.y, opacity: 0, scale: 0.9 } : { x: out.xs[0], y: out.ys[0], opacity: 0, scale: 0.7 }}
        animate={
          phase === 0
            ? { x: [70, 160, HUB.x - 6], y: HUB.y, opacity: [0, 1, 0], scale: [0.9, 1, 0.6] }
            : { x: out.xs, y: out.ys, opacity: [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0.6, 0], scale: [0.7, 1, 1] }
        }
        transition={{ duration: 1.15, ease: "easeInOut" }}
      >
        <rect x="-32" y="-13" width="64" height="26" rx="13" fill="#fff" stroke={R.solid} strokeOpacity="0.5" />
        <text y="4.5" textAnchor="middle" className="tabular fill-ink text-[12px] font-semibold">
          {p.amount}
        </text>
      </motion.g>
    </svg>
  );
}

/* ---------- 2. Cards: the deck shuffles, each card purpose-built with its own limit. ---------- */

const deck = [
  { name: "Skyline Hotels", tag: "Vendor card", limit: 250000, spent: 0.62, last4: "4021", bg: "linear-gradient(135deg,#7773f3 0%,#5148d1 50%,#2f2795 100%)", dark: true },
  { name: "Sales team travel", tag: "Travel card", limit: 50000, spent: 0.38, last4: "7713", bg: "linear-gradient(135deg,#27324f 0%,#121a30 100%)", dark: true },
  { name: "Cloud & software", tag: "Subscription card", limit: 20000, spent: 0.81, last4: "3390", bg: "linear-gradient(135deg,#e4e3fd 0%,#c4c1f8 100%)", dark: false },
];

const slots = [
  { y: 0, scale: 1, zIndex: 3 },
  { y: -22, scale: 0.93, zIndex: 2 },
  { y: -44, scale: 0.86, zIndex: 1 },
];

function DeckArt({ playing }: { playing: boolean }) {
  const { cycle } = usePhaseLoop(1, 2800, playing);
  const front = cycle % deck.length;

  return (
    <div className="absolute inset-0 grid place-items-center">
      <div className="relative mt-10 h-[168px] w-[270px] [perspective:1000px]">
        {deck.map((c, i) => {
          const slot = (i - front + deck.length) % deck.length;
          const toBack = slot === deck.length - 1;
          const s = slots[slot];
          return (
            <motion.div
              key={c.last4}
              className={`absolute inset-0 rounded-2xl p-4 shadow-[0_24px_40px_-22px_rgba(31,27,75,0.55)] ${c.dark ? "text-white" : "text-[#1e1b4b] ring-1 ring-[#c4c1f8]"}`}
              style={{ background: c.bg }}
              initial={false}
              animate={
                toBack && cycle > 0
                  ? { y: [0, 36, 12, s.y], x: [0, 170, 140, 0], rotate: [0, 12, 8, 0], scale: [1, 0.96, 0.9, s.scale], zIndex: [3, 3, 0, s.zIndex] }
                  : { y: s.y, x: 0, rotate: 0, scale: s.scale, zIndex: s.zIndex }
              }
              transition={toBack ? { duration: 1.1, times: [0, 0.4, 0.55, 1], ease: "easeInOut" } : { type: "spring", bounce: 0.25, visualDuration: 0.6 }}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className={`text-[10.5px] font-medium tracking-[0.04em] uppercase ${c.dark ? "text-white/60" : "text-[#4c4799]"}`}>{c.tag}</p>
                  <p className="mt-0.5 text-[14px] font-semibold tracking-[-0.01em]">{c.name}</p>
                </div>
                <ContactlessIcon className={`size-4 ${c.dark ? "text-white/70" : "text-[#4c4799]"}`} />
              </div>
              <div className="absolute inset-x-4 bottom-4">
                <div className="flex items-end justify-between text-[11px]">
                  <span className={c.dark ? "text-white/70" : "text-[#4c4799]"}>
                    Spent <span className="tabular font-semibold">₹{inr.format(Math.round(c.limit * c.spent))}</span>
                  </span>
                  <span className={`tabular ${c.dark ? "text-white/70" : "text-[#4c4799]"}`}>of ₹{inr.format(c.limit)}</span>
                </div>
                <div className={`mt-1.5 h-1.5 overflow-hidden rounded-full ${c.dark ? "bg-white/15" : "bg-white/70"}`}>
                  <motion.div
                    key={slot === 0 ? `on-${cycle}` : "off"}
                    className={`h-full origin-left rounded-full ${c.dark ? "bg-white" : "bg-[#5b57d9]"}`}
                    initial={{ scaleX: slot === 0 && playing ? 0 : c.spent }}
                    animate={{ scaleX: c.spent }}
                    transition={{ duration: 1.2, ease, delay: 0.5 }}
                  />
                </div>
                <p className="tabular mt-2.5 text-[12.5px] tracking-[0.12em] opacity-80">•••• {c.last4}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

/* ---------- 3. Workflow: approvals tick off in order, then the payment is stamped released. ---------- */

const W = ACCENTS.workflow;
const approvers = [
  { who: "RK", role: "Maker" },
  { who: "AS", role: "Checker" },
  { who: "PV", role: "Finance" },
  { who: "₹", role: "Release" },
];
const statuses = ["Draft", "Awaiting checker", "Awaiting finance", "Releasing", "Paid"];

function ApprovalArt({ playing }: { playing: boolean }) {
  const { phase } = usePhaseLoop(approvers.length + 3, 900, playing);
  const done = playing ? Math.min(phase, approvers.length) : approvers.length;
  const released = done === approvers.length;

  return (
    <div className="absolute inset-0 flex flex-col justify-center gap-6 px-10 md:px-12">
      <div className="relative">
        <span className="absolute top-5 right-5 left-5 h-[2px] rounded-full bg-line" aria-hidden="true" />
        <motion.span
          className="absolute top-5 left-5 h-[2px] origin-left rounded-full"
          style={{ background: W.solid, right: 20 }}
          initial={false}
          animate={{ scaleX: Math.max(done - 1, 0) / (approvers.length - 1) }}
          transition={{ duration: 0.6, ease }}
          aria-hidden="true"
        />
        <ol className="relative flex justify-between">
          {approvers.map((a, i) => {
            const ok = i < done;
            const current = i === done;
            return (
              <li key={a.role} className="flex flex-col items-center gap-2">
                <span className="relative grid size-10 place-items-center">
                  {current && playing && <span className="absolute inset-0 animate-ping-soft rounded-full" style={{ background: W.glow }} />}
                  <motion.span
                    className="relative grid size-10 place-items-center rounded-full text-[12px] font-semibold"
                    initial={false}
                    animate={ok ? { backgroundColor: W.solid, color: "#ffffff", scale: [0.85, 1.12, 1] } : { backgroundColor: "#ffffff", color: current ? W.deep : "#8c8c8c", scale: 1 }}
                    transition={{ duration: 0.45, ease }}
                    style={{ boxShadow: ok ? "none" : `inset 0 0 0 1px ${current ? W.solid : "#e8e8e8"}` }}
                  >
                    {ok ? <Check className="size-3.5" /> : a.who}
                  </motion.span>
                </span>
                <span className={`text-[11.5px] font-medium ${ok || current ? "text-ink" : "text-sub"}`}>{a.role}</span>
              </li>
            );
          })}
        </ol>
      </div>

      <div className="relative rounded-2xl bg-white p-4 shadow-[0_14px_30px_-20px_rgba(31,31,31,0.3)] ring-1 ring-line">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[11.5px] text-sub">Payment to</p>
            <p className="truncate text-[14px] font-semibold text-ink">Meridian Supplies Co.</p>
          </div>
          <p className="tabular text-[17px] font-semibold tracking-[-0.01em] text-ink">₹4,12,000</p>
        </div>
        <div className="mt-3 flex items-center gap-2">
          <span className="size-1.5 rounded-full" style={{ background: released ? "#05945b" : W.solid }} />
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={done}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.25 }}
              className="text-[12.5px] font-medium text-copy"
            >
              {statuses[done]}
            </motion.span>
          </AnimatePresence>
        </div>
        <AnimatePresence>
          {released && (
            <motion.span
              key="stamp"
              className="absolute right-4 bottom-3 rounded-md border-2 px-2 py-0.5 text-[11px] font-bold tracking-[0.16em] uppercase"
              style={{ borderColor: W.solid, color: W.solid, background: "rgba(255,255,255,0.92)" }}
              initial={playing ? { opacity: 0, scale: 1.9, rotate: -4 } : false}
              animate={{ opacity: 1, scale: 1, rotate: -10 }}
              exit={{ opacity: 0, transition: { duration: 0.2 } }}
              transition={{ type: "spring", bounce: 0.45, visualDuration: 0.35 }}
            >
              Released
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ---------- 4. Reconciliation: statement lines scroll past the match line and lock to the ledger. ---------- */

const T = ACCENTS.reconcile;
const ROW = 54;
const entries = [
  { ref: "UTR 77810", amt: 248500, gl: "Travel · Skyline" },
  { ref: "UTR 77811", amt: 86240, gl: "Travel · Aerolink" },
  { ref: "UTR 77812", amt: 412000, gl: "Capex · Meridian" },
  { ref: "UTR 77813", amt: 19800, gl: "Software · Cloud" },
  { ref: "UTR 77814", amt: 105000, gl: "Vendor · Brightline" },
  { ref: "UTR 77815", amt: 62400, gl: "Travel · Skyline" },
];

const mod = (n: number, m: number) => ((n % m) + m) % m;

function ReconArt({ playing }: { playing: boolean }) {
  const { cycle: step } = usePhaseLoop(1, 1500, playing);
  const visible = [-2, -1, 0, 1, 2].map((o) => step + o);

  return (
    <div className="absolute inset-0 flex items-stretch gap-6 px-6 md:px-8">
      <div className="relative min-w-0 flex-1 [mask-image:linear-gradient(to_bottom,transparent,#000_24%,#000_76%,transparent)]">
        <div className="absolute inset-x-0 top-1/2 h-[46px] -translate-y-1/2 rounded-xl" style={{ background: T.soft }} aria-hidden="true" />
        <AnimatePresence initial={false}>
          {visible.map((i) => {
            const e = entries[mod(i, entries.length)];
            const offset = i - step;
            const ok = offset <= 0;
            return (
              <motion.div
                key={i}
                className="absolute inset-x-0 top-1/2 -mt-[22px] grid h-[44px] grid-cols-[minmax(0,1fr)_48px_minmax(0,1fr)] items-center"
                initial={{ y: 3 * ROW, opacity: 0 }}
                animate={{ y: offset * ROW, opacity: 1 }}
                exit={{ y: -3 * ROW, opacity: 0 }}
                transition={{ type: "spring", bounce: 0.15, visualDuration: 0.7 }}
              >
                <Row ok={ok} top={e.ref} bottom={`₹${inr.format(e.amt)}`} />
                <span className="relative flex h-full items-center justify-center">
                  <span className="absolute inset-x-1 border-t border-dashed border-ghost" />
                  <motion.span
                    className="absolute inset-x-1 h-[2px] origin-left rounded-full"
                    style={{ background: T.solid }}
                    initial={false}
                    animate={{ scaleX: ok ? 1 : 0 }}
                    transition={{ duration: 0.45, ease, delay: offset === 0 ? 0.35 : 0 }}
                  />
                  <motion.span
                    className="relative grid size-5 place-items-center rounded-full text-white"
                    style={{ background: T.solid }}
                    initial={false}
                    animate={{ scale: ok ? 1 : 0 }}
                    transition={{ type: "spring", bounce: 0.5, visualDuration: 0.35, delay: offset === 0 ? 0.6 : 0 }}
                  >
                    <Check className="size-2.5" />
                  </motion.span>
                </span>
                <Row ok={ok} top={e.gl} bottom={`₹${inr.format(e.amt)}`} />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      <MatchRing step={step} />
    </div>
  );
}

function Row({ ok, top, bottom }: { ok: boolean; top: string; bottom: string }) {
  return (
    <div
      className="h-full min-w-0 rounded-lg px-3 py-1.5 transition-[background-color,box-shadow] duration-500"
      style={{ background: ok ? "#ffffff" : "#fafafa", boxShadow: `inset 0 0 0 1px ${ok ? "rgba(14,139,163,0.35)" : "#e8e8e8"}` }}
    >
      <p className="truncate text-[11px] text-sub">{top}</p>
      <p className="tabular truncate text-[13px] font-semibold text-ink">{bottom}</p>
    </div>
  );
}

function MatchRing({ step }: { step: number }) {
  const r = 44;
  const c = 2 * Math.PI * r;
  return (
    <div className="hidden w-[150px] shrink-0 flex-col items-center justify-center sm:flex">
      <div className="relative size-[120px]">
        <svg viewBox="0 0 120 120" className="size-full -rotate-90">
          <circle cx="60" cy="60" r={r} stroke="#e8e8e8" strokeWidth="8" fill="none" />
          <motion.circle
            cx="60"
            cy="60"
            r={r}
            stroke={T.solid}
            strokeWidth="8"
            strokeLinecap="round"
            fill="none"
            strokeDasharray={c}
            initial={{ strokeDashoffset: c }}
            whileInView={{ strokeDashoffset: c * (1 - 0.987) }}
            viewport={{ once: true }}
            transition={{ duration: 1.6, ease }}
          />
        </svg>
        <div className="absolute inset-0 grid place-items-center text-center">
          <div>
            <p className="tabular text-[22px] leading-none font-semibold tracking-[-0.02em] text-ink">98.7%</p>
            <p className="mt-1 text-[10.5px] text-sub">auto-matched</p>
          </div>
        </div>
      </div>
      <p className="tabular mt-3 text-[13px] font-semibold" style={{ color: T.deep }}>
        {inr.format(1284 + step)} today
      </p>
    </div>
  );
}
