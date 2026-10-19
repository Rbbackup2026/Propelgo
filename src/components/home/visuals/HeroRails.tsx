"use client";

import { motion } from "motion/react";

/** Card centre in HeroStage coordinates (580 x 600); every rail terminates here, hidden under the card. */
const HUB = { x: 290, y: 309 };
const BASE = 0.45;

type Side = "top" | "bottom" | "right";
type Rail = { label?: string; x: number; y: number; side: Side; dur: number; begin: number; outbound?: boolean; color: string };

const INDIGO = "#5b57d9";
const TEAL = "#0e8ba3";
const ROSE = "#c8507a";
const AMBER = "#d9822b";
/** Packets travel slower than the listed durations so the hero reads calm. */
const PACE = 1.5;

/** Chips sit above, below and right of the stage panels so they never collide with them. Unlabelled rails enter from off-canvas. */
const rails: Rail[] = [
  { label: "ERP", x: 70, y: -56, side: "top", dur: 4.6, begin: 0, color: INDIGO },
  { label: "Bank APIs", x: 300, y: -56, side: "top", dur: 5.2, begin: 1.4, outbound: true, color: TEAL },
  { label: "UPI", x: 520, y: -56, side: "top", dur: 3.8, begin: 0.6, color: ROSE },
  { label: "NEFT", x: 80, y: 694, side: "bottom", dur: 5, begin: 2.8, outbound: true, color: TEAL },
  { label: "RTGS", x: 250, y: 704, side: "bottom", dur: 4.4, begin: 1.1, color: INDIGO },
  { label: "IMPS", x: 410, y: 704, side: "bottom", dur: 4.8, begin: 3.3, outbound: true, color: AMBER },
  { label: "Cards", x: 560, y: 694, side: "bottom", dur: 4.2, begin: 1.9, color: ROSE },
];

function railPath({ x, y, side }: Rail) {
  const pull = HUB.x + (x - HUB.x) * 0.35;
  if (side === "right") return `M ${x} ${y} C ${x - 260} ${y}, ${HUB.x + 200} ${HUB.y + (y - HUB.y) * 0.3}, ${HUB.x} ${HUB.y}`;
  const dir = side === "top" ? 1 : -1;
  return `M ${x} ${y} C ${x} ${y + 170 * dir}, ${pull} ${HUB.y - 150 * dir}, ${HUB.x} ${HUB.y}`;
}

/** Payment rails flowing into the card, with transactions travelling along them. */
export function HeroRails({ animate, ready }: { animate: boolean; ready: boolean }) {
  return (
    <motion.div
      className="pointer-events-none absolute inset-0"
      initial={{ opacity: 0 }}
      animate={ready ? { opacity: 1 } : undefined}
      transition={{ duration: 1.2, delay: BASE + 0.9 }}
    >
      <svg viewBox="0 0 580 600" className="absolute inset-0 size-full overflow-visible" fill="none">
        {animate && (
          <circle cx={HUB.x} cy={HUB.y} r="150" stroke={TEAL} strokeWidth="1">
            <animate attributeName="r" values="150;320" dur="4.8s" repeatCount="indefinite" />
            <animate attributeName="stroke-opacity" values="0.16;0" dur="4.8s" repeatCount="indefinite" />
          </circle>
        )}

        {rails.map((rail, i) => {
          const d = railPath(rail);
          const keys = rail.outbound ? { keyPoints: "1;0", keyTimes: "0;1", calcMode: "linear" as const } : {};
          return (
            <g key={i}>
              <path d={d} stroke="#017649" strokeOpacity="0.14" strokeWidth="1.25" />
              <path d={d} stroke={rail.color} strokeOpacity="0.32" strokeWidth="1.25" strokeDasharray="2 10" />
              {animate && (
                <circle r="3" fill={rail.color} stroke="#fff" strokeWidth="1.5">
                  <animateMotion dur={`${rail.dur * PACE}s`} begin={`${rail.begin * PACE}s`} repeatCount="indefinite" path={d} {...keys} />
                </circle>
              )}
            </g>
          );
        })}
      </svg>

      {rails.map(
        (rail, i) =>
          rail.label && (
            <span key={rail.label} className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: rail.x, top: rail.y }}>
              <span
                className={`flex items-center gap-1.5 rounded-full bg-white py-1.5 pr-3 pl-2 text-[12px] font-semibold tracking-[-0.005em] whitespace-nowrap text-forest shadow-[0_1px_2px_rgba(6,38,23,0.06),0_8px_20px_-10px_rgba(6,38,23,0.25)] ring-1 ring-black/[0.06] ${animate ? "animate-[chip-bob_5s_ease-in-out_infinite]" : ""}`}
                style={animate ? { animationDelay: `${-i * 0.7}s` } : undefined}
              >
                <span className="size-1.5 rounded-full" style={{ backgroundColor: rail.color }} />
                {rail.label}
              </span>
            </span>
          ),
      )}
    </motion.div>
  );
}
