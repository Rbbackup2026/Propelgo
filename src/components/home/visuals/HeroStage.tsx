"use client";

import {
  AnimatePresence,
  animate,
  motion,
  useInView,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from "motion/react";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { LogoMark } from "@/components/ui/Logo";
import { Check, ContactlessIcon } from "@/components/ui/icons";
import { usePreloaderDone } from "@/lib/preloader";
import { useStageScale } from "@/lib/useStageScale";
import { HeroRails } from "./HeroRails";

const W = 580;
const H = 600;
const CYCLE_MS = 3600;
const ease = [0.16, 1, 0.3, 1] as const;
const inr = new Intl.NumberFormat("en-IN");

const payments = [
  { vendor: "Skyline Hotels Pvt Ltd", purpose: "Team travel, Mumbai", amount: 248500, last4: "4021", approvers: ["RK", "AS"] },
  { vendor: "Aerolink Travels", purpose: "Client visit, Bengaluru", amount: 86240, last4: "7713", approvers: ["MS", "AS"] },
  { vendor: "Meridian Supplies Co.", purpose: "Office equipment, Q3", amount: 412000, last4: "3390", approvers: ["RK", "PV"] },
];

type Pointer = { mx: MotionValue<number>; my: MotionValue<number> };

const BASE = 0.45;

const panel = "rounded-2xl bg-white shadow-[0_1px_2px_rgba(6,38,23,0.06),0_28px_56px_-24px_rgba(6,38,23,0.28)] ring-1 ring-black/[0.05]";

const INDIGO = "#5b57d9";
const TEAL = "#0e8ba3";
const AMBER = "#d9822b";

/** Approver avatars: [tint, ink] per position when accents are on. */
const APPROVER_TONES = [
  ["#e6e5fd", INDIGO],
  ["#fdecd6", "#a85f16"],
] as const;

/** True on Direction A, which tints the small details in the wider palette; Direction B stays brand green. */
const Accent = createContext(false);

export type StageVariant = "payments" | "dashboard";

export function HeroStage({
  mx,
  my,
  ready,
  rails = true,
  accents = true,
  variant = "payments",
}: Pointer & { ready: boolean; rails?: boolean; accents?: boolean; variant?: StageVariant }) {
  const { ref, scale } = useStageScale<HTMLDivElement>(W);
  const inView = useInView(ref);
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const count = variant === "dashboard" ? vendors.length : payments.length;

  useEffect(() => {
    if (!inView || reduce || !ready) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % count), CYCLE_MS);
    return () => clearInterval(t);
  }, [inView, reduce, ready, count]);

  const p = payments[index % payments.length];

  if (variant === "dashboard") {
    const v = vendors[index];
    return (
      <div ref={ref} className="relative w-full" style={{ height: H * scale }} aria-hidden="true">
        <div className="absolute top-0 left-0 origin-top-left" style={{ width: W, height: H, transform: `scale(${scale})` }}>
          <div className="absolute top-[150px] left-[90px] size-[400px] rounded-full bg-[radial-gradient(circle,rgba(149,222,100,0.28),transparent_65%)]" />
          {rails && <HeroRails animate={!reduce} ready={ready} />}

          <Depth mx={mx} my={my} depth={10} delay={0.35} className="absolute top-[150px] left-[150px]">
            <ParentCard />
          </Depth>

          <MainCard mx={mx} my={my} last4={v.last4} vendor={v.name} reduce={!!reduce} ready={ready} virtual />

          <Depth mx={mx} my={my} depth={46} delay={0.75} className="absolute top-[64px] left-[328px]">
            <VendorSpend index={index} run={!reduce} />
          </Depth>

          <Depth mx={mx} my={my} depth={30} delay={0.95} className="absolute top-[452px] left-[16px]">
            <PendingApprovals />
          </Depth>

          <Depth mx={mx} my={my} depth={54} delay={1.1} className="absolute top-[438px] left-[336px]">
            <SpendOverview />
          </Depth>

          <Depth mx={mx} my={my} depth={64} delay={0.6} className="absolute top-[104px] left-[28px]">
            <div className={`${panel} flex items-center gap-2.5 rounded-full py-2 pr-4 pl-2.5`}>
              <span className="relative grid size-6 place-items-center">
                <span className="absolute inset-0 animate-ping-soft rounded-full bg-[#95de64]" />
                <span className="relative size-2.5 rounded-full bg-brand" />
              </span>
              <span className="text-[12.5px] font-medium text-ink">
                <span className="tabular font-semibold">240</span> cards
              </span>
              <span className="tabular text-[11.5px] font-semibold text-[#05945b]">↑ 12.5%</span>
            </div>
          </Depth>
        </div>
      </div>
    );
  }

  return (
    <Accent.Provider value={accents}>
      <div ref={ref} className="relative w-full" style={{ height: H * scale }} aria-hidden="true">
        <div className="absolute top-0 left-0 origin-top-left" style={{ width: W, height: H, transform: `scale(${scale})` }}>
          <div
            className={`absolute top-[150px] left-[90px] size-[400px] rounded-full ${rails ? "bg-[radial-gradient(circle,rgba(149,222,100,0.28),transparent_65%)]" : "bg-[radial-gradient(circle,rgba(149,222,100,0.55),transparent_65%)]"}`}
          />
          {rails ? <HeroRails animate={!reduce} ready={ready} /> : <Orbits animateDots={!reduce} ready={ready} />}

          <Depth mx={mx} my={my} depth={10} delay={0.35} className="absolute top-[150px] left-[150px]">
            <div className="relative h-[226px] w-[360px] rotate-[14deg] rounded-[22px] bg-[linear-gradient(135deg,#d9f7be_0%,#95de64_55%,#5fc77d_100%)] shadow-[0_30px_60px_-30px_rgba(6,38,23,0.35)]">
              <div className="absolute inset-0 rounded-[22px] bg-[repeating-linear-gradient(115deg,rgba(255,255,255,0.18)_0_2px,transparent_2px_14px)]" />
            </div>
          </Depth>

          <MainCard mx={mx} my={my} last4={p.last4} vendor={p.vendor} reduce={!!reduce} ready={ready} />

          <Depth mx={mx} my={my} depth={46} delay={0.75} className="absolute top-[64px] left-[328px]">
            <PaymentToast index={index} vendor={p.vendor} amount={p.amount} run={!reduce} />
          </Depth>

          <Depth mx={mx} my={my} depth={30} delay={0.95} className="absolute top-[452px] left-[16px]">
            <Approvals index={index} approvers={p.approvers} />
          </Depth>

          <Depth mx={mx} my={my} depth={54} delay={1.1} className="absolute top-[438px] left-[336px]">
            <Settlement />
          </Depth>

          <Depth mx={mx} my={my} depth={64} delay={0.6} className="absolute top-[104px] left-[28px]">
            <div className={`${panel} flex items-center gap-2.5 rounded-full py-2 pr-4 pl-2.5`}>
              <span className="relative grid size-6 place-items-center">
                <span className="absolute inset-0 animate-ping-soft rounded-full" style={{ backgroundColor: accents ? "#a9a6f5" : "#95de64" }} />
                <span className="relative size-2.5 rounded-full" style={{ backgroundColor: accents ? INDIGO : "#017649" }} />
              </span>
              <span className="text-[12.5px] font-medium text-ink">Virtual card</span>
            </div>
          </Depth>
        </div>
      </div>
    </Accent.Provider>
  );
}

