"use client";

import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import Image from "next/image";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { ecosystem, overview, stats } from "@/content/home";
import { Button } from "@/components/ui/Button";
import { Counter } from "@/components/ui/Counter";
import { LogoMark } from "@/components/ui/Logo";
import { GRADIENT_TEXT } from "@/components/ui/Reveal";
import { Check } from "@/components/ui/icons";

const ease = [0.16, 1, 0.3, 1] as const;
const STEP_MS = 4200;
const ACCENT_WORD = "infrastructure";

const airIndia = ecosystem.groups[1].logos.find((l) => l.name === "Air India Express");

export function OverviewC() {
  return (
    <section id="about" aria-labelledby="about-c-title" className="relative px-2 pb-3 sm:px-3 md:px-4">
      <div className="relative overflow-clip rounded-[36px] bg-[linear-gradient(180deg,#f6fbf2_0%,#ffffff_28%,#fbfcfc_100%)] ring-1 ring-[#e6efe4]">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute inset-x-0 top-0 h-[700px] bg-[radial-gradient(rgba(1,118,73,0.1)_1px,transparent_1px)] bg-[size:20px_20px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,#000,transparent)]" />
          <div className="absolute -top-48 left-1/2 h-[560px] w-[1000px] -translate-x-1/2 bg-[radial-gradient(closest-side,rgba(149,222,100,0.28),transparent)]" />
          <div className="absolute top-[45%] -right-[12%] size-[720px] animate-blob-a rounded-full bg-[radial-gradient(closest-side,rgba(14,139,163,0.08),transparent)] motion-reduce:animate-none" />
        </div>
        <Statement />
        <Lifecycle />
        <StatsC />
      </div>
    </section>
  );
}

function Rise({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 0.9, ease, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ---------------- Statement ---------------- */

function Statement() {
  const reduce = useReducedMotion();
  const [founded, first] = overview.milestone.split(/(?<=\.)\s+/);
  const words = overview.title.split(" ");
  return (
    <div className="container-page relative pt-20 md:pt-28">
      <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-end lg:gap-16">
        <div>
          <h2 id="about-c-title" className="text-[clamp(1.875rem,1.4rem+1.5vw,2.75rem)] leading-[1.12] font-semibold tracking-[-0.03em] text-balance text-ink">
            {words.map((w, i) => (
              <span key={i} className="inline-block overflow-hidden pb-[0.08em] align-bottom">
                <motion.span
                  className={`inline-block ${w === ACCENT_WORD ? GRADIENT_TEXT : ""}`}
                  initial={reduce ? false : { y: "105%" }}
                  whileInView={{ y: 0 }}
                  viewport={{ once: true, margin: "0px 0px -10% 0px" }}
                  transition={{ duration: 0.8, ease, delay: i * 0.04 }}
                >
                  {w}
                  {i < words.length - 1 ? "\u00a0" : ""}
                </motion.span>
              </span>
            ))}
          </h2>
        </div>
        <Rise delay={0.1}>
          <p className="text-[17px] leading-[1.6] font-medium text-ink md:text-[18px]">{overview.lead}</p>
          <p className="mt-4 text-[15.5px] leading-[1.7] text-copy">{overview.body}</p>
          <Button href={overview.cta.href} className="mt-7">
            {overview.cta.label}
          </Button>
        </Rise>
      </div>

      <div className="mt-14 grid gap-4 md:grid-cols-2">
        <Rise className="h-full">
          <div className="group relative flex h-full items-center gap-4 overflow-hidden rounded-2xl bg-white p-5 ring-1 ring-line transition-shadow duration-500 hover:shadow-[0_24px_44px_-28px_rgba(6,38,23,0.35)]">
            <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-mist ring-1 ring-mint">
              <LogoMark className="size-7" />
            </span>
            <div>
              <p className="text-[11.5px] font-semibold tracking-[0.1em] text-brand uppercase">Foundation</p>
              <p className="mt-1 text-[15.5px] leading-snug font-medium text-ink">{founded}</p>
            </div>
          </div>
        </Rise>
        {first && (
          <Rise delay={0.08} className="h-full">
            <div className="group relative flex h-full items-center gap-4 overflow-hidden rounded-2xl bg-white p-5 ring-1 ring-line transition-shadow duration-500 hover:shadow-[0_24px_44px_-28px_rgba(6,38,23,0.35)]">
              <span className="grid h-12 w-[72px] shrink-0 place-items-center rounded-xl bg-white ring-1 ring-line">
                {airIndia && <Image src={airIndia.src} alt={airIndia.name} width={58} height={18} unoptimized className="h-auto w-[58px]" />}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[11.5px] font-semibold tracking-[0.1em] text-[#0e8ba3] uppercase">Milestone</p>
                <p className="mt-1 text-[15.5px] leading-snug font-medium text-ink">{first}</p>
              </div>
              <FlightMini />
            </div>
          </Rise>
        )}
      </div>
    </div>
  );
}

function FlightMini() {
  const reduce = useReducedMotion();
  const d = "M4 34 C 30 30, 46 6, 92 8";
  return (
    <svg viewBox="0 0 100 40" className="hidden h-10 w-24 shrink-0 sm:block" fill="none" aria-hidden="true">
      <path d={d} stroke="#d4f1f5" strokeWidth="1.5" strokeDasharray="2 4" />
      {!reduce && (
        <circle r="3" fill="#0e8ba3">
          <animateMotion dur="3.6s" repeatCount="indefinite" path={d} />
        </circle>
      )}
      <circle cx="92" cy="8" r="3.5" fill="#fff" stroke="#0e8ba3" strokeWidth="1.5" />
    </svg>
  );
}

/* ---------------- Lifecycle: six steps, each with a product screen ---------------- */

const ACCENTS = ["#017649", "#5b57d9", "#0e8ba3", "#d9822b", "#c8507a", "#2f6fd8"];
const SCREEN_TITLES = ["Account selection", "Generate a virtual card", "Authorisation", "Payments API", "Approvals", "Reconciliation"];

function Lifecycle() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-20% 0px -20% 0px" });
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const [manual, setManual] = useState(false);
  const auto = inView && !manual && !reduce;

  useEffect(() => {
    if (!auto) return;
    const id = setTimeout(() => setActive((a) => (a + 1) % overview.nodes.length), STEP_MS);
    return () => clearTimeout(id);
  }, [auto, active]);

  const accent = ACCENTS[active];

  return (
    <div ref={ref} className="container-page relative py-20 md:py-28">
      <Rise>
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] font-medium text-sub">
          {overview.nodes.map((n, i) => (
            <span key={n.verb} className="flex items-center gap-2">
              <span className={i === active ? "text-ink" : ""}>{n.verb}</span>
              {i < overview.nodes.length - 1 && <span className="h-px w-4 bg-ghost" />}
            </span>
          ))}
        </div>
      </Rise>

      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,360px)_minmax(0,1fr)] lg:gap-10">
        <ul role="tablist" aria-label="How PropelGo connects the payment ecosystem" className="space-y-1.5">
          {overview.nodes.map((n, i) => {
            const on = i === active;
            return (
              <li key={n.verb}>
                <button
                  type="button"
                  role="tab"
                  aria-selected={on}
                  onClick={() => {
                    setActive(i);
                    setManual(true);
                  }}
                  className={`relative w-full overflow-hidden rounded-2xl px-4 py-3.5 text-left transition-colors duration-300 ${on ? "bg-white shadow-[0_18px_36px_-26px_rgba(6,38,23,0.4)] ring-1 ring-line" : "hover:bg-white/60"}`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="tabular grid size-7 shrink-0 place-items-center rounded-lg text-[11px] font-semibold transition-colors duration-300"
                      style={on ? { backgroundColor: ACCENTS[i], color: "#fff" } : { backgroundColor: "#f3f4f3", color: "#8c8c8c" }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className={`text-[16px] font-semibold tracking-[-0.01em] ${on ? "text-ink" : "text-copy"}`}>{n.verb}</span>
                    <span className="ml-auto rounded-full px-2 py-0.5 text-[11.5px] font-medium" style={{ color: ACCENTS[i], backgroundColor: on ? `${ACCENTS[i]}14` : "transparent" }}>
                      {n.noun}
                    </span>
                  </div>
                  <AnimatePresence initial={false}>
                    {on && (
                      <motion.p
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease }}
                        className="overflow-hidden pl-10 text-[14.5px] leading-relaxed text-copy"
                      >
                        <span className="block pt-1.5">{n.line}</span>
                      </motion.p>
                    )}
                  </AnimatePresence>
                  {on && auto && (
                    <span
                      key={`bar-${active}`}
                      className="absolute inset-x-4 bottom-0 h-[2px] origin-left rounded-full"
                      style={{ backgroundColor: ACCENTS[i], animation: `t-progress ${STEP_MS}ms linear forwards` }}
                    />
                  )}
                </button>
              </li>
            );
          })}
        </ul>

        <Rise delay={0.1}>
          <div className="relative overflow-hidden rounded-[24px] bg-white shadow-[0_2px_4px_rgba(6,38,23,0.03),0_40px_80px_-40px_rgba(6,38,23,0.35)] ring-1 ring-black/[0.06]">
            <div className="flex items-center gap-3 border-b border-line/80 bg-[#fbfcfb] px-4 py-2.5">
              <LogoMark className="size-5" />
              <AnimatePresence mode="wait" initial={false}>
                <motion.p
                  key={active}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.25 }}
                  className="text-[13px] font-semibold text-ink"
                >
                  {SCREEN_TITLES[active]}
                </motion.p>
              </AnimatePresence>
              <Pipeline active={active} accent={accent} />
            </div>
            <div className="relative min-h-[420px] p-5 md:h-[420px] md:p-6">
              <div className="pointer-events-none absolute inset-0 transition-colors duration-700" style={{ background: `radial-gradient(90% 60% at 100% 0%, ${accent}0f, transparent 70%)` }} />
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={active}
                  initial={reduce ? false : { opacity: 0, y: 14, filter: "blur(4px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
                  transition={{ duration: 0.45, ease }}
                  className="relative h-full"
                >
                  <Screen index={active} accent={accent} />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </Rise>
      </div>
    </div>
  );
}

