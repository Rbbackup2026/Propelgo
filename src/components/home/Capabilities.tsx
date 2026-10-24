"use client";

import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { Fragment, useEffect, useRef, useState } from "react";
import { capabilities, type CapabilityKey } from "@/content/home";
import { Button } from "@/components/ui/Button";
import { SectionIntro } from "@/components/ui/Reveal";
import { ACCENTS, CapabilityGlyph, CapabilityTileArt } from "./visuals/CapabilityTiles";

const DWELL = 7000;
const ease = [0.16, 1, 0.3, 1] as const;

/** Tabbed capabilities: a vertical list that auto-advances, with one illustrated panel tinted per capability. */
export function Capabilities() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-20% 0px" });
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const [manual, setManual] = useState(false);
  const auto = inView && !manual && !reduce;

  useEffect(() => {
    if (!auto) return;
    const t = setTimeout(() => setActive((a) => (a + 1) % capabilities.items.length), DWELL);
    return () => clearTimeout(t);
  }, [auto, active]);

  const item = capabilities.items[active];

  return (
    <section className="bg-surface py-28 md:py-36">
      <div className="container-page">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionIntro title={capabilities.title} highlight={capabilities.highlight} />
          <Button href={capabilities.cta.href} variant="secondary" className="self-start lg:self-auto">
            {capabilities.cta.label}
          </Button>
        </div>

        <div ref={ref} className="mt-14 grid gap-8 lg:mt-16 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)] lg:gap-12">
          <div role="tablist" aria-label="Platform capabilities" aria-orientation="vertical" className="flex flex-col">
            {capabilities.items.map((c, i) => {
              const on = i === active;
              const accent = ACCENTS[c.key];
              return (
                <Fragment key={c.key}>
                  <button
                    type="button"
                    role="tab"
                    id={`cap-tab-${c.key}`}
                    aria-selected={on}
                    aria-controls="cap-panel"
                    onClick={() => {
                      setManual(true);
                      setActive(i);
                    }}
                    className={`group relative border-t border-line py-5 text-left transition-colors last:border-b ${on ? "" : "hover:bg-white/60"}`}
                  >
                    <span className="absolute -top-px left-0 h-[2px] w-full overflow-hidden" aria-hidden="true">
                      {on && (
                        <motion.span
                          key={`${active}-${auto}`}
                          className="block h-full origin-left"
                          style={{ background: accent.solid }}
                          initial={{ scaleX: auto ? 0 : 1 }}
                          animate={{ scaleX: 1 }}
                          transition={{ duration: auto ? DWELL / 1000 : 0, ease: "linear" }}
                        />
                      )}
                    </span>
                    <span className="flex items-center gap-4">
                      <span
                        className="grid size-12 shrink-0 place-items-center rounded-2xl transition-[background-color,box-shadow,transform] duration-300 group-hover:scale-105"
                        style={{ background: on ? accent.soft : "#ffffff", boxShadow: on ? `0 10px 22px -14px ${accent.solid}` : "inset 0 0 0 1px #ececec" }}
                      >
                        <CapabilityGlyph kind={c.key} className="size-9" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className={`tabular block text-[13px] font-medium transition-colors ${on ? "" : "text-sub"}`} style={on ? { color: accent.solid } : undefined}>
                          0{i + 1}
                        </span>
                        <span className={`block text-[19px] font-semibold tracking-[-0.015em] transition-colors ${on ? "text-ink" : "text-copy"}`}>{c.title}</span>
                      </span>
                    </span>
                    <AnimatePresence initial={false}>
                      {on && (
                        <motion.span
                          className="block overflow-hidden pl-16"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.45, ease }}
                        >
                          <span className="block pt-3 text-[16px] leading-relaxed text-copy">{c.copy}</span>
                          <span className="mt-3 flex gap-2.5 text-[14.5px] leading-relaxed text-ink/80">
                            <span className="mt-[10px] h-px w-4 shrink-0" style={{ background: accent.solid }} aria-hidden="true" />
                            {c.detail}
                          </span>
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </button>
                  {on && (
                    <div className="pb-6 lg:hidden">
                      <Panel kind={item.key} index={active} playing={inView && !reduce} reduce={reduce} />
                    </div>
                  )}
                </Fragment>
              );
            })}
          </div>

          <div id="cap-panel" role="tabpanel" aria-labelledby={`cap-tab-${item.key}`} className="hidden lg:block">
            <Panel kind={item.key} index={active} playing={inView && !reduce} reduce={reduce} />
          </div>
        </div>
      </div>
    </section>
  );
}

function Panel({ kind, index, playing, reduce }: { kind: CapabilityKey; index: number; playing: boolean; reduce: boolean | null }) {
  const accent = ACCENTS[kind];
  const title = capabilities.items[index].title;
  return (
    <div className="relative h-[420px] overflow-hidden rounded-[28px] bg-white ring-1 ring-line shadow-[0_30px_60px_-40px_rgba(31,31,31,0.3)] lg:h-[540px]">
      <div className="absolute inset-x-0 top-0 z-10 h-[3px] transition-colors duration-500" style={{ background: accent.solid }} />
      <AnimatePresence mode="wait">
        <motion.div
          key={kind}
          className="absolute inset-0"
          style={{ background: `radial-gradient(120% 80% at 50% 0%, ${accent.soft} 0%, #ffffff 62%)` }}
          initial={reduce ? false : { opacity: 0, scale: 0.985 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.985 }}
          transition={{ duration: 0.45, ease }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(rgba(31,31,31,0.07)_1px,transparent_1px)] bg-[size:22px_22px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_45%,#000,transparent)]" aria-hidden="true" />

          <div className="absolute top-6 right-6 left-6 flex items-center justify-between">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/85 py-1.5 pr-3.5 pl-1.5 text-[13px] font-medium ring-1 ring-white backdrop-blur" style={{ color: accent.deep }}>
              <span className="grid size-7 place-items-center rounded-full" style={{ background: accent.soft }}>
                <CapabilityGlyph kind={kind} className="size-5" />
              </span>
              {title}
            </span>
            <span className="tabular text-[13px] font-medium text-sub">
              <span style={{ color: accent.solid }}>0{index + 1}</span> / 0{capabilities.items.length}
            </span>
          </div>

          <div className="absolute inset-x-0 top-1/2 h-[300px] -translate-y-[44%]" aria-hidden="true">
            <div className="absolute inset-x-8 inset-y-0 rounded-[22px] md:inset-x-12" style={{ background: `linear-gradient(180deg, ${accent.soft}, rgba(255,255,255,0) 85%)` }} />
            <CapabilityTileArt kind={kind} playing={playing} />
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
