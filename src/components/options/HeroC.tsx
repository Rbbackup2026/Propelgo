"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useId, useState } from "react";
import { hero } from "@/content/home";
import { Button } from "@/components/ui/Button";
import { LogoMark } from "@/components/ui/Logo";
import { Check, ContactlessIcon, LockIcon } from "@/components/ui/icons";

const ease = [0.16, 1, 0.3, 1] as const;
const inr = new Intl.NumberFormat("en-IN");
const categories = ["Travel", "Vendors", "Software", "Utilities"] as const;

/** Direction C: card-led hero where visitors set real spend controls and watch the card respond. */
export function HeroC() {
  const reduce = useReducedMotion();
  const sliderId = useId();
  const [limit, setLimit] = useState(250000);
  const [allowed, setAllowed] = useState<string[]>(["Travel", "Vendors"]);
  const [mode, setMode] = useState<"Recurring" | "Single-use">("Recurring");
  const [frozen, setFrozen] = useState(false);

  const toggle = (c: string) => setAllowed((a) => (a.includes(c) ? a.filter((x) => x !== c) : [...a, c]));
  const rise = (delay: number) =>
    reduce ? {} : { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.9, ease, delay } };

  return (
    <section className="pt-[128px] pb-24 md:pt-[148px] md:pb-32">
      <div className="container-page grid items-center gap-14 lg:grid-cols-[1fr_minmax(0,520px)] lg:gap-16">
        <div className="max-w-[560px]">
          <motion.p {...rise(0)} className="text-[15px] font-medium text-brand">
            {hero.eyebrow}
          </motion.p>
          <motion.h1 {...rise(0.06)} className="mt-5 text-display text-balance text-ink">
            {hero.headline}
          </motion.h1>
          <motion.p {...rise(0.14)} className="mt-6 max-w-[50ch] text-lead text-pretty text-copy">
            {hero.copy}
          </motion.p>
          <motion.div {...rise(0.22)} className="mt-9 flex flex-wrap gap-3">
            <Button href={hero.primaryCta.href} size="lg">
              {hero.primaryCta.label}
            </Button>
            <Button href={hero.secondaryCta.href} size="lg" variant="secondary" arrow={false}>
              {hero.secondaryCta.label}
            </Button>
          </motion.div>
          <motion.p {...rise(0.3)} className="mt-10 flex items-center gap-2 text-[14px] text-sub">
            <span className="grid size-5 place-items-center rounded-full bg-mint text-brand">
              <Check className="size-2.5" />
            </span>
            Try it: set a limit and categories, the card updates instantly.
          </motion.p>
        </div>

        <motion.div
          {...(reduce ? {} : { initial: { opacity: 0, y: 30 }, animate: { opacity: 1, y: 0 }, transition: { duration: 1, ease, delay: 0.2 } })}
          className="rounded-[28px] bg-surface p-5 ring-1 ring-line sm:p-7"
        >
          <ControlCard limit={limit} allowed={allowed} mode={mode} frozen={frozen} />

          <div className="mt-6 space-y-6 rounded-2xl bg-white p-5 ring-1 ring-line sm:p-6">
            <div>
              <div className="flex items-center justify-between">
                <label htmlFor={sliderId} className="text-[14px] font-medium text-ink">
                  Monthly limit
                </label>
                <span className="tabular text-[15px] font-semibold text-ink">₹{inr.format(limit)}</span>
              </div>
              <input
                id={sliderId}
                type="range"
                min={10000}
                max={1000000}
                step={10000}
                value={limit}
                onChange={(e) => setLimit(Number(e.target.value))}
                className="mt-3 w-full accent-brand"
              />
            </div>

            <fieldset>
              <legend className="text-[14px] font-medium text-ink">Allowed categories</legend>
              <div className="mt-3 flex flex-wrap gap-2">
                {categories.map((c) => {
                  const on = allowed.includes(c);
                  return (
                    <button
                      key={c}
                      type="button"
                      aria-pressed={on}
                      onClick={() => toggle(c)}
                      className={`flex items-center gap-1.5 rounded-full px-3.5 py-2 text-[13.5px] font-medium transition-colors ${
                        on ? "bg-mist text-brand ring-1 ring-lime" : "bg-white text-copy ring-1 ring-line hover:ring-ghost"
                      }`}
                    >
                      {on && <Check className="size-2.5" />}
                      {c}
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <div className="flex flex-wrap items-center justify-between gap-4">
              <div role="radiogroup" aria-label="Card type" className="flex rounded-full bg-surface p-1">
                {(["Recurring", "Single-use"] as const).map((m) => (
                  <button
                    key={m}
                    type="button"
                    role="radio"
                    aria-checked={mode === m}
                    onClick={() => setMode(m)}
                    className={`relative rounded-full px-4 py-1.5 text-[13.5px] font-medium transition-colors ${mode === m ? "text-ink" : "text-sub"}`}
                  >
                    {mode === m && <motion.span layoutId="c-mode" className="absolute inset-0 rounded-full bg-white shadow-[0_1px_3px_rgba(31,31,31,0.12)]" transition={{ duration: 0.3, ease }} />}
                    <span className="relative">{m}</span>
                  </button>
                ))}
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={frozen}
                onClick={() => setFrozen((f) => !f)}
                className="flex items-center gap-3 text-[14px] font-medium text-ink"
              >
                Freeze card
                <span className={`relative h-6 w-11 rounded-full transition-colors ${frozen ? "bg-brand" : "bg-ghost"}`}>
                  <motion.span
                    className="absolute top-0.5 left-0.5 size-5 rounded-full bg-white shadow"
                    animate={{ x: frozen ? 20 : 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                </span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function ControlCard({ limit, allowed, mode, frozen }: { limit: number; allowed: string[]; mode: string; frozen: boolean }) {
  return (
    <div className="relative mx-auto aspect-[1.586] w-full max-w-[420px]">
      <motion.div
        className="absolute inset-0 overflow-hidden rounded-[20px] p-5 text-white shadow-[0_30px_60px_-28px_rgba(6,38,23,0.6)] sm:p-6"
        style={{ background: "linear-gradient(140deg, #017649 0%, #035436 50%, #062617 100%)" }}
        animate={{ filter: frozen ? "grayscale(0.85) brightness(1.15)" : "grayscale(0) brightness(1)", rotate: frozen ? 0 : -1.5 }}
        transition={{ duration: 0.5, ease }}
      >
        <div className="pointer-events-none absolute -top-24 -right-16 size-64 rounded-full bg-white/[0.07]" aria-hidden="true" />
        <div className="relative flex items-start justify-between">
          <div className="flex items-center gap-2">
            <LogoMark className="size-7" />
            <span className="text-[14px] font-semibold">PropelGo</span>
          </div>
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={mode}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              className="rounded-full bg-white/15 px-2.5 py-1 text-[11.5px] font-medium"
            >
              {mode}
            </motion.span>
          </AnimatePresence>
        </div>
        <div className="relative mt-4 flex flex-wrap gap-1.5 sm:mt-6">
          <AnimatePresence initial={false}>
            {allowed.map((c) => (
              <motion.span
                key={c}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.25 }}
                className="rounded-full bg-lime/25 px-2.5 py-0.5 text-[11.5px] font-medium text-white"
              >
                {c}
              </motion.span>
            ))}
          </AnimatePresence>
          {allowed.length === 0 && <span className="text-[11.5px] text-white/60">No categories allowed</span>}
        </div>
        <div className="absolute inset-x-5 bottom-5 flex items-end justify-between sm:inset-x-6 sm:bottom-6">
          <div>
            <p className="text-[11px] text-white/60">Monthly limit</p>
            <p className="tabular text-[20px] font-semibold tracking-[-0.02em] sm:text-[24px]">₹{inr.format(limit)}</p>
          </div>
          <div className="flex items-center gap-3">
            <ContactlessIcon className="size-5 text-white/70" />
            <span className="text-[15px] font-bold italic">VISA</span>
          </div>
        </div>
      </motion.div>
      <AnimatePresence>
        {frozen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3, ease }}
            className="absolute inset-0 grid place-items-center"
          >
            <span className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-[14px] font-semibold text-ink shadow-lg">
              <LockIcon className="size-4" /> Card frozen
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
