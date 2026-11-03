"use client";

import { AnimatePresence, motion, useReducedMotion, type MotionValue } from "motion/react";
import { useEffect, useState } from "react";
import { LogoMark } from "@/components/ui/Logo";
import { Check, ContactlessIcon } from "@/components/ui/icons";

const ease = [0.16, 1, 0.3, 1] as const;
const PANEL = "rounded-[18px] bg-white shadow-[0_2px_4px_rgba(6,38,23,0.04),0_34px_70px_-30px_rgba(6,38,23,0.34)] ring-1 ring-black/[0.07]";
const FLOAT = "rounded-2xl bg-white/95 shadow-[0_20px_40px_-20px_rgba(6,38,23,0.35)] ring-1 ring-black/[0.06] backdrop-blur";

type Parallax = { live: boolean; nearX: MotionValue<number>; nearY: MotionValue<number>; farX: MotionValue<number> };

/** Counts how many of the given moments (ms after mount) have passed while the scene is live. */
function useSteps(live: boolean, at: readonly number[]) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!live) return;
    const ids = at.map((ms, i) => setTimeout(() => setN(i + 1), ms));
    return () => ids.forEach(clearTimeout);
  }, [live, at]);
  return n;
}

function Toggle({ on, delay = 0, accent = "#017649" }: { on: boolean; delay?: number; accent?: string }) {
  return (
    <motion.span
      className="relative flex h-[15px] w-[26px] shrink-0 items-center rounded-full px-[2px]"
      initial={false}
      animate={{ backgroundColor: on ? accent : "#e5e7e5" }}
      transition={{ duration: 0.25, delay }}
    >
      <motion.span
        className="size-[11px] rounded-full bg-white shadow-sm"
        initial={false}
        animate={{ x: on ? 11 : 0 }}
        transition={{ type: "spring", bounce: 0.35, visualDuration: 0.3, delay }}
      />
    </motion.span>
  );
}

