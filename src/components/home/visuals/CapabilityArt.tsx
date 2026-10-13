"use client";

import { AnimatePresence, motion } from "motion/react";
import type { CapabilityKey } from "@/content/home";
import { Check } from "@/components/ui/icons";
import { usePhaseLoop } from "@/lib/useStageScale";

const ease = [0.16, 1, 0.3, 1] as const;

export function CapabilityArt({ kind, playing }: { kind: CapabilityKey; playing: boolean }) {
  if (kind === "routing") return <RoutingArt playing={playing} />;
  if (kind === "cards") return <CardsArt playing={playing} />;
  if (kind === "workflow") return <WorkflowArt playing={playing} />;
  return <LedgerArt playing={playing} />;
}

/* 1. Rule engine: a payment is evaluated against a routing rule and drops into its lane. */
const routed = [
  { amount: "₹14,20,000", big: true },
  { amount: "₹3,60,000", big: false },
  { amount: "₹22,75,000", big: true },
  { amount: "₹88,500", big: false },
];

function RoutingArt({ playing }: { playing: boolean }) {
  // phase 0: payment arrives, 1: rule evaluates, 2: routed
  const { phase, cycle } = usePhaseLoop(3, 1100, playing);
  const p = routed[cycle % routed.length];
  const lane = p.big ? 0 : 1;
  const counts = [0, 1].map((l) => routed.slice(0, (cycle % routed.length) + (phase === 2 ? 1 : 0)).filter((r) => (r.big ? 0 : 1) === l).length);

  return (
    <div className="flex h-full flex-col items-center justify-center gap-6 px-8">
      <div className="h-11">
        <AnimatePresence mode="wait">
          {phase < 2 && (
            <motion.div
              key={cycle}
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 24, transition: { duration: 0.3 } }}
              transition={{ duration: 0.5, ease }}
              className="tabular rounded-full bg-white px-6 py-3 text-[17px] font-semibold text-ink shadow-[0_8px_20px_-10px_rgba(31,31,31,0.3)] ring-1 ring-line"
            >
              {p.amount}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="w-full max-w-[440px] rounded-2xl bg-white p-6 shadow-[0_12px_32px_-20px_rgba(31,31,31,0.18)] ring-1 ring-line">
        <p className="text-[12px] font-medium text-sub">Routing rule</p>
        <div className="mt-3 space-y-2 text-[15px]">
          <RuleRow on={phase >= 1 && p.big} label="If amount above ₹10,00,000" target="Bank A" />
          <RuleRow on={phase >= 1 && !p.big} label="Otherwise" target="Bank B" />
        </div>
      </div>

      <div className="grid w-full max-w-[440px] grid-cols-2 gap-3">
        {["Bank A", "Bank B"].map((b, i) => (
          <div key={b} className={`rounded-xl px-4 py-3 transition-colors duration-500 ${phase === 2 && lane === i ? "bg-mint" : "bg-surface"}`}>
            <p className="text-[13px] text-copy">{b}</p>
            <p className="tabular mt-0.5 text-[18px] font-semibold text-ink">{counts[i]} routed</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function RuleRow({ on, label, target }: { on: boolean; label: string; target: string }) {
  return (
    <div className={`flex items-center justify-between rounded-lg px-3 py-2.5 transition-colors duration-300 ${on ? "bg-mist ring-1 ring-mint" : "bg-surface"}`}>
      <span className={`max-sm:text-[13.5px] ${on ? "text-ink" : "text-copy"}`}>{label}</span>
      <span className={`flex shrink-0 items-center gap-1.5 font-medium whitespace-nowrap ${on ? "text-brand" : "text-sub"}`}>
        → {target}
      </span>
    </div>
  );
}

/* 2. Physical cards: a deck fans out into purpose-built cards, each with its own limit. */
const deck = [
  { purpose: "Vendor · Skyline Hotels", limit: "₹2,50,000", bg: "linear-gradient(140deg,#017649,#062617)", dark: true },
  { purpose: "Travel · Sales team", limit: "₹50,000", bg: "linear-gradient(140deg,#95DE64,#5fb83a)", dark: false },
  { purpose: "Software subscriptions", limit: "₹20,000", bg: "linear-gradient(140deg,#ffffff,#f6ffee)", dark: false },
];

function CardsArt({ playing }: { playing: boolean }) {
  // phase 0: stacked, 1..3: each card fans out, 4: hold
  const { phase } = usePhaseLoop(5, 900, playing);
  return (
    <div className="relative grid h-full place-items-center max-sm:scale-[0.58]">
      {deck.map((c, i) => {
        const out = phase > i && phase > 0;
        const angle = (i - 1) * 8;
        return (
          <motion.div
            key={c.purpose}
            className={`absolute h-[140px] w-[218px] rounded-2xl p-4 shadow-[0_18px_36px_-18px_rgba(6,38,23,0.45)] ${c.dark ? "text-white" : "text-ink ring-1 ring-line"}`}
            style={{ background: c.bg, zIndex: i }}
            initial={false}
            animate={out ? { rotate: angle, x: (i - 1) * 172, y: Math.abs(i - 1) * 16 } : { rotate: 0, x: 0, y: -i * 4 }}
            transition={{ type: "spring", stiffness: 120, damping: 16 }}
          >
            <p className={`text-[11px] ${c.dark ? "text-white/70" : "text-copy"}`}>Virtual card</p>
            <p className="mt-1 text-[13.5px] font-semibold">{c.purpose}</p>
            <div className="absolute inset-x-4 bottom-4 flex items-end justify-between">
              <div>
                <p className={`text-[10.5px] ${c.dark ? "text-white/60" : "text-sub"}`}>Limit</p>
                <p className="tabular text-[14px] font-semibold">{c.limit}</p>
              </div>
              <AnimatePresence>
                {out && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className={`rounded-full px-2 py-0.5 text-[10.5px] font-medium ${c.dark ? "bg-white/15" : "bg-white/80 text-brand"}`}
                  >
                    Active
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        );
      })}
      <p className="absolute bottom-8 text-[13px] text-sub">One card per vendor, purpose or trip</p>
    </div>
  );
}

/* 3. Approval timeline: each step checks off as the line fills downwards. */
const flow = [
  { who: "RK", role: "Maker", action: "Raised payment to Meridian Supplies" },
  { who: "AS", role: "Checker", action: "Verified invoice and vendor" },
  { who: "PV", role: "Finance head", action: "Approved within policy" },
  { who: "", role: "System", action: "Payment released on virtual card" },
];

function WorkflowArt({ playing }: { playing: boolean }) {
  const { phase } = usePhaseLoop(flow.length + 2, 950, playing);
  const done = Math.min(phase, flow.length);
  return (
    <div className="flex h-full items-center justify-center px-8">
      <ol className="relative w-full max-w-[400px]">
        <span className="absolute top-[42px] bottom-[42px] left-[19px] w-px bg-line" aria-hidden="true" />
        <motion.span
          className="absolute top-[42px] bottom-[42px] left-[19px] w-px origin-top bg-brand"
          aria-hidden="true"
          initial={false}
          animate={{ scaleY: Math.max(done - 1, 0) / (flow.length - 1) }}
          transition={{ duration: 0.6, ease }}
        />
        {flow.map((s, i) => {
          const ok = i < done;
          return (
            <li key={s.role} className="relative flex items-center gap-4 py-3">
              <span
                className={`relative z-10 grid size-10 shrink-0 place-items-center rounded-full text-[12px] font-semibold transition-colors duration-300 ${
                  ok ? "bg-brand text-white" : "bg-white text-sub ring-1 ring-line"
                }`}
              >
                {ok ? <Check className="size-3.5" /> : s.who || "₹"}
              </span>
              <div className={`flex-1 rounded-xl px-4 py-3 transition-colors duration-300 ${ok ? "bg-white ring-1 ring-line" : "bg-transparent"}`}>
                <p className="text-[12px] text-sub">{s.role}</p>
                <p className={`text-[14.5px] font-medium transition-colors ${ok ? "text-ink" : "text-sub"}`}>{s.action}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

/* 4. Reconciliation: payments on the left find their ledger entries on the right. */
const recon = [
  { ref: "PAY-2041", amt: "₹2,48,500", gl: "Travel" },
  { ref: "PAY-2042", amt: "₹86,240", gl: "Travel" },
  { ref: "PAY-2043", amt: "₹4,12,000", gl: "Equipment" },
  { ref: "PAY-2044", amt: "₹19,800", gl: "Software" },
];

function LedgerArt({ playing }: { playing: boolean }) {
  const { phase } = usePhaseLoop(recon.length + 3, 800, playing);
  const matched = Math.min(phase, recon.length);
  return (
    <div className="flex h-full flex-col justify-center px-6 md:px-10">
      <div className="grid grid-cols-[1fr_44px_1fr] text-[12px] font-medium text-sub">
        <span>Payments</span>
        <span />
        <span>Ledger</span>
      </div>
      <div className="mt-3 space-y-2.5">
        {recon.map((r, i) => {
          const ok = i < matched;
          return (
            <div key={r.ref} className="grid grid-cols-[1fr_44px_1fr] items-center">
              <div className={`rounded-lg px-3 py-2.5 transition-colors duration-300 ${ok ? "bg-mist ring-1 ring-mint" : "bg-white ring-1 ring-line"}`}>
                <p className="tabular text-[12px] text-sub">{r.ref}</p>
                <p className="tabular text-[14px] font-semibold text-ink">{r.amt}</p>
              </div>
              <div className="relative flex h-full items-center justify-center">
                <motion.span
                  className="absolute inset-x-1 h-px origin-left bg-brand"
                  initial={false}
                  animate={{ scaleX: ok ? 1 : 0 }}
                  transition={{ duration: 0.4, ease }}
                />
                <motion.span
                  className="relative grid size-5 place-items-center rounded-full bg-brand text-white"
                  initial={false}
                  animate={{ scale: ok ? 1 : 0 }}
                  transition={{ duration: 0.3, ease, delay: 0.2 }}
                >
                  <Check className="size-2.5" />
                </motion.span>
              </div>
              <div className={`rounded-lg px-3 py-2.5 transition-colors duration-300 ${ok ? "bg-mist ring-1 ring-mint" : "bg-white ring-1 ring-line"}`}>
                <p className="text-[12px] text-sub">{r.gl}</p>
                <p className="tabular text-[14px] font-semibold text-ink">{r.amt}</p>
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-5 flex items-center justify-between rounded-lg bg-white px-4 py-3 ring-1 ring-line">
        <span className="text-[13px] text-copy">Matched automatically</span>
        <span className="tabular text-[15px] font-semibold text-ink">
          {matched}/{recon.length}
        </span>
      </div>
    </div>
  );
}