function Depth({ mx, my, depth, delay = 0, className, children }: Pointer & { depth: number; delay?: number; className?: string; children: ReactNode }) {
  const reduce = useReducedMotion();
  const ready = usePreloaderDone() || !!reduce;
  const x = useTransform(mx, [-0.5, 0.5], [-depth, depth]);
  const y = useTransform(my, [-0.5, 0.5], [-depth * 0.7, depth * 0.7]);
  return (
    <motion.div style={{ x, y }} className={className}>
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 28, scale: 0.94 }}
        animate={ready ? { opacity: 1, y: 0, scale: 1 } : undefined}
        transition={{ type: "spring", bounce: 0.15, visualDuration: 0.8, delay: BASE + delay }}
      >
        {ready && children}
      </motion.div>
    </motion.div>
  );
}

function MainCard({
  mx,
  my,
  last4,
  vendor,
  reduce,
  ready,
  virtual = false,
}: Pointer & { last4: string; vendor: string; reduce: boolean; ready: boolean; virtual?: boolean }) {
  const rotateX = useTransform(my, [-0.5, 0.5], [16, -16]);
  const rotateY = useTransform(mx, [-0.5, 0.5], [-20, 20]);
  const x = useTransform(mx, [-0.5, 0.5], [-22, 22]);
  const y = useTransform(my, [-0.5, 0.5], [-16, 16]);
  const sheenX = useTransform(mx, [-0.5, 0.5], [0, 100]);
  const sheenY = useTransform(my, [-0.5, 0.5], [0, 100]);
  const sheen = useMotionTemplate`radial-gradient(circle at ${sheenX}% ${sheenY}%, rgba(255,255,255,0.32), transparent 52%)`;

  return (
    <motion.div style={{ x, y }} className="absolute top-[196px] left-[110px] [perspective:1100px]">
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 90, rotateX: 55, rotateZ: -18 }}
        animate={ready ? { opacity: 1, y: 0, rotateX: 0, rotateZ: -7 } : undefined}
        transition={{ type: "spring", bounce: 0.2, visualDuration: 1.1, delay: BASE + 0.2 }}
        className="preserve-3d"
      >
        <div className="animate-float motion-reduce:animate-none">
          <motion.div style={{ rotateX, rotateY }} className="preserve-3d">
            {virtual ? (
              <VirtualCardFace vendor={vendor} last4={last4} sheen={sheen} />
            ) : (
            <div
              className="relative h-[226px] w-[360px] overflow-hidden rounded-[22px] p-6 text-white shadow-[0_50px_90px_-30px_rgba(6,38,23,0.65)]"
              style={{ background: "linear-gradient(135deg, #03b468 0%, #017649 36%, #04452b 72%, #062617 100%)" }}
            >
              <svg viewBox="0 0 360 226" className="pointer-events-none absolute inset-0" fill="none">
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <circle key={i} cx="330" cy="-10" r={70 + i * 34} stroke="white" strokeOpacity={0.07} />
                ))}
              </svg>
              <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 animate-shine bg-gradient-to-r from-transparent via-white/20 to-transparent motion-reduce:hidden" />
              <motion.div className="pointer-events-none absolute inset-0" style={{ background: sheen }} />

              <div className="relative flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <LogoMark tone="dark" className="size-7" />
                  <span className="text-[14px] font-semibold tracking-[-0.01em]">PropelGo</span>
                </div>
                <ContactlessIcon className="size-5 text-white/75" />
              </div>
              <Chip />
              <div className="relative mt-5 flex items-end justify-between">
                <div className="min-w-0">
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.p
                      key={vendor}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      transition={{ duration: 0.3 }}
                      className="truncate text-[11.5px] text-white/65"
                    >
                      Issued for {vendor}
                    </motion.p>
                  </AnimatePresence>
                  <p className="tabular mt-1 text-[17px] font-medium tracking-[0.08em] whitespace-nowrap">•••• •••• •••• {last4}</p>
                </div>
                <span className="ml-3 shrink-0 rounded-full bg-white/12 px-2.5 py-1 text-[11px] font-medium text-white/85 ring-1 ring-white/20">
                  Commercial card
                </span>
              </div>
            </div>
            )}
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function Chip() {
  return (
    <div className="relative mt-6 h-[34px] w-[46px] overflow-hidden rounded-[7px] bg-gradient-to-br from-[#f1ecd2] via-[#d8cc9c] to-[#b5a874]">
      <div className="absolute inset-x-0 top-1/2 h-px bg-black/15" />
      <div className="absolute inset-y-0 left-1/3 w-px bg-black/15" />
      <div className="absolute inset-y-0 right-1/3 w-px bg-black/15" />
      <div className="absolute top-1/2 left-1/2 h-[14px] w-[12px] -translate-x-1/2 -translate-y-1/2 rounded-[3px] border border-black/15" />
    </div>
  );
}

