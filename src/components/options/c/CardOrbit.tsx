"use client";

import { animate, motion, useMotionValue, useReducedMotion, useTransform, type MotionValue } from "motion/react";
import Image from "next/image";
import { useEffect, type CSSProperties } from "react";
import { Logo } from "@/components/ui/Logo";

const ease = [0.16, 1, 0.3, 1] as const;
const CARD_W = 152;
const CARD_H = 242;
const STAGE_W = 640;
const STAGE_H = 590;
const CX = STAGE_W / 2;
const CY = STAGE_H / 2;
const WIN_W = 176;
const WIN_H = 124;

/** Whole screens from the Single flow file, one per product surface. */
const SCREENS = [
  { src: "/hero/screen-dashboard.jpg", label: "Dashboard", phase: 0 },
  { src: "/hero/screen-funds.jpg", label: "Fund projection", phase: 0.2 },
  { src: "/hero/screen-vendors.jpg", label: "Manage vendor", phase: 0.4 },
  { src: "/hero/screen-maker.jpg", label: "Maker / checker", phase: 0.6 },
  { src: "/hero/screen-approvals.jpg", label: "Approvals", phase: 0.8 },
] as const;

/** Direction C, Versa beat: a portrait card, with the five Versa screens turning around it on dotted lines. */
export function CardOrbit({ live }: { live: boolean }) {
  const reduce = useReducedMotion();
  const t = useMotionValue(0);

  useEffect(() => {
    if (!live || reduce) return;
    const run = animate(t, 1, { duration: 16, ease: "linear", repeat: Infinity });
    return () => run.stop();
  }, [live, reduce, t]);

  return (
    <div className="absolute inset-0 [perspective:1100px]">
      <svg viewBox={`0 0 ${STAGE_W} ${STAGE_H}`} className="pointer-events-none absolute inset-0 size-full" aria-hidden="true">
        {SCREENS.map((screen) =>
          reduce ? (
            <StaticLink key={screen.label} phase={screen.phase} />
          ) : (
            <OrbitLink key={screen.label} t={t} phase={screen.phase} />
          ),
        )}
      </svg>
      {SCREENS.map((screen, i) =>
        reduce ? (
          <div key={screen.label} className="absolute" style={stillAt(screen.phase)}>
            <ScreenFrame screen={screen} />
          </div>
        ) : (
          <OrbitScreen key={screen.label} screen={screen} t={t} live={live} delay={0.15 * i} />
        ),
      )}
      <PortraitCard live={live} reduce={!!reduce} />
    </div>
  );
}

function stillAt(phase: number): CSSProperties {
  const a = phase * Math.PI * 2;
  return { left: CX + Math.sin(a) * 176 - WIN_W / 2, top: CY - Math.cos(a) * 142 - WIN_H / 2 };
}

function OrbitLink({ t, phase }: { t: MotionValue<number>; phase: number }) {
  const angle = useTransform(t, (v) => (v + phase) * Math.PI * 2);
  const x2 = useTransform(angle, (a) => CX + Math.sin(a) * 176);
  const y2 = useTransform(angle, (a) => CY - Math.cos(a) * 142);
  return (
    <motion.line
      x1={CX}
      y1={CY}
      x2={x2}
      y2={y2}
      stroke="#8fd46a"
      strokeOpacity={0.9}
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeDasharray="1.5 7"
    />
  );
}

function StaticLink({ phase }: { phase: number }) {
  const a = phase * Math.PI * 2;
  return <line x1={CX} y1={CY} x2={CX + Math.sin(a) * 176} y2={CY - Math.cos(a) * 142} stroke="#8fd46a" strokeWidth={1.6} strokeLinecap="round" strokeDasharray="1.5 7" />;
}

