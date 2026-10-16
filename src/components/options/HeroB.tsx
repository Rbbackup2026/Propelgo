"use client";

import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { hero } from "@/content/home";
import { Button } from "@/components/ui/Button";
import { Check } from "@/components/ui/icons";
import { ProductGlyph } from "@/components/ui/ProductGlyph";

const ease = [0.16, 1, 0.3, 1] as const;

const tabs = [
  { key: "versa", label: "Versa", note: "Vendor payments" },
  { key: "odcc", label: "ODCC", note: "Commercial credit" },
  { key: "orchestration", label: "Orchestration", note: "Routing" },
] as const;

type TabKey = (typeof tabs)[number]["key"];

/** Direction B: centred editorial hero with a working product window underneath. */
export function HeroB() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-10% 0px" });
  const [tab, setTab] = useState<TabKey>("versa");
  const [manual, setManual] = useState(false);

  useEffect(() => {
    if (!inView || manual || reduce) return;
    const t = setTimeout(() => {
      const i = tabs.findIndex((x) => x.key === tab);
      setTab(tabs[(i + 1) % tabs.length].key);
    }, 6000);
    return () => clearTimeout(t);
  }, [tab, inView, manual, reduce]);

  const rise = (delay: number) =>
    reduce ? {} : { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.9, ease, delay } };

  return (
    <section className="relative overflow-hidden pt-[136px] pb-24 md:pt-[168px] md:pb-32">
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-[720px] bg-[radial-gradient(60%_60%_at_50%_0%,#f6ffee_0%,#ffffff_70%)]" />
      <div className="container-page relative text-center">
        <motion.p {...rise(0)} className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-[14px] font-medium text-brand ring-1 ring-mint">
          <span className="size-1.5 rounded-full bg-lime" /> {hero.eyebrow}
        </motion.p>
        <motion.h1 {...rise(0.06)} className="mx-auto mt-6 max-w-[18ch] text-display text-balance text-ink">
          {hero.headline}
        </motion.h1>
        <motion.p {...rise(0.14)} className="mx-auto mt-6 max-w-[56ch] text-lead text-pretty text-copy">
          {hero.copy}
        </motion.p>
        <motion.div {...rise(0.22)} className="mt-9 flex flex-wrap justify-center gap-3">
          <Button href={hero.primaryCta.href} size="lg">
            {hero.primaryCta.label}
          </Button>
          <Button href={hero.secondaryCta.href} size="lg" variant="secondary" arrow={false}>
            {hero.secondaryCta.label}
          </Button>
        </motion.div>

        <motion.div
          ref={ref}
          {...(reduce ? {} : { initial: { opacity: 0, y: 40 }, animate: { opacity: 1, y: 0 }, transition: { duration: 1.1, ease, delay: 0.3 } })}
          className="mx-auto mt-16 max-w-[1000px] overflow-hidden rounded-[22px] bg-white text-left shadow-[0_40px_80px_-40px_rgba(6,38,23,0.3)] ring-1 ring-line md:mt-20"
        >
          <div className="flex items-center gap-4 border-b border-line bg-surface px-4 py-3">
            <span className="flex gap-1.5" aria-hidden="true">
              <span className="size-2.5 rounded-full bg-ghost" />
              <span className="size-2.5 rounded-full bg-ghost" />
              <span className="size-2.5 rounded-full bg-ghost" />
            </span>
            <div role="tablist" aria-label="Product preview" className="flex gap-1 overflow-x-auto [scrollbar-width:none]">
              {tabs.map((t) => (
                <button
                  key={t.key}
                  type="button"
                  role="tab"
                  aria-selected={tab === t.key}
                  onClick={() => {
                    setManual(true);
                    setTab(t.key);
                  }}
                  className={`relative flex shrink-0 items-center gap-2 rounded-lg px-3 py-1.5 text-[13.5px] font-medium transition-colors ${
                    tab === t.key ? "text-ink" : "text-sub hover:text-copy"
                  }`}
                >
                  {tab === t.key && <motion.span layoutId="b-tab" className="absolute inset-0 rounded-lg bg-white ring-1 ring-line" transition={{ duration: 0.35, ease }} />}
                  <span className="relative">{t.label}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="relative h-[420px] md:h-[400px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={tab}
                className="absolute inset-0"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35, ease }}
              >
                {tab === "versa" && <VersaScreen />}
                {tab === "odcc" && <OdccScreen />}
                {tab === "orchestration" && <RoutingScreen />}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function ScreenShell({ kind, title, meta, children }: { kind: TabKey; title: string; meta: string; children: React.ReactNode }) {
  return (
    <div className="flex h-full">
      <aside className="hidden w-[200px] shrink-0 border-r border-line p-5 md:block">
        <span className="grid size-10 place-items-center rounded-xl bg-mist text-forest ring-1 ring-mint">
          <ProductGlyph kind={kind} className="size-6" />
        </span>
        <ul className="mt-6 space-y-1 text-[13.5px]">
          {["Overview", "Payments", "Approvals", "Reports"].map((n, i) => (
            <li key={n} className={`rounded-lg px-3 py-2 ${i === 1 ? "bg-surface font-medium text-ink" : "text-copy"}`}>
              {n}
            </li>
          ))}
        </ul>
      </aside>
      <div className="min-w-0 flex-1 p-5 md:p-7">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-[12.5px] text-sub">{meta}</p>
            <p className="mt-0.5 text-[18px] font-semibold tracking-[-0.015em] text-ink">{title}</p>
          </div>
        </div>
        <div className="mt-5">{children}</div>
      </div>
    </div>
  );
}

function Status({ s }: { s: "Paid" | "Approved" | "Pending" }) {
  const tone = s === "Paid" ? "bg-mint text-forest" : s === "Approved" ? "bg-mist text-brand ring-1 ring-mint" : "bg-surface text-copy";
  return <span className={`rounded-full px-2.5 py-1 text-[12px] font-medium whitespace-nowrap ${tone}`}>{s}</span>;
}

function VersaScreen() {
  const rows = [
    { v: "Skyline Hotels Pvt Ltd", c: "•••• 4021", a: "₹2,48,500", s: "Paid" as const },
    { v: "Aerolink Travels", c: "•••• 7713", a: "₹86,240", s: "Approved" as const },
    { v: "Meridian Supplies Co.", c: "•••• 3390", a: "₹4,12,000", s: "Pending" as const },
    { v: "Northfield Logistics", c: "•••• 5128", a: "₹1,05,600", s: "Paid" as const },
    { v: "Cloudnine Software", c: "•••• 9042", a: "₹19,800", s: "Paid" as const },
  ];
  return (
    <ScreenShell kind="versa" title="Vendor payments" meta="Versa · This week">
      <div className="overflow-hidden rounded-xl ring-1 ring-line">
        <div className="grid grid-cols-[1.6fr_1fr_auto] gap-4 bg-surface px-4 py-2.5 text-[12px] font-medium text-sub sm:grid-cols-[1.6fr_1fr_1fr_auto]">
          <span>Vendor</span>
          <span className="hidden sm:block">Virtual card</span>
          <span>Amount</span>
          <span>Status</span>
        </div>
        {rows.map((r, i) => (
          <motion.div
            key={r.v}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, ease, delay: 0.08 * i }}
            className="grid grid-cols-[1.6fr_1fr_auto] items-center gap-4 border-t border-line px-4 py-3 text-[13.5px] sm:grid-cols-[1.6fr_1fr_1fr_auto]"
          >
            <span className="truncate font-medium text-ink">{r.v}</span>
            <span className="tabular hidden text-copy sm:block">{r.c}</span>
            <span className="tabular text-ink">{r.a}</span>
            <Status s={r.s} />
          </motion.div>
        ))}
      </div>
    </ScreenShell>
  );
}

function OdccScreen() {
  const spends = [
    { m: "Supplier · Meridian Supplies", a: "₹4,12,000" },
    { m: "Travel · Aerolink Travels", a: "₹86,240" },
    { m: "Utilities · State Power Board", a: "₹1,24,300" },
  ];
  return (
    <ScreenShell kind="odcc" title="Credit on card" meta="ODCC · OD/CC facility">
      <div className="grid gap-4 sm:grid-cols-[1fr_1.2fr]">
        <div className="rounded-xl bg-mist p-5 ring-1 ring-mint">
          <p className="text-[12.5px] text-copy">Sanctioned limit</p>
          <p className="tabular mt-1 text-[26px] font-semibold tracking-[-0.02em] text-ink">₹5,00,00,000</p>
          <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-white ring-1 ring-mint">
            <motion.div className="h-full rounded-full bg-brand" initial={{ width: 0 }} animate={{ width: "38%" }} transition={{ duration: 1.1, ease, delay: 0.2 }} />
          </div>
          <div className="mt-3 flex justify-between text-[12.5px]">
            <span className="text-ink">₹1.9 Cr on card</span>
            <span className="text-copy">₹3.1 Cr available</span>
          </div>
        </div>
        <div className="rounded-xl ring-1 ring-line">
          <p className="border-b border-line px-4 py-2.5 text-[12px] font-medium text-sub">Recent card spends</p>
          {spends.map((s, i) => (
            <motion.div
              key={s.m}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease, delay: 0.25 + i * 0.08 }}
              className="flex items-center justify-between gap-3 border-b border-line px-4 py-3 text-[13.5px] last:border-0"
            >
              <span className="truncate text-ink">{s.m}</span>
              <span className="tabular shrink-0 font-medium text-ink">{s.a}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </ScreenShell>
  );
}

function RoutingScreen() {
  const log = [
    { id: "TXN-88214", amt: "₹14,20,000", via: "Bank A", rule: "High value" },
    { id: "TXN-88215", amt: "₹3,60,000", via: "Bank B", rule: "Default" },
    { id: "TXN-88216", amt: "₹62,000", via: "Network B", rule: "Domestic card" },
    { id: "TXN-88217", amt: "₹22,75,000", via: "Bank A", rule: "High value" },
  ];
  return (
    <ScreenShell kind="orchestration" title="Routing log" meta="Orchestration Layer · Live">
      <ul className="space-y-2.5">
        {log.map((l, i) => (
          <motion.li
            key={l.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease, delay: 0.1 * i }}
            className="flex items-center gap-3 rounded-xl px-4 py-3 ring-1 ring-line"
          >
            <span className="grid size-7 shrink-0 place-items-center rounded-full bg-mint text-brand">
              <Check className="size-3" />
            </span>
            <span className="tabular hidden w-[92px] text-[13px] text-copy sm:block">{l.id}</span>
            <span className="tabular flex-1 text-[14px] font-semibold text-ink">{l.amt}</span>
            <span className="hidden text-[12.5px] text-sub md:block">{l.rule}</span>
            <span className="rounded-full bg-surface px-3 py-1 text-[12.5px] font-medium text-ink">→ {l.via}</span>
          </motion.li>
        ))}
      </ul>
    </ScreenShell>
  );
}