function PaymentToast({ index, vendor, amount, run }: { index: number; vendor: string; amount: number; run: boolean }) {
  const accents = useContext(Accent);
  return (
    <div className={`${panel} w-[236px] overflow-hidden p-4`}>
      <div className="flex items-center gap-3">
        <span className="relative grid size-9 shrink-0 place-items-center rounded-full bg-brand text-white">
          <Check className="size-3.5" />
        </span>
        <div className="min-w-0">
          <p className="text-[11.5px] text-sub">Payment to</p>
          <AnimatePresence mode="wait" initial={false}>
            <motion.p
              key={index}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.3, ease }}
              className="truncate text-[13.5px] font-semibold tracking-[-0.01em] text-ink"
            >
              {vendor}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
      <div className="mt-3 flex items-end justify-between">
        <Amount value={amount} run={run} />
        <span className="flex items-center gap-1 rounded-full bg-mint px-2 py-0.5 text-[11px] font-semibold text-forest">
          <Check className="size-2.5" /> Paid
        </span>
      </div>
      <div className="mt-3.5 h-1 overflow-hidden rounded-full bg-surface">
        <motion.div
          key={index}
          className={`h-full origin-left rounded-full bg-gradient-to-r ${accents ? "from-lime via-[#0e8ba3] to-[#5b57d9]" : "from-lime to-brand"}`}
          initial={run ? { scaleX: 0 } : false}
          animate={{ scaleX: 1 }}
          transition={{ duration: CYCLE_MS / 1000, ease: "linear" }}
        />
      </div>
    </div>
  );
}