function Pipeline({ active, accent }: { active: number; accent: string }) {
  return (
    <div className="relative ml-auto hidden h-2 w-[180px] items-center sm:flex" aria-hidden="true">
      <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-line" />
      <motion.span
        className="absolute top-1/2 left-0 h-px -translate-y-1/2"
        style={{ backgroundColor: accent }}
        animate={{ width: `${(active / 5) * 100}%` }}
        transition={{ duration: 0.6, ease }}
      />
      {ACCENTS.map((c, i) => (
        <span
          key={c}
          className="absolute top-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full ring-2 ring-[#fbfcfb] transition-colors duration-500"
          style={{ left: `${(i / 5) * 100}%`, backgroundColor: i <= active ? accent : "#e3e3e3" }}
        />
      ))}
    </div>
  );
}

function Screen({ index, accent }: { index: number; accent: string }) {
  switch (index) {
    case 0:
      return <ConnectScreen accent={accent} />;
    case 1:
      return <IssueScreen accent={accent} />;
    case 2:
      return <RouteScreen accent={accent} />;
    case 3:
      return <IntegrateScreen accent={accent} />;
    case 4:
      return <AutomateScreen accent={accent} />;
    default:
      return <ReconcileScreen accent={accent} />;
  }
}

/** Shared timing so each screen plays a short, staged sequence when it mounts. */
function useTicks(count: number, every = 520, start = 300) {
  const reduce = useReducedMotion();
  const [n, setN] = useState(reduce ? count : 0);
  useEffect(() => {
    if (reduce) return;
    const ids = Array.from({ length: count }, (_, i) => setTimeout(() => setN(i + 1), start + i * every));
    return () => ids.forEach(clearTimeout);
  }, [count, every, start, reduce]);
  return n;
}

