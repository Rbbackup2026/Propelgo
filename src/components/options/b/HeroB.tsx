"use client";

import { AnimatePresence, motion, useInView, useMotionValue, useReducedMotion, useSpring, type MotionValue } from "motion/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { hero } from "@/content/home";
import { Button } from "@/components/ui/Button";
import { BrandRibbon } from "@/components/ui/BrandRibbon";
import { Logo } from "@/components/ui/Logo";
import { GRADIENT_TEXT } from "@/components/ui/Reveal";
import { usePreloaderDone } from "@/lib/preloader";
import { useStageScale } from "@/lib/useStageScale";
import { RoutingScene } from "@/components/options/c/HeroScenes";

const ease = [0.16, 1, 0.3, 1] as const;
const BASE = 0.35;
const HIGHLIGHT_WORDS = 4;
const STAGE_W = 640;
const STAGE_H = 560;
const CARD_W = 150;
const CARD_H = 238;

const PHASES = [
  { key: "versa", ms: 6400 },
  { key: "odcc", ms: 6400 },
  { key: "routing", ms: 8200 },
] as const;

/** Direction B hero. The portrait card stays put. Screens slide in on a horizontal line, then flip to the next product. */
export function HeroB() {
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
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
        <div className="absolute -top-[20%] right-[-12%] size-[780px] animate-blob-a rounded-full bg-[radial-gradient(closest-side,rgba(149,222,100,0.34),transparent)] motion-reduce:animate-none" />
        <div className="absolute top-[18%] right-[18%] size-[560px] animate-blob-b rounded-full bg-[radial-gradient(closest-side,rgba(14,139,163,0.14),transparent)] motion-reduce:animate-none" />
        <div className="absolute top-[-10%] left-[-10%] size-[520px] rounded-full bg-[radial-gradient(closest-side,rgba(217,247,190,0.6),transparent)]" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-white" />
      </div>
      <BrandRibbon
        variant="twist"
        play={ready}
        className="absolute top-0 left-0 -z-10 h-[78%] w-[min(34vw,420px)] opacity-90 [mask-image:radial-gradient(115%_100%_at_0%_0%,#000_35%,transparent_80%)] max-md:h-[45%] max-md:w-[55vw]"
      />
      <div className="container-page grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,600px)] lg:gap-8">
        <div className="relative max-w-[560px]">
          <h1 className="text-[clamp(2rem,1.5rem+1.7vw,3rem)] leading-[1.07] font-semibold tracking-[-0.035em] text-balance text-ink">
            {words.map((w, i) => (
              <span key={i} className="-mb-[0.1em] inline-block overflow-hidden pb-[0.18em] align-bottom">
                <motion.span
                  className={`inline-block pb-[0.1em] ${i >= words.length - HIGHLIGHT_WORDS ? GRADIENT_TEXT : ""}`}
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
        <PhaseStage ready={ready} mx={mx} my={my} />
      </div>
    </section>
  );
}

function PhaseStage({ ready, mx, my }: { ready: boolean; mx: MotionValue<number>; my: MotionValue<number> }) {
  const { ref, scale } = useStageScale<HTMLDivElement>(STAGE_W);
  const inView = useInView(ref, { margin: "0px 0px -10% 0px" });
  const reduce = useReducedMotion();
  const live = ready && inView && !reduce;
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    if (!live) return;
    const id = setTimeout(() => setPhase((p) => (p + 1) % PHASES.length), PHASES[phase].ms);
    return () => clearTimeout(id);
  }, [live, phase]);

  const zero = useMotionValue(0);
  const nearX = useSpring(mx, { stiffness: 60, damping: 18 });
  const farX = useSpring(my, { stiffness: 60, damping: 18 });

  return (
    <div ref={ref} data-phase={PHASES[phase].key} className="relative w-full" style={{ height: STAGE_H * scale }}>
      <div className="absolute top-0 left-0 origin-top-left [perspective:1200px]" style={{ width: STAGE_W, height: STAGE_H, transform: `scale(${scale})` }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={PHASES[phase].key}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, filter: "blur(6px)" }}
            transition={{ duration: 0.45 }}
          >
            {phase === 0 && <VersaPhase />}
            {phase === 1 && <OdccPhase />}
            {phase === 2 && <RoutingScene live={live} nearX={nearX} nearY={zero} farX={farX} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

const VERSA = [
  { title: "Dashboard", from: -520, to: -206, y: -8, spin: -86 },
  { title: "Invoice payment", from: 540, to: 206, y: -86, spin: 86 },
  { title: "Invoices", from: 560, to: 206, y: 78, spin: 86 },
] as const;

/** Versa screens travel in on a straight horizontal line and flip face-on beside the card. */
function VersaPhase() {
  return (
    <>
      {VERSA.map((panel, i) => (
        <Slide key={panel.title} from={panel.from} to={panel.to} y={panel.y} spin={panel.spin} delay={0.15 + i * 0.12}>
          {panel.title === "Dashboard" ? <DashWindow /> : panel.title === "Invoice payment" ? <InvoicePayWindow /> : <InvoicesWindow />}
        </Slide>
      ))}
      <Portrait flip={false} />
    </>
  );
}

/** The same card flips, the ODCC card pops, and Tap & Pay plus the overdraft view slide in horizontally. */
function OdccPhase() {
  return (
    <>
      <Slide from={-480} to={-200} y={8} spin={-80} delay={0.35}>
        <OverdraftWindow />
      </Slide>
      <Slide from={500} to={198} y={-78} spin={80} delay={0.48}>
        <TapWindow />
      </Slide>
      <motion.div
        className="absolute top-1/2 left-1/2 z-[6]"
        style={{ x: 36, y: 22 }}
        initial={{ opacity: 0, scale: 0.72, rotate: 8 }}
        animate={{ opacity: 1, scale: 1, rotate: -6 }}
        transition={{ type: "spring", bounce: 0.35, visualDuration: 0.7, delay: 0.2 }}
      >
        <Image src="/products/odcc-card.png" alt="PropelGo ODCC commercial card" width={150} height={188} className="h-[168px] w-auto object-contain drop-shadow-[0_18px_28px_rgba(6,38,23,0.35)]" style={{ width: "auto", height: 168 }} />
      </motion.div>
      <Portrait flip />
    </>
  );
}

function Slide({ from, to, y, spin, delay, children }: { from: number; to: number; y: number; spin: number; delay: number; children: React.ReactNode }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className="absolute top-1/2 left-1/2 z-[3]"
      style={{ y }}
      initial={reduce ? false : { x: from, opacity: 0, rotateY: spin }}
      animate={{ x: to, opacity: 1, rotateY: 0 }}
      exit={{ x: from > 0 ? 420 : -420, opacity: 0, rotateY: -spin }}
      transition={reduce ? { duration: 0 } : { duration: 0.85, delay, ease }}
    >
      <div className="-translate-x-1/2 -translate-y-1/2">{children}</div>
    </motion.div>
  );
}

function Frame({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="w-[176px] overflow-hidden rounded-xl bg-white shadow-[0_18px_36px_-18px_rgba(6,38,23,0.45)] ring-1 ring-black/[0.08]">
      <div className="flex items-center gap-1.5 border-b border-black/[0.05] px-2 py-1">
        <span className="size-1.5 rounded-full bg-brand" />
        <span className="truncate text-[10px] font-semibold text-ink">{title}</span>
      </div>
      {children}
    </div>
  );
}

function DashWindow() {
  return (
    <Frame title="Dashboard">
      <div className="relative h-[108px] w-full">
        <Image src="/hero/b-dashboard.jpg" alt="Versa dashboard" fill className="object-cover object-left-top" sizes="176px" />
      </div>
    </Frame>
  );
}

function InvoicePayWindow() {
  return (
    <Frame title="Invoice payment">
      <div className="space-y-1.5 p-2">
        <p className="text-[9px] font-semibold tracking-[0.06em] text-sub uppercase">Ready to pay</p>
        <div className="rounded-lg bg-[#f4fbf6] px-2 py-1.5">
          <p className="text-[11px] font-semibold text-ink">RoadRider Fleet</p>
          <p className="tabular text-[10px] text-copy">INV-2041 · ₹1,84,000</p>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-sub">Virtual card •••• 4021</span>
          <span className="rounded-full bg-brand px-2 py-0.5 text-[9px] font-semibold text-white">Pay</span>
        </div>
      </div>
    </Frame>
  );
}

function InvoicesWindow() {
  const rows = [
    ["INV-2041", "₹1,84,000", "Paid"],
    ["INV-2048", "₹62,400", "Due"],
    ["INV-2052", "₹41,200", "Paid"],
  ];
  return (
    <Frame title="Invoices">
      <div className="px-2 py-1.5">
        {rows.map(([id, amt, status]) => (
          <div key={id} className="flex items-center gap-1 border-t border-line/70 py-1 first:border-0">
            <span className="tabular text-[10px] font-medium text-ink">{id}</span>
            <span className="tabular ml-auto text-[10px] text-copy">{amt}</span>
            <span className={`rounded-full px-1.5 text-[8.5px] font-semibold ${status === "Paid" ? "bg-[#e7f7ee] text-forest" : "bg-[#f4f1e4] text-[#8a6a12]"}`}>{status}</span>
          </div>
        ))}
      </div>
    </Frame>
  );
}

function OverdraftWindow() {
  return (
    <Frame title="Overdraft">
      <div className="space-y-1.5 p-2">
        <p className="text-[9px] font-semibold tracking-[0.06em] text-sub uppercase">OD / CC limit</p>
        <p className="tabular text-[13px] font-semibold text-ink">₹12,00,00,000</p>
        <p className="text-[10px] text-copy">Available ₹9,40,00,000</p>
        <div className="h-1.5 overflow-hidden rounded-full bg-[#e7eef0]">
          <div className="h-full w-[78%] rounded-full bg-[#0e8ba3]" />
        </div>
        <p className="text-[9.5px] text-sub">Account type OD</p>
      </div>
    </Frame>
  );
}

function TapWindow() {
  return (
    <Frame title="Tap & Pay">
      <div className="relative h-[108px] w-full">
        <Image src="/hero/b-tap.jpg" alt="Contactless tap and pay controls" fill className="object-cover object-left" sizes="176px" />
      </div>
    </Frame>
  );
}

function Portrait({ flip }: { flip: boolean }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className="absolute top-1/2 left-1/2 z-10"
      style={{ width: CARD_W, height: CARD_H, x: -CARD_W / 2, y: -CARD_H / 2 }}
      initial={reduce ? false : { opacity: 0, rotateY: flip ? 180 : 86, scale: flip ? 0.86 : 0.92 }}
      animate={{ opacity: 1, rotateY: 0, scale: 1 }}
      transition={reduce ? { duration: 0 } : flip ? { duration: 0.7, ease } : { duration: 0.9, ease }}
    >
      <motion.div className="size-full" animate={reduce ? undefined : { y: [0, -10, 0] }} transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}>
        <div className="relative size-full overflow-hidden rounded-[18px] shadow-[0_28px_48px_-16px_rgba(3,163,95,0.55)]" style={{ background: "linear-gradient(165deg,#14975f 0%,#06321c 72%)" }}>
          <div className="absolute inset-0 bg-[linear-gradient(115deg,transparent_28%,rgba(255,255,255,0.2)_44%,transparent_60%)]" />
          <div className="absolute inset-0 rounded-[18px] ring-[1.5px] ring-[#b7eb8f]/75 ring-inset" />
          <Logo tone="dark" className="absolute top-5 left-4 h-5 w-auto" />
          <div className="absolute top-[92px] left-4 h-8 w-11 rounded-md bg-[linear-gradient(135deg,#f3dc9b,#c9a24f)]" />
          <div className="absolute inset-x-4 bottom-5">
            <p className="tabular text-[13px] tracking-[0.14em] text-white/90">•••• 4021</p>
            <p className="mt-1.5 text-[10px] font-medium tracking-[0.16em] text-lime uppercase">Business</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
