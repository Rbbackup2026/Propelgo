"use client";

import { motion } from "motion/react";
import type { ProductKey } from "@/content/home";

const ease = [0.16, 1, 0.3, 1] as const;

/** Front-of-card illustration. `active` is true while the card is hovered or focused. */
export function ProductArt({ kind, active }: { kind: ProductKey; active: boolean }) {
  if (kind === "versa") return <VersaArt active={active} />;
  if (kind === "odcc") return <OdccArt active={active} />;
  return <OrchestrationArt active={active} />;
}

/** Vendor invoices fanned like paper, with a virtual card sliding in to pay them. */
function VersaArt({ active }: { active: boolean }) {
  const invoices = [
    { name: "Skyline Hotels", amt: "₹2,48,500", r: -9, x: -72, y: 6 },
    { name: "Aerolink Travels", amt: "₹86,240", r: 8, x: 62, y: 0 },
    { name: "Meridian Supplies", amt: "₹4,12,000", r: -1, x: -8, y: -10 },
  ];
  return (
    <div className="relative grid h-full place-items-center">
      {invoices.map((inv, i) => (
        <motion.div
          key={inv.name}
          className="absolute w-[150px] rounded-lg bg-white p-3 shadow-[0_8px_20px_-10px_rgba(31,31,31,0.25)] ring-1 ring-line"
          initial={false}
          animate={{ rotate: active ? inv.r * 1.4 : inv.r, x: active ? inv.x * 1.15 : inv.x, y: inv.y - (active ? 12 : 0) }}
          transition={{ duration: 0.6, ease, delay: i * 0.03 }}
        >
          <p className="text-[9.5px] text-sub">Invoice</p>
          <p className="mt-0.5 truncate text-[11.5px] font-semibold text-ink">{inv.name}</p>
          <div className="mt-2 space-y-1">
            <div className="h-1 w-full rounded-full bg-surface" />
            <div className="h-1 w-3/4 rounded-full bg-surface" />
          </div>
          <p className="tabular mt-2 text-right text-[11px] font-semibold text-ink">{inv.amt}</p>
        </motion.div>
      ))}
      <motion.div
        className="absolute h-[62px] w-[100px] rounded-lg p-2.5 text-white shadow-[0_12px_24px_-10px_rgba(6,38,23,0.5)]"
        style={{ background: "linear-gradient(140deg,#017649,#062617)" }}
        initial={false}
        animate={{ x: active ? 64 : 92, y: active ? 66 : 78, rotate: active ? -4 : 6, opacity: 1 }}
        transition={{ duration: 0.6, ease }}
      >
        <p className="text-[7.5px] text-white/70">Virtual card</p>
        <p className="tabular mt-4 text-[9px] tracking-[0.08em]">•••• 4021</p>
      </motion.div>
    </div>
  );
}

/** A credit-limit gauge: the existing OD/CC limit, with part of it put to work on a card. */
function OdccArt({ active }: { active: boolean }) {
  const r = 78;
  const arc = `M ${100 - r} 100 A ${r} ${r} 0 0 1 ${100 + r} 100`;
  return (
    <div className="relative grid h-full place-items-center">
      <div className="relative w-[220px]">
        <svg viewBox="0 0 200 112" className="w-full" fill="none" aria-hidden="true">
          <path d={arc} stroke="#E8E8E8" strokeWidth="14" strokeLinecap="round" />
          <motion.path
            d={arc}
            stroke="#95DE64"
            strokeWidth="14"
            strokeLinecap="round"
            initial={false}
            animate={{ pathLength: active ? 0.82 : 0.58 }}
            transition={{ duration: 0.9, ease }}
          />
          <motion.path
            d={arc}
            stroke="#017649"
            strokeWidth="14"
            strokeLinecap="round"
            initial={false}
            animate={{ pathLength: active ? 0.46 : 0.3 }}
            transition={{ duration: 0.9, ease, delay: 0.05 }}
          />
        </svg>
        <div className="absolute inset-x-0 bottom-0 text-center">
          <p className="text-[10.5px] text-sub">OD/CC limit</p>
          <p className="tabular text-[20px] font-semibold tracking-[-0.02em] text-ink">₹5 Cr</p>
        </div>
      </div>
      <div className="absolute bottom-3 flex gap-4 text-[10.5px] text-copy">
        <span className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-brand" /> On card
        </span>
        <span className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-lime" /> Available
        </span>
      </div>
    </div>
  );
}

/** One checkout integration in, routed out to many payment gateways: a light line schematic. */
function OrchestrationArt({ active }: { active: boolean }) {
  const outs = [
    { y: 30, label: "PayU" },
    { y: 72, label: "Razorpay" },
    { y: 114, label: "Easebuzz" },
    { y: 156, label: "PhonePe" },
  ];
  return (
    <div className="relative grid h-full place-items-center">
      <svg viewBox="0 0 280 186" className="w-full max-w-[290px]" fill="none" aria-hidden="true">
        <rect x="6" y="75" width="64" height="36" rx="8" fill="#fff" stroke="#E8E8E8" />
        <text x="38" y="97" textAnchor="middle" fontSize="11" fontWeight="600" fill="#1F1F1F">
          Checkout
        </text>
        <path d="M70 93h34" stroke="#CFCFCF" strokeWidth="1.5" />
        <rect x="104" y="60" width="62" height="66" rx="12" fill="#017649" />
        <text x="135" y="97" textAnchor="middle" fontSize="10.5" fontWeight="600" fill="#fff">
          Router
        </text>
        {outs.map((o, i) => (
          <g key={o.label}>
            <motion.path
              d={`M166 93 C 196 93, 190 ${o.y}, 214 ${o.y}`}
              stroke={active ? "#017649" : "#CFCFCF"}
              strokeWidth="1.5"
              initial={false}
              animate={{ pathLength: active ? [0, 1] : 1 }}
              transition={{ duration: 0.55, ease, delay: active ? i * 0.08 : 0 }}
            />
            <rect x="214" y={o.y - 13} width="60" height="26" rx="13" fill="#fff" stroke="#E8E8E8" />
            <text x="244" y={o.y + 4} textAnchor="middle" fontSize="10.5" fill="#595959">
              {o.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
