"use client";

import Image from "next/image";
import { motion } from "motion/react";
import type { ProductKey } from "@/content/home";
import { LogoMark } from "@/components/ui/Logo";
import { usePhaseLoop } from "@/lib/useStageScale";
import { PaymentGlobe } from "./PaymentGlobe";

const ease = [0.16, 1, 0.3, 1] as const;

/** Front-of-card illustration. `active` is true while the card is hovered or focused. */
export function ProductArt({ kind, active }: { kind: ProductKey; active: boolean }) {
  if (kind === "versa") return <VersaArt active={active} />;
  if (kind === "odcc") return <OdccArt active={active} />;
  return <OrchestrationArt active={active} />;
}

/** The Versa admin dashboard, with the virtual card it issues sitting on top of it. */
function VersaArt({ active }: { active: boolean }) {
  return (
    <div className="relative h-full overflow-hidden">
      <Image
        src="/products/versa-flow.jpg"
        alt="The PropelGo Versa dashboard with cards, spend overview and transactions"
        fill
        sizes="320px"
        className="object-cover object-left-top"
      />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_42%,rgba(255,255,255,0.72))]" />
      <motion.div
        className="absolute right-3 bottom-2 flex h-[78px] w-[132px] flex-col justify-between rounded-xl p-2.5 text-white shadow-[0_16px_28px_-14px_rgba(6,38,23,0.65)]"
        style={{ background: "linear-gradient(145deg,#0c8a52 0%,#062617 80%)" }}
        initial={false}
        animate={{ y: active ? -12 : 0, rotate: active ? -7 : -4, scale: active ? 1.06 : 1 }}
        transition={{ duration: 0.6, ease }}
      >
        <span className="flex items-center justify-between">
          <span className="grid size-5 place-items-center rounded-full bg-white">
            <LogoMark className="size-3.5" />
          </span>
          <span className="text-[8px] font-medium tracking-[0.08em] text-white/70 uppercase">Virtual card</span>
        </span>
        <span>
          <span className="block text-[10px] font-semibold tracking-[-0.01em]">Versa</span>
          <span className="tabular block text-[9px] tracking-[0.12em] text-white/80">•••• 4021</span>
        </span>
      </motion.div>
    </div>
  );
}

/** A PropelGo ODCC card held in a hand. */
function OdccArt({ active }: { active: boolean }) {
  return (
    <div className="relative h-full overflow-hidden">
      <motion.div
        className="absolute inset-x-3 top-3 bottom-0"
        initial={false}
        animate={{ y: active ? -6 : 0, scale: active ? 1.03 : 1 }}
        transition={{ duration: 0.6, ease }}
      >
        <Image src="/products/odcc-card.png" alt="A hand holding a PropelGo ODCC commercial credit card" fill sizes="280px" className="object-contain object-bottom" />
      </motion.div>
    </div>
  );
}

/** The payment globe, with the orchestration layer around it: each payment leaves the globe for a gateway. */
const GATEWAYS = [
  { label: "PayU", x: 40, y: 20 },
  { label: "Razorpay", x: 248, y: 20 },
  { label: "Easebuzz", x: 40, y: 156 },
  { label: "PhonePe", x: 248, y: 156 },
];
const HUB = { x: 144, y: 88 };
const route = (x: number, y: number) => `M ${HUB.x} ${HUB.y} C ${HUB.x + (x - HUB.x) * 0.35} ${HUB.y}, ${x} ${HUB.y + (y - HUB.y) * 0.4}, ${x} ${y}`;

function OrchestrationArt({ active }: { active: boolean }) {
  const { phase } = usePhaseLoop(GATEWAYS.length, 1600, active);
  const live = active ? phase : -1;

  return (
    <div className="relative grid h-full place-items-center">
      <div className="relative h-[176px] w-[288px]">
        <svg viewBox="0 0 288 176" className="absolute inset-0 size-full" fill="none" aria-hidden="true">
          <circle cx={HUB.x} cy={HUB.y} r="78" stroke="#017649" strokeOpacity="0.16" strokeDasharray="2 4" />
          {GATEWAYS.map((g, i) => (
            <motion.path
              key={g.label}
              d={route(g.x, g.y)}
              stroke={i === live ? "#017649" : "#bfdcc8"}
              strokeWidth="1.5"
              strokeLinecap="round"
              initial={false}
              animate={{ pathLength: i === live ? [0, 1] : 1, pathOffset: i === live ? [0, 0] : 0 }}
              transition={{ duration: 0.7, ease }}
            />
          ))}
        </svg>

        <PaymentGlobe className="pointer-events-none absolute top-1/2 left-1/2 w-[148px] -translate-x-1/2 -translate-y-1/2" />

        {GATEWAYS.map((g, i) => {
          const on = i === live;
          return (
            <span
              key={g.label}
              className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-white px-2.5 py-1 text-[11px] font-medium whitespace-nowrap shadow-[0_8px_16px_-10px_rgba(1,118,73,0.5)] ring-1 transition-colors duration-300"
              style={{ left: g.x, top: g.y, color: on ? "#04452b" : "#595959", borderColor: "transparent", boxShadow: on ? "inset 0 0 0 1px #017649, 0 8px 16px -10px rgba(1,118,73,0.6)" : undefined }}
            >
              <span className="mr-1.5 inline-block size-1.5 rounded-full align-middle" style={{ background: on ? "#017649" : "#c9e3cf" }} />
              {g.label}
            </span>
          );
        })}
      </div>
    </div>
  );
}
