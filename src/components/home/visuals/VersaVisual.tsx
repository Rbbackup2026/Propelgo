"use client";

import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { useRef } from "react";
import { Check } from "@/components/ui/icons";
import { usePhaseLoop } from "@/lib/useStageScale";

type Status = "Paid" | "Approval 1/2" | "Approval 2/2" | "Scheduled" | "Due today";

const tone: Record<Status, string> = {
  Paid: "bg-mint text-leaf",
  "Approval 1/2": "bg-[#fbf0d9] text-amber",
  "Approval 2/2": "bg-[#fbf0d9] text-amber",
  Scheduled: "bg-paper-200 text-ink-soft",
  "Due today": "bg-forest text-signal",
};

const rows = [
  { initials: "KL", name: "Kaveri Logistics", amount: "₹4,82,500", card: "8812", color: "bg-forest" },
  { initials: "SP", name: "Sahyadri Packaging", amount: "₹1,26,000", card: "3047", color: "bg-ink-soft" },
  { initials: "NT", name: "Nimbus Travel Desk", amount: "₹68,240", card: "5519", color: "bg-leaf" },
];

const timeline: Status[][] = [
  ["Paid", "Approval 1/2", "Scheduled"],
  ["Paid", "Approval 2/2", "Scheduled"],
  ["Paid", "Paid", "Due today"],
];

export function VersaVisual() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const inView = useInView(ref, { margin: "-15% 0px" });
  const { phase } = usePhaseLoop(3, 2200, inView && !reduce);
  const statuses = timeline[reduce ? 2 : phase];

  return (
    <div ref={ref} className="overflow-hidden rounded-2xl border border-paper-300 bg-white shadow-[0_20px_50px_-30px_rgba(6,38,23,0.35)]">
      <div className="flex items-center justify-between border-b border-paper-200 px-4 py-3">
        <p className="label !text-[9.5px] text-muted">Vendor payments · This week</p>
        <p className="tabular font-mono text-[11px] text-ink">₹6,76,740</p>
      </div>
      <div className="grid grid-cols-[1.5fr_1fr_1.15fr] gap-2 px-4 pt-3 pb-1.5 sm:grid-cols-[1.6fr_1fr_0.7fr_1fr]">
        {["Vendor", "Amount", "Card", "Status"].map((h) => (
          <p key={h} className={`label !text-[9px] text-muted/80 ${h === "Card" ? "hidden sm:block" : ""}`}>
            {h}
          </p>
        ))}
      </div>
      <ul>
        {rows.map((r, i) => {
          const s = statuses[i];
          const justPaid = i === 1 && s === "Paid";
          return (
            <motion.li
              key={r.name}
              initial={reduce ? false : { opacity: 0, x: -14 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.15 + i * 0.12, ease: [0.16, 1, 0.3, 1] }}
              className={`grid grid-cols-[1.5fr_1fr_1.15fr] items-center gap-2 border-t sm:grid-cols-[1.6fr_1fr_0.7fr_1fr] border-paper-200 px-4 py-3 transition-colors duration-500 ${
                justPaid ? "bg-mint-50" : ""
              }`}
            >
              <span className="flex min-w-0 items-center gap-2.5">
                <span className={`hidden size-7 shrink-0 place-items-center rounded-md sm:grid text-[10px] font-semibold text-white ${r.color}`}>{r.initials}</span>
                <span className="truncate text-[13px] font-medium text-ink">{r.name}</span>
              </span>
              <span className="tabular font-mono text-[12px] text-ink">{r.amount}</span>
              <span className="hidden truncate font-mono text-[11px] text-muted sm:block">·· {r.card}</span>
              <span className="relative h-6">
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.span
                    key={s}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    className={`absolute inset-y-0 left-0 flex items-center gap-1 rounded-full px-2.5 text-[11px] font-medium whitespace-nowrap ${tone[s]}`}
                  >
                    {s === "Paid" && <Check className="size-2.5" />}
                    {s}
                  </motion.span>
                </AnimatePresence>
              </span>
            </motion.li>
          );
        })}
      </ul>
    </div>
  );
}