function Amount({ value, run }: { value: number; run: boolean }) {
  const mv = useMotionValue(run ? 0 : value);
  const text = useTransform(() => `₹${inr.format(Math.round(mv.get()))}`);
  useEffect(() => {
    if (!run) {
      mv.set(value);
      return;
    }
    const c = animate(mv, value, { duration: 1.1, ease });
    return () => c.stop();
  }, [run, value, mv]);
  return <motion.span className="tabular text-[22px] leading-none font-semibold tracking-[-0.02em] text-ink">{text}</motion.span>;
}

function Approvals({ index, approvers }: { index: number; approvers: string[] }) {
  const accents = useContext(Accent);
  return (
    <div className={`${panel} w-[218px] p-4`}>
      <div className="flex items-center justify-between">
        <p className="text-[11.5px] text-sub">Approvals</p>
      </div>
      <div key={index} className="mt-3 flex items-center gap-2">
        {approvers.map((a, i) => {
          const [tint, ink] = accents ? APPROVER_TONES[i % APPROVER_TONES.length] : ["#d9f7be", "#062617"];
          const badge = accents ? APPROVER_TONES[i % APPROVER_TONES.length][1] : "#017649";
          return (
            <motion.span
              key={a}
              initial={{ backgroundColor: "#fafafa", color: "#8c8c8c" }}
              animate={{ backgroundColor: tint, color: ink }}
              transition={{ duration: 0.4, delay: 0.5 + i * 0.6 }}
              className="relative grid size-8 place-items-center rounded-full text-[11px] font-semibold ring-2 ring-white"
            >
              {a}
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", bounce: 0.3, visualDuration: 0.35, delay: 0.7 + i * 0.6 }}
                className="absolute -right-1 -bottom-1 grid size-4 place-items-center rounded-full text-white ring-2 ring-white"
                style={{ backgroundColor: badge }}
              >
                <Check className="size-2" />
              </motion.span>
            </motion.span>
          );
        })}
        <div className="ml-2 h-1.5 flex-1 overflow-hidden rounded-full bg-surface">
          <motion.div
            className={`h-full origin-left rounded-full ${accents ? "bg-gradient-to-r from-[#5b57d9] to-[#d9822b]" : "bg-brand"}`}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.4, ease, delay: 0.5 }}
          />
        </div>
      </div>
    </div>
  );
}