function OrbitScreen({ screen, t, live, delay }: { screen: (typeof SCREENS)[number]; t: MotionValue<number>; live: boolean; delay: number }) {
  const angle = useTransform(t, (v) => (v + screen.phase) * Math.PI * 2);
  const x = useTransform(angle, (a) => Math.sin(a) * 176);
  const y = useTransform(angle, (a) => -Math.cos(a) * 142);
  const rotateY = useTransform(angle, (a) => Math.sin(a) * 78);
  const scale = useTransform(angle, (a) => 0.9 + (Math.cos(a) + 1) * 0.06);

  return (
    <motion.div className="pointer-events-none absolute inset-0" initial={{ opacity: 0 }} animate={live ? { opacity: 1 } : { opacity: 0 }} transition={{ delay: live ? 1 + delay : 0, duration: 0.5, ease }}>
      <motion.div className="absolute top-1/2 left-1/2" style={{ x, y, rotateY, scale, marginLeft: -WIN_W / 2, marginTop: -WIN_H / 2, transformStyle: "preserve-3d" }}>
        <ScreenFrame screen={screen} />
      </motion.div>
    </motion.div>
  );
}

function ScreenFrame({ screen }: { screen: (typeof SCREENS)[number] }) {
  return (
    <div className="overflow-hidden rounded-xl bg-white shadow-[0_18px_36px_-18px_rgba(6,38,23,0.45)] ring-1 ring-black/[0.08]" style={{ width: WIN_W }}>
      <div className="flex items-center gap-1.5 border-b border-black/[0.05] bg-white px-2 py-1">
        <span className="size-1.5 rounded-full bg-brand" />
        <span className="truncate text-[10px] font-semibold tracking-[-0.01em] text-ink">{screen.label}</span>
      </div>
      <Image src={screen.src} alt="" width={WIN_W} height={WIN_H} className="h-[108px] w-full object-cover object-top" />
    </div>
  );
}

function PortraitCard({ live, reduce }: { live: boolean; reduce: boolean }) {
  return (
    <motion.div
      className="absolute top-1/2 left-1/2 z-10"
      style={{ width: CARD_W, height: CARD_H, x: -CARD_W / 2, y: -CARD_H / 2 }}
      initial={reduce ? false : { opacity: 0, rotateY: 86, scale: 0.9 }}
      animate={live || reduce ? { opacity: 1, rotateY: 0, scale: 1 } : { opacity: 0 }}
      transition={{ duration: 0.95, ease }}
    >
      <motion.div className="size-full" animate={live && !reduce ? { y: [0, -12, 0] } : { y: 0 }} transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut", delay: 0.95 }}>
        <div className="relative size-full overflow-hidden rounded-[18px] shadow-[0_28px_48px_-16px_rgba(3,163,95,0.55)]" style={{ background: "linear-gradient(165deg,#14975f 0%,#06321c 72%)" }}>
          <div className="absolute inset-0 bg-[linear-gradient(115deg,transparent_28%,rgba(255,255,255,0.2)_44%,transparent_60%)]" />
          <div className="absolute inset-0 rounded-[18px] ring-[1.5px] ring-[#b7eb8f]/75 ring-inset" />
          <Logo tone="dark" className="absolute top-5 left-4 h-5 w-auto" />
          <svg viewBox="0 0 24 24" className="absolute top-5 right-4 size-5 text-white/70" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
            <path d="M8 8.5a5 5 0 0 1 0 7M11.5 6a8.5 8.5 0 0 1 0 12M15 3.5a12 12 0 0 1 0 17" />
          </svg>
          <div className="absolute top-[92px] left-4 h-8 w-11 rounded-md bg-[linear-gradient(135deg,#f3dc9b,#c9a24f)]">
            <div className="absolute inset-x-0 top-1/2 h-px bg-black/20" />
            <div className="absolute inset-y-0 left-1/2 w-px bg-black/20" />
          </div>
          <div className="absolute inset-x-4 bottom-5">
            <p className="tabular text-[13px] tracking-[0.14em] text-white/90">•••• 4021</p>
            <p className="mt-1.5 text-[10px] font-medium tracking-[0.16em] text-lime uppercase">Business</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