function Tick({ delay, size = "size-3.5" }: { delay: number; size?: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.span
      initial={reduce ? false : { scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", bounce: 0.45, visualDuration: 0.3, delay }}
      className={`grid ${size} shrink-0 place-items-center rounded-full bg-brand text-white`}
    >
      <Check className="size-2" />
    </motion.span>
  );
}

/* ---------------- ODCC: an existing OD/CC limit becomes a controllable card ---------------- */

const ODCC_AT = [1500, 2700, 3900, 5300] as const;
const FLOW = "M 380 196 C 428 150, 484 146, 506 206";
const CONTROLS = [
  { name: "ECOM", scope: "Domestic", on: true },
  { name: "POS", scope: "Domestic", on: true },
  { name: "CONTACTLESS", scope: "Domestic", on: true },
  { name: "MOTO", scope: "International", on: false },
];

export function OdccScene({ live, nearX, nearY, farX }: Parallax) {
  const reduce = useReducedMotion();
  const steps = useSteps(live, ODCC_AT);
  const n = reduce ? ODCC_AT.length : steps;
  const linked = n >= 1;
  const issued = n >= 2;
  const controlled = n >= 3;
  const spent = n >= 4;

  return (
    <>
      <motion.div style={reduce ? undefined : { x: farX }} className="absolute top-[28px] left-[20px] w-[360px]">
        <div className={`${PANEL} overflow-hidden`}>
          <div className="flex items-center gap-2 border-b border-line/80 bg-[#fbfcfb] px-4 py-2.5">
            <LogoMark className="size-5" />
            <span className="text-[12.5px] font-semibold text-ink">ODCC</span>
            <span className="text-[11.5px] text-sub">· Credit facility</span>
            <span className="ml-auto flex items-center gap-1.5 text-[10.5px] font-medium">
              {linked ? (
                <span className="flex items-center gap-1 rounded-full bg-mist px-2 py-0.5 text-forest ring-1 ring-mint">
                  <span className="size-1.5 rounded-full bg-brand" />
                  Bank verified
                </span>
              ) : (
                <span className="flex items-center gap-1 text-sub">
                  <span className="size-2.5 animate-spin rounded-full border border-line border-t-brand" />
                  Verifying
                </span>
              )}
            </span>
          </div>

          <div className="px-4 py-3.5">
            <p className="text-[9.5px] font-semibold tracking-[0.08em] text-sub uppercase">Account selection</p>
            <div className="mt-1.5 flex items-center gap-2.5 rounded-xl bg-mist/70 px-3 py-2 ring-1 ring-mint">
              <span className="grid size-3.5 place-items-center rounded-full ring-[1.5px] ring-brand">
                <span className="size-1.5 rounded-full bg-brand" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="tabular block text-[12.5px] font-semibold text-ink">XXXXXXX90</span>
                <span className="block text-[10px] text-sub">Account type: OD · Scheme code: ODA001</span>
              </span>
              <span className="rounded-full bg-[#d9f7be] px-2 py-0.5 text-[9.5px] font-semibold text-forest">Eligible</span>
            </div>

            <div className="mt-2.5 flex items-center gap-2">
              <span className="grid size-6 place-items-center rounded-full bg-mint text-[9px] font-semibold text-forest">RK</span>
              <span className="text-[10.5px] text-copy">
                <span className="font-semibold text-ink">Ramesh Kumar</span> · OD/CC authorised signatory
              </span>
            </div>

            <div className="mt-2.5 flex gap-1.5">
              {["CIF validation", "OTP verified", "AML accepted"].map((c, i) => (
                <span key={c} className="flex items-center gap-1 rounded-full bg-surface px-2 py-1 text-[9.5px] font-medium text-copy ring-1 ring-line/80">
                  <Tick delay={0.35 + i * 0.35} size="size-3" />
                  {c}
                </span>
              ))}
            </div>

            <div className="mt-3.5 flex items-end justify-between">
              <span>
                <span className="block text-[10px] text-sub">Sanctioned limit</span>
                <span className="tabular block text-[24px] leading-tight font-semibold tracking-[-0.02em] text-ink">₹12.30 Cr</span>
              </span>
              <span className="text-right text-[10px] text-sub">
                Available
                <span className="tabular block text-[13px] font-semibold text-ink">{linked ? "₹2.63 Cr" : "₹7.63 Cr"}</span>
              </span>
            </div>
            <div className="mt-2 flex h-2 overflow-hidden rounded-full bg-surface ring-1 ring-line/60">
              <span className="h-full bg-forest" style={{ width: "38%" }} />
              <motion.span
                className="h-full bg-gradient-to-r from-brand to-lime"
                initial={false}
                animate={{ width: linked ? "40.6%" : "0%" }}
                transition={{ duration: 0.9, ease }}
              />
            </div>
            <div className="mt-1.5 flex gap-3 text-[9.5px] text-sub">
              <span className="flex items-center gap-1">
                <span className="size-1.5 rounded-full bg-forest" />
                Utilised ₹4.67 Cr
              </span>
              <span className="flex items-center gap-1">
                <span className="size-1.5 rounded-full bg-brand" />
                On card {linked ? "₹5 Cr" : "—"}
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      <svg viewBox="0 0 640 590" width={640} height={590} className="pointer-events-none absolute inset-0" fill="none" aria-hidden="true">
        <path d={FLOW} stroke="#03a35f" strokeOpacity={0.35} strokeWidth={1.5} strokeDasharray="3 4" strokeLinecap="round" />
        {linked && !issued && !reduce && (
          <motion.path
            d={FLOW}
            stroke="#03a35f"
            strokeWidth={3}
            strokeLinecap="round"
            style={{ filter: "drop-shadow(0 0 5px rgba(3,163,95,0.7))" }}
            initial={{ pathLength: 0.3, pathOffset: 0, opacity: 0 }}
            animate={{ pathOffset: 0.7, opacity: [0, 1, 1, 0] }}
            transition={{ duration: 0.9, ease: "easeInOut", repeat: 1 }}
          />
        )}
        <circle cx="380" cy="196" r="3.5" fill="#fff" stroke="#03a35f" strokeWidth="1.5" />
      </svg>

      <AnimatePresence>
        {controlled && (
          <motion.div
            key="request"
            style={reduce ? undefined : { x: farX }}
            initial={reduce ? false : { opacity: 0, y: -12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: "spring", bounce: 0.3, visualDuration: 0.5, delay: 0.7 }}
            className={`absolute top-[30px] right-[6px] flex w-[214px] items-center gap-2.5 p-3 ${FLOAT}`}
          >
            <span className="grid size-8 place-items-center rounded-xl bg-mist text-forest ring-1 ring-mint">
              <Check className="size-3.5" />
            </span>
            <span className="min-w-0">
              <span className="block text-[9.5px] text-sub">Card control request</span>
              <span className="block text-[12px] font-semibold text-ink">Approved by bank</span>
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div style={reduce ? undefined : { x: nearX, y: nearY }} className="absolute top-[206px] left-[384px]">
        <div className="animate-float motion-reduce:animate-none [perspective:1000px]">
          <motion.div
            className="relative h-[156px] w-[246px] -rotate-[4deg]"
            style={{ transformStyle: "preserve-3d" }}
            initial={false}
            animate={{ rotateY: issued ? 0 : 180 }}
            transition={{ type: "spring", bounce: 0.25, visualDuration: 0.9 }}
          >
            <div
              className="absolute inset-0 overflow-hidden rounded-[18px] p-4 text-white shadow-[0_30px_60px_-24px_rgba(6,38,23,0.65)]"
              style={{ backfaceVisibility: "hidden", background: "linear-gradient(140deg, #0b4a2e 0%, #062617 55%, #031a0f 100%)" }}
            >
              <svg viewBox="0 0 246 156" className="pointer-events-none absolute inset-0" fill="none" aria-hidden="true">
                {[0, 1, 2, 3].map((i) => (
                  <circle key={i} cx="-10" cy="166" r={60 + i * 30} stroke="#95DE64" strokeOpacity={0.12} />
                ))}
              </svg>
              <span className="pointer-events-none absolute inset-y-0 left-0 w-1/3 animate-shine bg-gradient-to-r from-transparent via-white/15 to-transparent motion-reduce:hidden" />
              <div className="relative flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <LogoMark tone="dark" className="size-5" />
                  <span className="text-[11px] font-semibold">PropelGo</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="rounded-full bg-lime/20 px-1.5 py-0.5 text-[8.5px] font-semibold tracking-[0.06em] text-lime">ODCC</span>
                  <ContactlessIcon className="size-4 text-white/70" />
                </span>
              </div>
              <p className="relative mt-5 text-[9.5px] text-white/60">Commercial card · linked to OD XXXXXXX90</p>
              <p className="tabular relative mt-0.5 text-[13px] tracking-[0.14em]">•••• •••• •••• 2049</p>
              <div className="relative mt-2.5 flex items-center justify-between text-[9px] text-white/70">
                <span>
                  Limit on card <span className="font-semibold text-white">₹5 Cr</span>
                </span>
                <span>09/29</span>
              </div>
            </div>
            <div
              className="absolute inset-0 flex flex-col justify-between overflow-hidden rounded-[18px] p-4 text-white"
              style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)", background: "linear-gradient(140deg, #0f5a38, #062617)" }}
            >
              <span className="-mx-4 mt-2 block h-7 bg-black/50" />
              <span className="flex items-center gap-2 text-[10px] text-white/80">
                <span className="size-3 animate-spin rounded-full border border-white/30 border-t-lime" />
                Linking OD/CC limit to card
              </span>
            </div>
          </motion.div>
        </div>
      </motion.div>

      <motion.div style={reduce ? undefined : { x: nearX }} className={`absolute top-[384px] left-[20px] w-[340px] p-3.5 ${FLOAT}`}>
        <div className="flex items-center justify-between">
          <span className="text-[11.5px] font-semibold text-ink">Card controls</span>
          <span className="font-mono text-[9.5px] text-sub">Request · CR-1042</span>
        </div>
        <div className="mt-2.5 grid grid-cols-2 gap-2">
          {CONTROLS.map((c, i) => (
            <div key={c.name} className="flex items-center justify-between rounded-xl bg-surface/70 px-2.5 py-2 ring-1 ring-line/70">
              <span>
                <span className="block text-[10px] font-semibold text-ink">{c.name}</span>
                <span className="block text-[9px] text-sub">{c.scope}</span>
              </span>
              <Toggle on={controlled && c.on} delay={i * 0.18} />
            </div>
          ))}
        </div>
      </motion.div>

      <AnimatePresence>
        {spent && (
          <motion.div
            key="spend"
            style={reduce ? undefined : { x: nearX }}
            initial={reduce ? false : { opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: "spring", bounce: 0.3, visualDuration: 0.5 }}
            className={`absolute top-[414px] left-[384px] w-[240px] p-3 ${FLOAT}`}
          >
            <div className="flex items-center gap-2.5">
              <span className="grid size-8 place-items-center rounded-full bg-mint text-[9.5px] font-semibold text-forest">AB</span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[11.5px] font-semibold text-ink">AirLink Booking</span>
                <span className="block text-[9.5px] text-sub">ECOM · Domestic · •••• 2049</span>
              </span>
              <span className="text-right">
                <span className="tabular block text-[12px] font-semibold text-ink">₹4,20,000</span>
                <span className="block text-[9.5px] font-semibold text-success">Approved</span>
              </span>
            </div>
            <div className="mt-2 flex items-center justify-between border-t border-line/70 pt-2 text-[9.5px] text-sub">
              <span>Available on card</span>
              <span className="tabular font-semibold text-ink">₹4.96 Cr</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ---------------- Orchestration: one checkout, smart routing to the best gateway ---------------- */

const GATEWAYS = [
  { name: "PayU", mark: "PU", tone: "#3a9b35", rate: 97.8 },
  { name: "Razorpay", mark: "RZ", tone: "#2b6cd8", rate: 98.4 },
  { name: "Easebuzz", mark: "EB", tone: "#e0742b", rate: 96.9 },
  { name: "PhonePe", mark: "PP", tone: "#6a3fb5", rate: 99.1 },
  { name: "JioPay", mark: "JP", tone: "#1f5fae", rate: 96.2 },
];
const GW_Y = GATEWAYS.map((_, i) => 129 + i * 58);
/** Routing order from the client guide: must-follow rules, preference rules, margin, success rate. */
const RULES = ["Must-follow rules", "Preference rules", "Margin", "Success rate"];
const PAYMENTS = [
  { method: "Card", detail: "Card •••• 4021", amount: "₹10,000", gw: 0, rule: 0, reason: "Bank rule" },
  { method: "UPI", detail: "airlink@upi", amount: "₹2,450", gw: 3, rule: 3, reason: "Best success rate" },
  { method: "NB", detail: "Net banking", amount: "₹48,000", gw: 1, rule: 2, reason: "Best margin" },
];
const PAY_MS = 2500;
const SUB_AT = [450, 850, 1550, 1950] as const;
const HUB = { x: 300, y: 245 };

function usePaymentLoop(live: boolean) {
  const [state, setState] = useState({ n: 0, sub: 0 });
  useEffect(() => {
    if (!live) return;
    let subs: ReturnType<typeof setTimeout>[] = [];
    const run = (first: boolean) => {
      if (!first) setState((s) => ({ n: s.n + 1, sub: 0 }));
      subs = SUB_AT.map((ms, i) => setTimeout(() => setState((s) => ({ ...s, sub: i + 1 })), ms));
    };
    const start = setTimeout(() => run(true), 500);
    const id = setInterval(() => run(false), PAY_MS);
    return () => {
      clearTimeout(start);
      clearInterval(id);
      subs.forEach(clearTimeout);
    };
  }, [live]);
  return state;
}

export function RoutingScene({ live, nearX, nearY, farX }: Parallax) {
  const reduce = useReducedMotion();
  const loop = usePaymentLoop(live);
  const n = loop.n % PAYMENTS.length;
  const sub = reduce ? 4 : loop.sub;
  const pay = PAYMENTS[n];
  const routed = 12480 + loop.n + (sub >= 4 ? 1 : 0);

  return (
    <>
      <motion.div style={reduce ? undefined : { x: farX }} className={`absolute top-[20px] left-[20px] flex w-[600px] items-center gap-5 px-4 py-3 ${PANEL}`}>
        <span className="flex items-center gap-2">
          <LogoMark className="size-5" />
          <span className="text-[12.5px] font-semibold text-ink">Routing console</span>
        </span>
        <span className="ml-auto flex items-center gap-1.5 text-[10.5px] text-sub">
          <span className="relative flex size-1.5">
            <span className="absolute inset-0 animate-ping-soft rounded-full bg-lime motion-reduce:hidden" />
            <span className="relative size-1.5 rounded-full bg-brand" />
          </span>
          Live
        </span>
        {[
          { l: "Success rate", v: "98.6%" },
          { l: "Avg latency", v: "182 ms" },
          { l: "Routed today", v: routed.toLocaleString("en-IN") },
        ].map((m) => (
          <span key={m.l} className="border-l border-line pl-5">
            <span className="block text-[9.5px] text-sub">{m.l}</span>
            <span className="tabular block text-[13px] font-semibold text-ink">{m.v}</span>
          </span>
        ))}
      </motion.div>

      <svg viewBox="0 0 640 590" width={640} height={590} className="pointer-events-none absolute inset-0" fill="none" aria-hidden="true">
        <path d={`M 212 ${HUB.y} L ${HUB.x - 48} ${HUB.y}`} stroke="#03a35f" strokeOpacity={0.35} strokeWidth={1.5} strokeDasharray="3 4" />
        {GW_Y.map((y, i) => (
          <path
            key={i}
            d={`M ${HUB.x + 48} ${HUB.y} C 378 ${HUB.y}, 380 ${y}, 404 ${y}`}
            stroke={i === pay.gw && sub >= 3 ? "#03a35f" : "#0e3d26"}
            strokeOpacity={i === pay.gw && sub >= 3 ? 0.6 : 0.14}
            strokeWidth={1.5}
            strokeDasharray="3 4"
          />
        ))}
        {!reduce && sub === 1 && (
          <motion.path
            key={`in-${loop.n}`}
            d={`M 212 ${HUB.y} L ${HUB.x - 48} ${HUB.y}`}
            stroke="#03a35f"
            strokeWidth={3}
            strokeLinecap="round"
            initial={{ pathLength: 0.5, pathOffset: 0, opacity: 0 }}
            animate={{ pathOffset: 0.5, opacity: [0, 1, 0] }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          />
        )}
        {!reduce && sub === 3 && (
          <motion.path
            key={`out-${loop.n}`}
            d={`M ${HUB.x + 48} ${HUB.y} C 378 ${HUB.y}, 380 ${GW_Y[pay.gw]}, 404 ${GW_Y[pay.gw]}`}
            stroke="#03a35f"
            strokeWidth={3}
            strokeLinecap="round"
            style={{ filter: "drop-shadow(0 0 4px rgba(3,163,95,0.7))" }}
            initial={{ pathLength: 0.35, pathOffset: 0, opacity: 0 }}
            animate={{ pathOffset: 0.65, opacity: [0, 1, 1, 0] }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          />
        )}
      </svg>

      <motion.div style={reduce ? undefined : { x: nearX, y: nearY }} className={`absolute top-[120px] left-[20px] w-[192px] p-3.5 ${FLOAT}`}>
        <div className="flex items-center justify-between">
          <span className="text-[11.5px] font-semibold text-ink">Checkout</span>
          <span className="text-[9.5px] text-sub">AirLink Booking</span>
        </div>
        <div className="mt-3 flex gap-1 rounded-lg bg-surface p-0.5 ring-1 ring-line/70">
          {["Card", "UPI", "NB"].map((m) => (
            <span
              key={m}
              className={`flex-1 rounded-md py-1 text-center text-[10px] font-semibold transition-colors duration-300 ${m === pay.method ? "bg-white text-ink shadow-sm ring-1 ring-line" : "text-sub"}`}
            >
              {m}
            </span>
          ))}
        </div>
        <motion.div key={n} initial={reduce ? false : { opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="mt-3">
          <span className="block text-[9.5px] text-sub">Amount</span>
          <span className="tabular block text-[20px] leading-tight font-semibold tracking-[-0.02em] text-ink">{pay.amount}</span>
          <span className="mt-1 block font-mono text-[10px] text-copy">{pay.detail}</span>
        </motion.div>
        <motion.span
          className="mt-3.5 flex h-8 items-center justify-center gap-1.5 rounded-lg text-[11px] font-semibold text-white"
          animate={{ scale: sub === 0 ? [1, 0.95, 1] : 1, backgroundColor: sub >= 4 ? "#03a35f" : "#017649" }}
          transition={{ duration: 0.35 }}
        >
          {sub >= 4 ? (
            <>
              <Check className="size-3" /> Paid
            </>
          ) : sub >= 1 ? (
            <>
              <span className="size-3 animate-spin rounded-full border border-white/40 border-t-white" /> Processing
            </>
          ) : (
            <>Pay {pay.amount}</>
          )}
        </motion.span>
      </motion.div>

      <div className="absolute" style={{ left: HUB.x - 48, top: HUB.y - 48 }}>
        <div className="relative grid size-24 place-items-center">
          <span className="absolute inset-0 animate-[spin_14s_linear_infinite] rounded-full border border-dashed border-brand/40 motion-reduce:animate-none" />
          <motion.span
            className="absolute inset-[10px] rounded-full bg-mint/60"
            animate={sub === 2 ? { scale: [1, 1.12, 1], opacity: [0.6, 1, 0.6] } : { scale: 1, opacity: 0.6 }}
            transition={{ duration: 0.7 }}
          />
          <span className="relative grid size-14 place-items-center rounded-full bg-white shadow-[0_14px_30px_-12px_rgba(6,38,23,0.45)] ring-1 ring-mint">
            <LogoMark className="size-7" />
          </span>
        </div>
        <p className="mt-1 text-center text-[10px] font-semibold text-forest">Smart routing</p>
      </div>

      <div className={`absolute top-[364px] left-[226px] w-[150px] p-2.5 ${FLOAT}`}>
        {RULES.map((r, i) => {
          const checked = sub >= 2 && i <= pay.rule;
          const hit = checked && i === pay.rule;
          return (
            <div key={r} className={`flex items-center gap-1.5 rounded-md px-1.5 py-1 text-[9.5px] ${hit ? "bg-mist font-semibold text-forest" : "text-sub"}`}>
              <motion.span
                className="size-1.5 shrink-0 rounded-full"
                initial={false}
                animate={{ backgroundColor: hit ? "#03a35f" : checked ? "#8c8c8c" : "#e5e7e5" }}
                transition={{ duration: 0.2, delay: sub === 2 ? i * 0.14 : 0 }}
              />
              {r}
            </div>
          );
        })}
        <div className="mt-1 h-[34px] border-t border-line/70 px-1.5 pt-1.5 text-[9.5px] font-semibold text-ink">
          {sub >= 2 && (
            <motion.p
              key={loop.n}
              initial={reduce ? false : { opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: reduce ? 0 : pay.rule * 0.14 + 0.15 }}
            >
              {pay.reason} → {GATEWAYS[pay.gw].name}
            </motion.p>
          )}
        </div>
      </div>

      <motion.div style={reduce ? undefined : { x: nearX }} className="absolute top-[104px] left-[404px] w-[216px] space-y-2">
        {GATEWAYS.map((g, i) => {
          const on = i === pay.gw && sub >= 3;
          const done = i === pay.gw && sub >= 4;
          return (
            <motion.div
              key={g.name}
              animate={{ x: on ? -4 : 0 }}
              transition={{ type: "spring", bounce: 0.3, visualDuration: 0.35 }}
              className={`flex h-[50px] items-center gap-2.5 rounded-xl px-3 transition-shadow duration-300 ${on ? "bg-white shadow-[0_16px_30px_-16px_rgba(6,38,23,0.5)] ring-1 ring-brand/50" : "bg-white/85 ring-1 ring-line/80"}`}
            >
              <span className="grid size-7 place-items-center rounded-lg text-[10px] font-bold text-white" style={{ backgroundColor: g.tone }}>
                {g.mark}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[11.5px] font-semibold text-ink">{g.name}</span>
                <span className="mt-0.5 block h-1 w-full overflow-hidden rounded-full bg-surface">
                  <span className="block h-full rounded-full bg-brand/60" style={{ width: `${(g.rate - 90) * 10}%` }} />
                </span>
              </span>
              <span className="w-[54px] text-right">
                {done ? (
                  <span className="flex items-center justify-end gap-1 text-[9.5px] font-semibold text-success">
                    <Tick delay={0} size="size-3" />
                    Captured
                  </span>
                ) : (
                  <span className="tabular text-[10.5px] font-medium text-copy">{g.rate}%</span>
                )}
              </span>
            </motion.div>
          );
        })}
      </motion.div>

      <AnimatePresence>
        {sub >= 4 && (
          <motion.div
            key={`ok-${loop.n}`}
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.35, ease }}
            className={`absolute top-[512px] left-[20px] flex w-[600px] items-center gap-2.5 px-3.5 py-2.5 ${FLOAT}`}
          >
            <Tick delay={0} />
            <span className="text-[11.5px] text-copy">
              <span className="font-semibold text-ink">{pay.amount}</span> {pay.method === "NB" ? "net banking" : pay.method} payment captured · result confirmed with{" "}
              <span className="font-semibold text-ink">{GATEWAYS[pay.gw].name}</span>
            </span>
            <span className="tabular ml-auto font-mono text-[10px] text-sub">{170 + n * 9} ms</span>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