const spark = "M0 44 C 18 40, 26 30, 42 32 S 70 18, 88 22 S 118 8, 136 14 S 168 4, 196 2";

function Settlement() {
  const accents = useContext(Accent);
  const end = accents ? INDIGO : "#017649";
  return (
    <div className={`${panel} w-[224px] p-4`}>
      <div className="flex items-center justify-between">
        <p className="text-[11.5px] text-sub">Status</p>
        <span className="size-1.5 animate-pulse rounded-full" style={{ backgroundColor: accents ? TEAL : "#95de64" }} />
      </div>
      <p className="mt-1 flex items-center gap-1.5 text-[13.5px] font-semibold text-ink">
        <span className="grid size-4 place-items-center rounded-full bg-mint text-brand">
          <Check className="size-2.5" />
        </span>
        Matched to ledger
      </p>
      <svg viewBox="0 0 196 50" className="mt-3 w-full overflow-visible" fill="none">
        <defs>
          <linearGradient id="spark-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={accents ? "#6fd0de" : "#95DE64"} stopOpacity="0.4" />
            <stop offset="100%" stopColor={accents ? "#a9a6f5" : "#95DE64"} stopOpacity="0" />
          </linearGradient>
          <linearGradient id="spark-stroke" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#017649" />
            <stop offset="55%" stopColor={accents ? TEAL : "#017649"} />
            <stop offset="100%" stopColor={end} />
          </linearGradient>
        </defs>
        <motion.path
          d={`${spark} L196 50 L0 50 Z`}
          fill="url(#spark-fill)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.8 }}
        />
        <motion.path
          d={spark}
          stroke="url(#spark-stroke)"
          strokeWidth="2"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.6, ease, delay: 1.2 }}
        />
        {accents && (
          <circle cx="196" cy="2" r="3.5" fill="none" stroke={end} strokeWidth="1.5">
            <animate attributeName="r" values="3.5;10" dur="2s" begin="2.8s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.7;0" dur="2s" begin="2.8s" repeatCount="indefinite" />
          </circle>
        )}
        <motion.circle cx="196" cy="2" r="3.5" fill={end} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 2.6 }} />
      </svg>
    </div>
  );
}

/* ---------- Direction B: details from the Versa dashboard (vendor spend summary, approvals, spend overview). ---------- */

const vendors: { name: string; category: string; spend: number; last4: string }[] = [
  { name: "RoadRider Fleet Management", category: "Ground transport", spend: 1840000, last4: "5678" },
  { name: "StayEase Hospitality Solutions", category: "Hospitality", spend: 1670000, last4: "4021" },
  { name: "AirLink Booking Services", category: "Travel bookings", spend: 1520000, last4: "7713" },
];

function VirtualCardFace({ vendor, last4, sheen }: { vendor: string; last4: string; sheen: MotionValue<string> }) {
  return (
    <div
      className="relative h-[226px] w-[360px] overflow-hidden rounded-[22px] p-6 text-white shadow-[0_50px_90px_-30px_rgba(0,0,0,0.7)] ring-1 ring-white/10"
      style={{ background: "linear-gradient(150deg, #2c2f2e 0%, #121413 48%, #050505 100%)" }}
    >
      <div className="pointer-events-none absolute -bottom-[120px] -left-[60px] h-[220px] w-[480px] rounded-[50%] bg-[radial-gradient(closest-side,rgba(255,255,255,0.16),transparent)]" />
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 animate-shine bg-gradient-to-r from-transparent via-white/10 to-transparent motion-reduce:hidden" />
      <motion.div className="pointer-events-none absolute inset-0" style={{ background: sheen }} />
      <LogoMark tone="dark" className="absolute top-1/2 right-7 size-[92px] -translate-y-1/2 opacity-95" />

      <div className="relative flex items-center gap-3">
        <span className="text-[13px] font-medium text-white/80">Virtual card</span>
        <ContactlessIcon className="size-4 text-white/60" />
      </div>

      <div className="absolute inset-x-6 bottom-6 flex items-end justify-between">
        <div className="min-w-0 pr-3">
          <p className="text-[11px] text-white/50">Sent to vendor</p>
          <AnimatePresence mode="wait" initial={false}>
            <motion.p
              key={vendor}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.3 }}
              className="max-w-[210px] truncate text-[13.5px] font-medium"
            >
              {vendor}
            </motion.p>
          </AnimatePresence>
          <p className="tabular mt-1.5 text-[15px] tracking-[0.12em] text-white/85">•••• {last4}</p>
        </div>
      </div>
    </div>
  );
}