function Tick({ on, accent, size = "size-4" }: { on: boolean; accent: string; size?: string }) {
  return (
    <motion.span
      className={`grid ${size} shrink-0 place-items-center rounded-full text-white`}
      animate={{ backgroundColor: on ? accent : "#e8e8e8", scale: on ? [0.8, 1.15, 1] : 1 }}
      transition={{ duration: 0.4 }}
    >
      <Check className="size-2.5" />
    </motion.span>
  );
}

function Label({ children }: { children: ReactNode }) {
  return <p className="text-[11px] font-semibold tracking-[0.1em] text-sub uppercase">{children}</p>;
}

function ConnectScreen({ accent }: { accent: string }) {
  const t = useTicks(4);
  const accounts = [
    { no: "XXXXXXX90", type: "OD", scheme: "ODA001" },
    { no: "XXXXXXX47", type: "CC", scheme: "CCA014" },
  ];
  const checks = ["CIF validation successful", "OTP verified via registered mobile", "AML check accepted by the bank"];
  return (
    <div className="grid h-full gap-5 md:grid-cols-[1.2fr_1fr]">
      <div>
        <Label>Select an account and OD/CC authorised signatory</Label>
        <div className="mt-3 space-y-2.5">
          {accounts.map((a, i) => (
            <div key={a.no} className={`flex items-center gap-3 rounded-xl px-4 py-3 ring-1 transition-colors duration-500 ${i === 0 && t >= 1 ? "bg-mist ring-mint" : "bg-white ring-line"}`}>
              <span className="grid size-4 place-items-center rounded-full ring-1 ring-ghost">
                {i === 0 && t >= 1 && <motion.span layoutId="c-radio" className="size-2 rounded-full" style={{ backgroundColor: accent }} />}
              </span>
              <div className="min-w-0 flex-1">
                <p className="tabular text-[14px] font-semibold text-ink">{a.no}</p>
                <p className="text-[12px] text-sub">
                  Account type: {a.type} · Scheme code: {a.scheme}
                </p>
              </div>
              <span className="rounded-full bg-mint px-2 py-0.5 text-[11px] font-semibold text-forest">Eligible</span>
            </div>
          ))}
        </div>
        <div className="mt-4 rounded-xl bg-surface px-4 py-3 ring-1 ring-line">
          <p className="text-[12px] text-sub">Authorised signatory</p>
          <div className="mt-2 flex items-center gap-2.5">
            <span className="grid size-8 place-items-center rounded-full bg-mint text-[11px] font-semibold text-forest">RK</span>
            <div>
              <p className="text-[13.5px] font-medium text-ink">Ramesh Kumar</p>
              <p className="text-[11.5px] text-sub">OD/CC authorised signatory</p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <Label>Onboarding</Label>
        <ul className="mt-3 space-y-3">
          {checks.map((c, i) => (
            <li key={c} className="flex items-center gap-3 text-[13.5px]">
              <Tick on={t >= i + 2} accent={accent} size="size-5" />
              <span className={t >= i + 2 ? "text-ink" : "text-sub"}>{c}</span>
            </li>
          ))}
        </ul>
        <div className="mt-auto rounded-xl p-4 text-white" style={{ background: `linear-gradient(135deg, ${accent}, #062617)` }}>
          <p className="text-[11px] text-white/70">Sanctioned limit</p>
          <p className="tabular mt-0.5 text-[24px] font-semibold tracking-[-0.02em]">₹12.30 Cr</p>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/20">
            <motion.div className="h-full rounded-full bg-lime" initial={{ width: 0 }} animate={{ width: t >= 4 ? "72%" : "0%" }} transition={{ duration: 1, ease }} />
          </div>
          <p className="mt-1.5 text-[11px] text-white/70">Credit utilisation 72%</p>
        </div>
      </div>
    </div>
  );
}

