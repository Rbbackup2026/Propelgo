"use client";

import { AnimatePresence, animate, motion, useInView, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import { useEffect, useState } from "react";
import { LogoMark } from "@/components/ui/Logo";
import { Check, ContactlessIcon } from "@/components/ui/icons";
import { useStageScale } from "@/lib/useStageScale";

const inr = new Intl.NumberFormat("en-IN");
const ease = [0.16, 1, 0.3, 1] as const;

const payments = [
  { tab: "Hotel", vendor: "Skyline Hotels Pvt Ltd", purpose: "Team travel, Mumbai", amount: 248500, last4: "4021", approvers: ["RK", "AS"] },
  { tab: "Airline", vendor: "Aerolink Travels", purpose: "Client visit, Bengaluru", amount: 86240, last4: "7713", approvers: ["MS", "AS"] },
  { tab: "Supplier", vendor: "Meridian Supplies Co.", purpose: "Office equipment, Q3", amount: 412000, last4: "3390", approvers: ["RK", "PV"] },
];

/** Steps the slip prints through: vendor, amount, card, approval 1, approval 2, paid. */
const STEPS = 6;
const STEP_MS = 650;
const HOLD_MS = 2600;

const STAGE_H = 600;

export function HeroSlip() {
  const { ref, width } = useStageScale<HTMLDivElement>(560);
  // Phones get a narrower stacked stage so the slip stays readable.
  const compact = width > 0 && width < 480;
  const stageW = compact ? 380 : 560;
  const scale = width ? Math.min(1, width / stageW) : 1;
  const inView = useInView(ref, { margin: "-10% 0px" });
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [rawStep, setStep] = useState(0);
  const [auto, setAuto] = useState(true);
  const step = reduce ? STEPS : rawStep;

  useEffect(() => {
    if (!inView || reduce) return;
    if (step < STEPS) {
      const t = setTimeout(() => setStep((s) => s + 1), step === 0 ? 500 : STEP_MS);
      return () => clearTimeout(t);
    }
    if (!auto) return;
    const t = setTimeout(() => {
      setIndex((i) => (i + 1) % payments.length);
      setStep(0);
    }, HOLD_MS);
    return () => clearTimeout(t);
  }, [step, inView, auto, reduce]);

  const choose = (i: number) => {
    setAuto(false);
    setIndex(i);
    setStep(0);
  };

  const p = payments[index];

  // Gentle pointer tilt on the card.
  const rx = useSpring(useMotionValue(0), { stiffness: 120, damping: 16 });
  const ry = useSpring(useMotionValue(0), { stiffness: 120, damping: 16 });
  const onMove = (e: React.PointerEvent) => {
    if (reduce || e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    ry.set(((e.clientX - r.left) / r.width - 0.5) * 10);
    rx.set(-((e.clientY - r.top) / r.height - 0.5) * 8);
  };
  const onLeave = () => {
    rx.set(0);
    ry.set(0);
  };

  return (
    <div ref={ref} className="relative w-full" style={{ height: STAGE_H * scale }}>
      <div
        className="absolute top-0 left-0 origin-top-left"
        style={{ width: stageW, height: STAGE_H, transform: `scale(${scale})` }}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
      >
        <div className="absolute inset-0 overflow-hidden rounded-[32px] bg-mist" aria-hidden="true">
          <div className="absolute top-[60px] right-[-60px] size-[320px] rounded-full bg-mint/70 blur-3xl" />
        </div>

        {/* Card */}
        <motion.div
          className={`absolute [perspective:1200px] ${compact ? "top-[28px] left-[18px]" : "top-[44px] left-[28px]"}`}
          initial={reduce ? false : { opacity: 0, y: 30, rotate: -10 }}
          animate={{ opacity: 1, y: 0, rotate: compact ? -4 : -6 }}
          transition={{ duration: 1.1, ease, delay: 0.25 }}
        >
          <motion.div style={{ rotateX: rx, rotateY: ry }} className="preserve-3d">
            <CommercialCard last4={p.last4} vendor={p.vendor} />
          </motion.div>
        </motion.div>

        {/* Slip */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease, delay: 0.5 }}
          className={`absolute w-[310px] rounded-2xl ${compact ? "top-[206px] left-[35px]" : "top-[236px] right-[28px]"} bg-white p-5 shadow-[0_1px_2px_rgba(31,31,31,0.06),0_24px_48px_-20px_rgba(6,38,23,0.22)] ring-1 ring-line`}
        >
          <div role="tablist" aria-label="Example payments" className="flex gap-1 rounded-full bg-surface p-1">
            {payments.map((pay, i) => (
              <button
                key={pay.tab}
                type="button"
                role="tab"
                aria-selected={i === index}
                onClick={() => choose(i)}
                className={`relative flex-1 rounded-full py-1.5 text-[12.5px] font-medium transition-colors ${
                  i === index ? "text-ink" : "text-sub hover:text-copy"
                }`}
              >
                {i === index && (
                  <motion.span layoutId="slip-tab" className="absolute inset-0 rounded-full bg-white shadow-[0_1px_3px_rgba(31,31,31,0.12)]" transition={{ duration: 0.4, ease }} />
                )}
                <span className="relative">{pay.tab}</span>
              </button>
            ))}
          </div>

          <div className="mt-5">
            <AnimatePresence mode="wait">
              <motion.div key={index} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                <Line show={step >= 1}>
                  <p className="text-[12px] text-sub">Payment to</p>
                  <p className="mt-0.5 text-[16px] font-semibold tracking-[-0.01em] text-ink">{p.vendor}</p>
                  <p className="text-[12.5px] text-copy">{p.purpose}</p>
                </Line>

                <div className="mt-4 space-y-2.5 border-t border-dashed border-line pt-4 text-[13px]">
                  <Row show={step >= 2} label="Amount">
                    <Amount value={p.amount} run={step >= 2} />
                  </Row>
                  <Row show={step >= 3} label="Virtual card">
                    <span className="tabular text-ink">•••• {p.last4}</span>
                  </Row>
                  <Row show={step >= 4} label="Approvals">
                    <span className="flex items-center gap-1.5">
                      {p.approvers.map((a, i) => (
                        <span
                          key={a}
                          className={`grid size-6 place-items-center rounded-full text-[10px] font-semibold transition-colors duration-300 ${
                            step >= 4 + i ? "bg-mint text-forest" : "bg-surface text-sub"
                          }`}
                        >
                          {a}
                        </span>
                      ))}
                      <span className="tabular ml-1 text-ink">{Math.min(2, Math.max(0, step - 3))}/2</span>
                    </span>
                  </Row>
                </div>

                <div className="mt-5 flex items-center justify-between rounded-xl bg-surface px-3.5 py-3">
                  <span className="text-[12.5px] text-copy">Status</span>
                  <AnimatePresence mode="wait" initial={false}>
                    {step >= STEPS ? (
                      <motion.span
                        key="paid"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.35, ease }}
                        className="flex items-center gap-1.5 rounded-full bg-success px-2.5 py-1 text-[12px] font-semibold text-white"
                      >
                        <Check className="size-3" /> Paid
                      </motion.span>
                    ) : (
                      <motion.span key="pending" exit={{ opacity: 0 }} className="flex items-center gap-2 text-[12.5px] font-medium text-copy">
                        <span className="size-1.5 animate-pulse rounded-full bg-lime" />
                        {step >= 5 ? "Releasing payment" : step >= 4 ? "Awaiting approval" : "Preparing"}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Ledger note */}
        <AnimatePresence>
          {step >= STEPS && (
            <motion.p
              key={`ledger-${index}`}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease, delay: 0.3 }}
              className={`absolute flex ${compact ? "bottom-[10px] left-[35px]" : "bottom-[64px] left-[44px]"} items-center gap-2 text-[13px] font-medium text-forest`}
            >
              <span className="grid size-5 place-items-center rounded-full bg-white text-brand ring-1 ring-mint">
                <Check className="size-2.5" />
              </span>
              Matched to ledger
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function Line({ show, children }: { show: boolean; children: React.ReactNode }) {
  return (
    <motion.div initial={false} animate={show ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }} transition={{ duration: 0.4, ease }}>
      {children}
    </motion.div>
  );
}

function Row({ show, label, children }: { show: boolean; label: string; children: React.ReactNode }) {
  return (
    <motion.div
      initial={false}
      animate={show ? { opacity: 1, x: 0 } : { opacity: 0, x: -6 }}
      transition={{ duration: 0.4, ease }}
      className="flex h-6 items-center justify-between"
    >
      <span className="text-copy">{label}</span>
      {children}
    </motion.div>
  );
}

function Amount({ value, run }: { value: number; run: boolean }) {
  const mv = useMotionValue(0);
  const text = useTransform(mv, (v) => `₹${inr.format(Math.round(v))}`);
  useEffect(() => {
    if (!run) {
      mv.set(0);
      return;
    }
    const c = animate(mv, value, { duration: 0.9, ease });
    return () => c.stop();
  }, [run, value, mv]);
  return <motion.span className="tabular font-semibold text-ink">{text}</motion.span>;
}

export function CommercialCard({ last4, vendor, className = "" }: { last4: string; vendor?: string; className?: string }) {
  return (
    <div
      className={`relative h-[218px] w-[344px] overflow-hidden rounded-[18px] p-6 text-white shadow-[0_30px_60px_-24px_rgba(6,38,23,0.55)] ${className}`}
      style={{ background: "linear-gradient(140deg, #017649 0%, #035436 48%, #062617 100%)" }}
    >
      <div className="pointer-events-none absolute -top-24 -right-16 size-64 rounded-full bg-white/[0.07]" aria-hidden="true" />
      <div className="pointer-events-none absolute -bottom-28 -left-10 size-56 rounded-full bg-lime/[0.08]" aria-hidden="true" />
      <div className="relative flex items-start justify-between">
        <div className="flex items-center gap-2">
          <LogoMark className="size-7" />
          <span className="text-[14px] font-semibold tracking-[-0.01em]">PropelGo</span>
        </div>
        <ContactlessIcon className="size-5 text-white/70" />
      </div>
      <div className="relative mt-7 h-8 w-11 rounded-md bg-gradient-to-br from-[#e9e3c8] to-[#b9ae84] opacity-90" aria-hidden="true" />
      <div className="relative mt-5 flex items-end justify-between">
        <div>
          <AnimatePresence mode="wait" initial={false}>
            <motion.p
              key={vendor ?? "card"}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.3 }}
              className="text-[11.5px] text-white/65"
            >
              {vendor ? `Issued for ${vendor}` : "Commercial card"}
            </motion.p>
          </AnimatePresence>
          <p className="tabular mt-1 text-[17px] font-medium tracking-[0.08em]">•••• •••• •••• {last4}</p>
        </div>
        <span className="text-[15px] font-bold tracking-[-0.02em] text-white/90 italic">VISA</span>
      </div>
    </div>
  );
}