function ParentCard() {
  return (
    <div className="relative h-[226px] w-[360px] rotate-[14deg] overflow-hidden rounded-[22px] p-5 shadow-[0_30px_60px_-30px_rgba(6,38,23,0.4)]" style={{ background: "linear-gradient(135deg,#03b468 0%,#017649 55%,#04452b 100%)" }}>
      <div className="absolute inset-0 bg-[repeating-linear-gradient(115deg,rgba(255,255,255,0.08)_0_2px,transparent_2px_14px)]" />
      <div className="relative flex justify-end">
        <span className="rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-medium text-white/90 ring-1 ring-white/20">Parent card · Airlines</span>
      </div>
    </div>
  );
}

function VendorSpend({ index, run }: { index: number; run: boolean }) {
  const v = vendors[index];
  return (
    <div className={`${panel} w-[236px] overflow-hidden p-4`}>
      <div className="flex items-center justify-between">
        <p className="text-[11.5px] text-sub">Vendor spend</p>
        <span className="flex items-center gap-1 rounded-full bg-mint px-2 py-0.5 text-[11px] font-semibold text-forest">
          <Check className="size-2.5" /> Settled
        </span>
      </div>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div key={index} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.3, ease }}>
          <p className="mt-2 truncate text-[13.5px] font-semibold tracking-[-0.01em] text-ink">{v.name}</p>
          <p className="text-[11.5px] text-sub">{v.category}</p>
        </motion.div>
      </AnimatePresence>
      <div className="mt-2.5">
        <Amount value={v.spend} run={run} />
      </div>
      <div className="mt-3 h-1 overflow-hidden rounded-full bg-surface">
        <motion.div
          key={index}
          className="h-full origin-left rounded-full bg-gradient-to-r from-lime to-brand"
          initial={run ? { scaleX: 0 } : false}
          animate={{ scaleX: 1 }}
          transition={{ duration: CYCLE_MS / 1000, ease: "linear" }}
        />
      </div>
    </div>
  );
}

function PendingApprovals() {
  return (
    <div className={`${panel} w-[218px] p-4`}>
      <div className="flex items-center justify-between">
        <p className="text-[11.5px] text-sub">Maker–checker</p>
        <span className="rounded-full bg-[#fdf3e6] px-2 py-0.5 text-[10.5px] font-semibold text-[#9a5410]">Needs attention</span>
      </div>
      <p className="mt-2 flex items-baseline gap-2">
        <span className="tabular text-[22px] leading-none font-semibold tracking-[-0.02em] text-ink">7</span>
        <span className="text-[12.5px] font-medium text-ink">approvals pending</span>
      </p>
      <p className="mt-1 text-[11px] text-sub">2 above your ₹1L threshold</p>
      <div className="mt-3 flex items-center gap-2">
        {["RK", "AS"].map((a, i) => (
          <motion.span
            key={a}
            initial={{ backgroundColor: "#fafafa", color: "#8c8c8c" }}
            animate={{ backgroundColor: "#d9f7be", color: "#062617" }}
            transition={{ duration: 0.4, delay: 0.5 + i * 0.6 }}
            className="relative grid size-7 place-items-center rounded-full text-[10.5px] font-semibold ring-2 ring-white"
          >
            {a}
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", bounce: 0.3, visualDuration: 0.35, delay: 0.7 + i * 0.6 }}
              className="absolute -right-1 -bottom-1 grid size-3.5 place-items-center rounded-full bg-brand text-white ring-2 ring-white"
            >
              <Check className="size-[7px]" />
            </motion.span>
          </motion.span>
        ))}
        <span className="text-[11px] text-sub">Maker · Checker</span>
      </div>
    </div>
  );
}