function IssueScreen({ accent }: { accent: string }) {
  const t = useTicks(6, 420);
  const controls = [
    { name: "ECOM", scope: "Domestic", on: true },
    { name: "POS", scope: "International", on: false },
    { name: "CONTACTLESS", scope: "Domestic", on: true },
    { name: "MOTO", scope: "International", on: false },
  ];
  return (
    <div className="grid h-full gap-5 md:grid-cols-[1.1fr_1fr]">
      <div className="space-y-3">
        <Field label="Vendor" value="RoadRider Fleet Management" on={t >= 1} />
        <div className="grid grid-cols-2 gap-3">
          <Field label="Card limit" value="₹1,00,000" on={t >= 2} />
          <Field label="Expiry" value="31 Dec 2026" on={t >= 2} />
        </div>
        <div>
          <Label>Card controls</Label>
          <ul className="mt-2 grid grid-cols-2 gap-2">
            {controls.map((c, i) => {
              const on = c.on && t >= 3 + Math.floor(i / 2);
              return (
                <li key={c.name} className="flex items-center justify-between rounded-lg bg-white px-3 py-2 ring-1 ring-line">
                  <span>
                    <span className="block text-[12px] font-semibold text-ink">{c.name}</span>
                    <span className="block text-[10.5px] text-sub">{c.scope}</span>
                  </span>
                  <span className="relative h-4 w-7 rounded-full transition-colors duration-300" style={{ backgroundColor: on ? accent : "#e3e3e3" }}>
                    <motion.span className="absolute top-0.5 size-3 rounded-full bg-white shadow" animate={{ left: on ? 14 : 2 }} transition={{ type: "spring", bounce: 0.3, visualDuration: 0.3 }} />
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center gap-4">
        <motion.div
          className="relative h-[150px] w-[240px] overflow-hidden rounded-[18px] p-4 text-white shadow-[0_30px_50px_-24px_rgba(31,27,75,0.6)]"
          style={{ background: `linear-gradient(135deg, ${accent} 0%, #2e2a8a 60%, #15133f 100%)` }}
          animate={{ rotateY: t >= 5 ? 0 : 12, scale: t >= 5 ? 1 : 0.96 }}
          transition={{ duration: 0.6, ease }}
        >
          <span className="pointer-events-none absolute inset-y-0 left-0 w-1/3 animate-shine bg-gradient-to-r from-transparent via-white/20 to-transparent motion-reduce:hidden" />
          <div className="flex items-center gap-1.5">
            <LogoMark tone="dark" className="size-5" />
            <span className="text-[11px] font-semibold">Virtual card</span>
          </div>
          <p className="mt-7 text-[10px] text-white/60">RoadRider Fleet Management</p>
          <p className="tabular mt-0.5 text-[14px] tracking-[0.14em]">{t >= 5 ? "•••• •••• •••• 5678" : "•••• •••• •••• ····"}</p>
          <p className="mt-2 text-[10px] text-white/70">Limit ₹1,00,000 · 12/26</p>
        </motion.div>
        <motion.span
          className="flex items-center gap-1.5 rounded-full px-3 py-1 text-[12px] font-semibold"
          style={{ color: accent, backgroundColor: `${accent}14` }}
          animate={{ opacity: t >= 6 ? 1 : 0, y: t >= 6 ? 0 : 6 }}
        >
          <Check className="size-2.5" /> Card issued and sent to vendor
        </motion.span>
      </div>
    </div>
  );
}

function Field({ label, value, on }: { label: string; value: string; on: boolean }) {
  return (
    <div>
      <Label>{label}</Label>
      <div className={`mt-1.5 flex h-10 items-center rounded-lg px-3 text-[13.5px] ring-1 transition-colors duration-300 ${on ? "bg-white text-ink ring-line" : "bg-surface text-sub ring-line/60"}`}>
        {on ? (
          <motion.span initial={{ opacity: 0, x: -4 }} animate={{ opacity: 1, x: 0 }}>
            {value}
          </motion.span>
        ) : (
          <span className="h-2 w-24 rounded-full bg-line" />
        )}
      </div>
    </div>
  );
}

function RouteScreen({ accent }: { accent: string }) {
  const reduce = useReducedMotion();
  const [k, setK] = useState(0);
  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setK((v) => v + 1), 1700);
    return () => clearInterval(id);
  }, [reduce]);
  const networks = ["Visa", "Mastercard", "RuPay"];
  const lit = k % networks.length;
  const hops = ["•••• 5678", "PropelGo", networks[lit], "Issuer"];
  const log = [
    { m: "ECOM", amt: "₹18,400", net: "Mastercard", ms: 184 },
    { m: "POS", amt: "₹6,250", net: "Visa", ms: 162 },
    { m: "ECOM", amt: "₹32,000", net: "RuPay", ms: 201 },
  ];
  return (
    <div className="flex h-full flex-col">
      <Label>Authorisation path</Label>
      <div className="relative mt-5 flex items-center justify-between">
        <span className="absolute inset-x-8 top-1/2 h-px -translate-y-1/2 bg-line" />
        <motion.span
          key={k}
          className="absolute top-1/2 size-2.5 -translate-y-1/2 rounded-full shadow-[0_0_0_4px_rgba(14,139,163,0.18)]"
          style={{ backgroundColor: accent }}
          initial={{ left: "6%" }}
          animate={{ left: "92%" }}
          transition={{ duration: 1.3, ease: "easeInOut" }}
        />
        {hops.map((h, i) => (
          <span
            key={i}
            className={`relative z-10 flex items-center justify-center gap-1.5 rounded-xl px-2 py-2 text-[11.5px] font-medium whitespace-nowrap ring-1 sm:min-w-[96px] sm:px-3 sm:py-2.5 sm:text-[12.5px] ${i === 1 ? "bg-white text-ink shadow-[0_10px_24px_-14px_rgba(6,38,23,0.5)] ring-mint" : "bg-white text-copy ring-line"}`}
          >
            {i === 1 && <LogoMark className="size-4 max-sm:hidden" />}
            {h}
          </span>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-2">
        {networks.map((n, i) => (
          <span key={n} className="rounded-full px-3 py-1 text-[12px] font-semibold ring-1 transition-colors duration-300" style={i === lit ? { color: "#fff", backgroundColor: accent, borderColor: accent } : { color: "#595959", backgroundColor: "#fff", boxShadow: "inset 0 0 0 1px #e8e8e8" }}>
            {n}
          </span>
        ))}
        <span className="ml-auto flex items-center gap-1.5 text-[12px] font-medium text-success">
          <span className="size-1.5 animate-pulse rounded-full bg-success" />
          Approved · 00
        </span>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-2 sm:gap-3">
        {[
          { l: "Approval rate", v: `${(98.6 + (k % 4) * 0.1).toFixed(1)}%` },
          { l: "Avg latency", v: `${178 + ((k * 7) % 12)} ms` },
          { l: "Uptime", v: "99.99%" },
        ].map((m) => (
          <div key={m.l} className="rounded-xl bg-surface/70 px-2.5 py-2.5 ring-1 ring-line/70 sm:px-3.5 sm:py-3">
            <p className="text-[11px] text-sub sm:text-[11.5px]">{m.l}</p>
            <p className="tabular mt-1 text-[14px] font-semibold tracking-[-0.01em] text-ink sm:text-[17px]">{m.v}</p>
          </div>
        ))}
      </div>

      <div className="mt-5 overflow-hidden rounded-xl ring-1 ring-line md:mt-auto">
        <div className="grid grid-cols-[1fr_1fr_1.2fr_0.8fr] bg-surface px-3 py-2 sm:px-4 text-[11px] font-semibold tracking-[0.06em] text-sub uppercase">
          <span>Channel</span>
          <span>Amount</span>
          <span>Network</span>
          <span className="text-right">Latency</span>
        </div>
        {log.map((r, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.15 }}
            className="tabular grid grid-cols-[1fr_1fr_1.2fr_0.8fr] border-t border-line/70 px-3 py-2.5 text-[12px] sm:px-4 sm:text-[13px]"
          >
            <span className="text-copy">{r.m}</span>
            <span className="font-medium text-ink">{r.amt}</span>
            <span className="text-copy">{r.net}</span>
            <span className="text-right text-sub">{r.ms} ms</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

const CODE: { t: string; c?: string }[][] = [
  [{ t: "POST", c: "#017649" }, { t: " /v1/payments" }],
  [{ t: "Authorization", c: "#5b57d9" }, { t: ": Bearer sk_live_••••" }],
  [{ t: "{" }],
  [{ t: '  "source"', c: "#5b57d9" }, { t: ": " }, { t: '"erp.sap"', c: "#017649" }, { t: "," }],
  [{ t: '  "invoice"', c: "#5b57d9" }, { t: ": " }, { t: '"INV-20418"', c: "#017649" }, { t: "," }],
  [{ t: '  "vendor"', c: "#5b57d9" }, { t: ": " }, { t: '"StayEase Hospitality"', c: "#017649" }, { t: "," }],
  [{ t: '  "amount"', c: "#5b57d9" }, { t: ": " }, { t: "248500", c: "#d9822b" }, { t: "," }],
  [{ t: '  "method"', c: "#5b57d9" }, { t: ": " }, { t: '"virtual_card"', c: "#017649" }],
  [{ t: "}" }],
];

function IntegrateScreen({ accent }: { accent: string }) {
  const t = useTicks(CODE.length + 4, 170, 200);
  const events = ["invoice.approved", "payment.created", "card.issued", "payment.settled"];
  return (
    <div className="grid h-full gap-5 md:grid-cols-[1.35fr_1fr]">
      <div className="flex flex-col overflow-hidden rounded-xl bg-[#fbfcfb] ring-1 ring-line">
        <div className="flex gap-1 border-b border-line/70 px-3 pt-2 text-[12px]">
          <span className="rounded-t-md border-b-2 px-2.5 pb-1.5 font-medium text-ink" style={{ borderColor: accent }}>
            REST API
          </span>
          <span className="px-2.5 pb-1.5 text-sub">ERP webhook</span>
        </div>
        <pre className="flex-1 overflow-hidden px-4 py-3 font-mono text-[12px] leading-[1.75] text-ink">
          {CODE.map((line, i) => (
            <motion.div key={i} animate={{ opacity: t > i ? 1 : 0 }} transition={{ duration: 0.2 }}>
              {line.map((s, j) => (
                <span key={j} style={s.c ? { color: s.c } : undefined}>
                  {s.t}
                </span>
              ))}
            </motion.div>
          ))}
        </pre>
        <motion.div animate={{ opacity: t > CODE.length ? 1 : 0 }} className="flex items-center justify-between border-t border-line/70 bg-mist px-4 py-2 font-mono text-[12px]">
          <span className="text-forest">201 Created</span>
          <span className="text-copy">pay_8XK2Q4</span>
        </motion.div>
      </div>
      <div>
        <Label>Event stream</Label>
        <ul className="relative mt-3 space-y-3 before:absolute before:top-2 before:bottom-2 before:left-[9px] before:w-px before:bg-line">
          {events.map((e, i) => {
            const on = t > CODE.length + i;
            return (
              <li key={e} className="relative flex items-center gap-3">
                <Tick on={on} accent={accent} size="size-5" />
                <span className={`font-mono text-[12.5px] ${on ? "text-ink" : "text-sub"}`}>{e}</span>
              </li>
            );
          })}
        </ul>
        <div className="mt-6 rounded-xl bg-white p-4 ring-1 ring-line">
          <p className="text-[12px] text-sub">Connected systems</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {["SAP", "Oracle", "Tally", "Custom ERP"].map((s) => (
              <span key={s} className="rounded-md bg-surface px-2 py-1 text-[12px] font-medium text-ink ring-1 ring-line">
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function AutomateScreen({ accent }: { accent: string }) {
  const t = useTicks(4, 650);
  const flow = [
    { role: "Maker", who: "RK", name: "Ramesh K." },
    { role: "Checker", who: "AS", name: "Anita S." },
    { role: "Released", who: "", name: "To vendor" },
  ];
  const rules = ["Above ₹1L needs two approvers", "New vendor goes to finance review", "Card controls checked before release"];
  return (
    <div className="grid h-full gap-5 md:grid-cols-[1fr_1.1fr]">
      <div className="flex flex-col gap-3">
        <div className="rounded-xl bg-[#fdf3e6] p-4 ring-1 ring-[#f5dcc0]">
          <p className="text-[11px] font-semibold tracking-[0.1em] text-[#9a5410] uppercase">Needs attention</p>
          <p className="tabular mt-1.5 text-[26px] leading-none font-semibold text-ink">7</p>
          <p className="mt-1 text-[13px] text-ink">Approvals pending</p>
          <p className="text-[12px] text-[#9a5410]">2 above your ₹1L threshold</p>
        </div>
        <div className="rounded-xl bg-white p-4 ring-1 ring-line">
          <Label>Policy</Label>
          <ul className="mt-2 space-y-2">
            {rules.map((r) => (
              <li key={r} className="flex items-center gap-2 text-[13px] text-copy">
                <span className="size-1.5 rounded-full" style={{ backgroundColor: accent }} />
                {r}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="flex flex-col rounded-xl bg-white p-4 ring-1 ring-line">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[12px] text-sub">Payment to StayEase Hospitality</p>
            <p className="tabular text-[20px] font-semibold tracking-[-0.02em] text-ink">₹2,48,500</p>
          </div>
          <motion.span
            className="rounded-full px-2.5 py-1 text-[11.5px] font-semibold"
            animate={t >= 3 ? { backgroundColor: "#d9f7be", color: "#062617" } : { backgroundColor: "#fdf3e6", color: "#9a5410" }}
          >
            {t >= 3 ? "Approved" : "Pending"}
          </motion.span>
        </div>
        <ol className="relative mt-6 flex-1 space-y-5 before:absolute before:top-3 before:bottom-3 before:left-[15px] before:w-px before:bg-line">
          {flow.map((f, i) => {
            const on = t >= i + 1;
            return (
              <li key={f.role} className="relative flex items-center gap-3">
                <motion.span
                  className="relative z-10 grid size-8 place-items-center rounded-full text-[11px] font-semibold ring-4 ring-white"
                  animate={on ? { backgroundColor: accent, color: "#fff" } : { backgroundColor: "#f3f4f3", color: "#8c8c8c" }}
                >
                  {f.who || <Check className="size-3" />}
                </motion.span>
                <div className="min-w-0 flex-1">
                  <p className="text-[13.5px] font-medium text-ink">{f.role}</p>
                  <p className="text-[12px] text-sub">{f.name}</p>
                </div>
                {on && (
                  <motion.span initial={{ opacity: 0, x: 6 }} animate={{ opacity: 1, x: 0 }} className="text-[11.5px] font-medium" style={{ color: accent }}>
                    {i === 2 ? "Done" : "Approved"}
                  </motion.span>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}

function ReconcileScreen({ accent }: { accent: string }) {
  const rows = [
    { ref: "TXN-88412", vendor: "RoadRider Fleet", auth: "₹18,40,000", settled: "₹18,40,000" },
    { ref: "TXN-88413", vendor: "StayEase Hospitality", auth: "₹16,70,000", settled: "₹16,70,000" },
    { ref: "TXN-88419", vendor: "AirLink Booking", auth: "₹15,20,000", settled: "₹15,20,000" },
    { ref: "TXN-88421", vendor: "TransGlobal Logistics", auth: "₹9,80,000", settled: "₹9,80,000" },
  ];
  const t = useTicks(rows.length + 1, 480);
  const pct = Math.round((Math.min(t, rows.length) / rows.length) * 100);
  return (
    <div className="flex h-full flex-col">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <Stat label="Fund authorised" value="₹60,10,000" />
        <Stat label="Fund settled" value="₹60,10,000" />
        <div className="col-span-2 rounded-xl bg-white p-3.5 ring-1 ring-line sm:col-span-1">
          <p className="text-[11.5px] text-sub">Matched to ledger</p>
          <p className="tabular mt-0.5 text-[18px] font-semibold" style={{ color: accent }}>
            {pct}%
          </p>
          <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-surface">
            <motion.div className="h-full rounded-full" style={{ backgroundColor: accent }} animate={{ width: `${pct}%` }} transition={{ duration: 0.4 }} />
          </div>
        </div>
      </div>
      <div className="mt-4 flex-1 overflow-hidden rounded-xl ring-1 ring-line">
        <div className="grid grid-cols-[1.5fr_1fr_0.5fr] bg-surface px-4 py-2 text-[11px] font-semibold tracking-[0.06em] text-sub uppercase sm:grid-cols-[1fr_1.4fr_1fr_1fr_0.7fr]">
          <span className="max-sm:hidden">Reference</span>
          <span>Vendor</span>
          <span>Authorised</span>
          <span className="max-sm:hidden">Settled</span>
          <span className="text-right">Ledger</span>
        </div>
        {rows.map((r, i) => {
          const on = t > i;
          return (
            <div key={r.ref} className="tabular grid grid-cols-[1.5fr_1fr_0.5fr] items-center border-t border-line/70 px-4 py-3 text-[13px] sm:grid-cols-[1fr_1.4fr_1fr_1fr_0.7fr]">
              <span className="font-mono text-[12px] text-sub max-sm:hidden">{r.ref}</span>
              <span className="truncate pr-2 text-ink">{r.vendor}</span>
              <span className="text-copy">{r.auth}</span>
              <span className="text-copy max-sm:hidden">{r.settled}</span>
              <span className="flex justify-end">
                <Tick on={on} accent={accent} />
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-white p-3.5 ring-1 ring-line">
      <p className="text-[11.5px] text-sub">{label}</p>
      <p className="tabular mt-0.5 text-[16px] font-semibold tracking-[-0.02em] text-ink sm:text-[18px]">{value}</p>
    </div>
  );
}

/* ---------------- Stats ---------------- */

const STAT_ACCENTS = ["#017649", "#5b57d9", "#0e8ba3", "#d9822b"];

function StatsC() {
  return (
    <div className="container-page relative pb-20 md:pb-28">
      <div className="flex flex-col gap-4 border-t border-line/70 pt-14 md:flex-row md:items-end md:justify-between md:pt-20">
        <Rise>
          <h3 className="max-w-[520px] text-[clamp(1.5rem,1.2rem+1vw,2.125rem)] leading-[1.18] font-semibold tracking-[-0.025em] text-balance text-ink">{stats.title}</h3>
        </Rise>
        <Rise delay={0.05}>
          <p className="text-[13px] text-sub">{stats.note}</p>
        </Rise>
      </div>
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.items.map((s, i) => (
          <Rise key={s.label} delay={i * 0.07} className="h-full">
            <div className="group relative flex h-full min-h-[230px] flex-col overflow-hidden rounded-[22px] bg-white p-6 ring-1 ring-line transition-[box-shadow,transform] duration-500 hover:-translate-y-1 hover:shadow-[0_30px_50px_-30px_rgba(6,38,23,0.4)]">
              <span
                className="pointer-events-none absolute inset-x-0 top-0 h-px opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{ background: `linear-gradient(90deg, transparent, ${STAT_ACCENTS[i]}, transparent)` }}
              />
              <div className="flex items-center justify-between">
                <p className="text-[13.5px] font-medium text-copy">{s.label}</p>
                <span className="size-2 rounded-full" style={{ backgroundColor: STAT_ACCENTS[i] }} />
              </div>
              <div className="mt-5 h-[64px]">
                <StatVisual index={i} accent={STAT_ACCENTS[i]} />
              </div>
              <Counter
                value={s.value}
                prefix={s.prefix}
                suffix={s.suffix}
                className="mt-auto pt-5 text-[clamp(2rem,1.6rem+1.2vw,2.75rem)] leading-none font-semibold tracking-[-0.035em] text-ink"
                suffixClassName="ml-0.5 text-[0.55em] font-semibold tracking-normal"
              />
            </div>
          </Rise>
        ))}
      </div>
    </div>
  );
}

function StatVisual({ index, accent }: { index: number; accent: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const reduce = useReducedMotion();
  const show = inView || !!reduce;

  if (index === 0) {
    const people = ["AI", "SH", "RF", "AB", "TL", "VA"];
    return (
      <div ref={ref} className="flex h-full items-center">
        <div className="flex -space-x-2">
          {people.map((p, i) => (
            <motion.span
              key={p}
              initial={reduce ? false : { opacity: 0, scale: 0.6 }}
              animate={show ? { opacity: 1, scale: 1 } : undefined}
              transition={{ type: "spring", bounce: 0.35, visualDuration: 0.4, delay: 0.1 + i * 0.08 }}
              className="grid size-9 place-items-center rounded-full text-[10.5px] font-semibold ring-2 ring-white"
              style={{ backgroundColor: i % 2 ? "#d9f7be" : "#f6ffee", color: "#062617" }}
            >
              {p}
            </motion.span>
          ))}
          <span className="grid size-9 place-items-center rounded-full text-[10.5px] font-semibold text-white ring-2 ring-white" style={{ backgroundColor: accent }}>
            +
          </span>
        </div>
      </div>
    );
  }

  if (index === 1) {
    const bars = [38, 52, 44, 66, 58, 74, 62, 82, 70, 90, 78, 96];
    return (
      <div ref={ref} className="flex h-full items-end gap-1">
        {bars.map((h, i) => (
          <motion.span
            key={i}
            className="flex-1 origin-bottom rounded-sm"
            style={{ height: `${h}%`, backgroundColor: i === bars.length - 1 ? accent : `${accent}33` }}
            initial={reduce ? false : { scaleY: 0 }}
            animate={show ? { scaleY: 1 } : undefined}
            transition={{ duration: 0.6, ease, delay: 0.05 * i }}
          />
        ))}
      </div>
    );
  }

  if (index === 2) {
    const d = "M0 52 C 20 48, 30 40, 50 42 S 80 28, 100 30 S 130 16, 150 18 S 180 6, 200 4";
    return (
      <div ref={ref} className="h-full">
        <svg viewBox="0 0 200 60" preserveAspectRatio="none" className="size-full overflow-visible" fill="none" aria-hidden="true">
          <defs>
            <linearGradient id="c-vol" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={accent} stopOpacity="0.22" />
              <stop offset="100%" stopColor={accent} stopOpacity="0" />
            </linearGradient>
          </defs>
          <motion.path d={`${d} L200 60 L0 60 Z`} fill="url(#c-vol)" initial={reduce ? false : { opacity: 0 }} animate={show ? { opacity: 1 } : undefined} transition={{ duration: 0.8, delay: 0.9 }} />
          <motion.path
            d={d}
            stroke={accent}
            strokeWidth="2"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
            initial={reduce ? false : { pathLength: 0 }}
            animate={show ? { pathLength: 1 } : undefined}
            transition={{ duration: 1.4, ease, delay: 0.1 }}
          />
        </svg>
      </div>
    );
  }

  return (
    <div ref={ref} className="grid h-full grid-cols-9 content-center gap-1.5">
      {Array.from({ length: 18 }, (_, i) => (
        <motion.span
          key={i}
          className="aspect-square rounded-full"
          initial={reduce ? false : { backgroundColor: "#eeeeee", scale: 0.7 }}
          animate={show ? { backgroundColor: i % 3 === 0 ? accent : `${accent}55`, scale: 1 } : undefined}
          transition={{ duration: 0.3, delay: 0.05 * i }}
        />
      ))}
    </div>
  );
}