const spend = "M0 40 C 14 34, 22 26, 36 30 S 58 12, 74 14 S 96 30, 112 26 S 138 10, 156 12 S 182 30, 196 28";

function SpendOverview() {
  return (
    <div className={`${panel} w-[224px] p-4`}>
      <div className="flex items-center justify-between">
        <p className="text-[11.5px] text-sub">Spend overview</p>
        <span className="rounded-full bg-mint px-2 py-0.5 text-[10.5px] font-semibold text-forest">Monthly</span>
      </div>
      <p className="mt-1.5 flex items-baseline gap-2">
        <span className="text-[12px] text-copy">Settled</span>
        <span className="tabular text-[17px] font-semibold tracking-[-0.01em] text-ink">₹19.4L</span>
        <span className="tabular text-[11.5px] font-semibold text-[#05945b]">↑ 2.5%</span>
      </p>
      <svg viewBox="0 0 196 50" className="mt-2 w-full overflow-visible" fill="none">
        <defs>
          <linearGradient id="spend-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#95DE64" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#95DE64" stopOpacity="0" />
          </linearGradient>
        </defs>
        <motion.path d={`${spend} L196 50 L0 50 Z`} fill="url(#spend-fill)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 1.8 }} />
        <motion.path d={spend} stroke="#017649" strokeWidth="2" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.6, ease, delay: 1.2 }} />
      </svg>
      <div className="mt-2 flex justify-between text-[10.5px] text-sub">
        <span>
          Authorised <span className="tabular font-semibold text-ink">₹20.4L</span>
        </span>
        <span>
          Refunded <span className="tabular font-semibold text-ink">₹5.4L</span>
        </span>
      </div>
    </div>
  );
}

const ellipse = (rx: number, ry: number) => `M ${290 - rx} 300 a ${rx} ${ry} 0 1 0 ${rx * 2} 0 a ${rx} ${ry} 0 1 0 ${-rx * 2} 0`;

function Orbits({ animateDots, ready }: { animateDots: boolean; ready: boolean }) {
  const accents = useContext(Accent);
  const outer = ellipse(278, 124);
  const inner = ellipse(214, 90);
  return (
    <motion.svg
      viewBox={`0 0 ${W} ${H}`}
      className="absolute inset-0 overflow-visible"
      fill="none"
      initial={{ opacity: 0 }}
      animate={ready ? { opacity: 1 } : undefined}
      transition={{ duration: 1.4, delay: BASE + 0.3 }}
    >
      <g transform="rotate(-16 290 300)">
        <path d={outer} stroke="#017649" strokeOpacity="0.16" strokeDasharray="3 7" />
        <path d={inner} stroke="#95DE64" strokeOpacity="0.7" />
        {animateDots && (
          <>
            <circle r="5" fill={accents ? INDIGO : "#017649"}>
              <animateMotion dur="11s" repeatCount="indefinite" path={outer} />
            </circle>
            <circle r="4" fill="#95DE64" stroke="#fff" strokeWidth="2">
              <animateMotion dur="8s" repeatCount="indefinite" path={inner} keyPoints="1;0" keyTimes="0;1" calcMode="linear" />
            </circle>
            <circle r="3" fill={accents ? AMBER : "#017649"} fillOpacity={accents ? 0.75 : 0.5}>
              <animateMotion dur="11s" begin="-5.5s" repeatCount="indefinite" path={outer} />
            </circle>
          </>
        )}
      </g>
    </motion.svg>
  );
}
