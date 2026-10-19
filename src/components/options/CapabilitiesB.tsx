"use client";

import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { Fragment, useEffect, useRef, useState } from "react";
import { capabilities, type CapabilityKey } from "@/content/home";
import { Button } from "@/components/ui/Button";
import { SectionIntro } from "@/components/ui/Reveal";
import { CapabilityArt } from "@/components/home/visuals/CapabilityArt";

const DWELL = 7000;
const ease = [0.16, 1, 0.3, 1] as const;

/** Direction B: tabbed capabilities with a single illustrated panel. */
export function CapabilitiesB() {
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
    <section className="bg-surface py-28 md:py-40">
      <div className="container-page">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionIntro eyebrow={capabilities.eyebrow} title={capabilities.title} />
          <Button href={capabilities.cta.href} variant="secondary" className="self-start lg:self-auto">
            {capabilities.cta.label}
          </Button>
        </div>

        <div ref={ref} className="mt-14 grid gap-8 lg:mt-16 lg:grid-cols-[minmax(0,400px)_minmax(0,1fr)] lg:gap-12">
          <div role="tablist" aria-label="Platform capabilities" aria-orientation="vertical" className="flex flex-col">
            {capabilities.items.map((c, i) => {
              const on = i === active;
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
                    className={`relative border-t border-line py-6 text-left transition-colors last:border-b ${on ? "" : "hover:bg-white/60"}`}
                  >
                    <span className="absolute -top-px left-0 h-[2px] w-full overflow-hidden" aria-hidden="true">
                      {on && (
                        <motion.span
                          key={`${active}-${auto}`}
                          className="block h-full origin-left bg-brand"
                          initial={{ scaleX: auto ? 0 : 1 }}
                          animate={{ scaleX: 1 }}
                          transition={{ duration: auto ? DWELL / 1000 : 0, ease: "linear" }}
                        />
                      )}
                    </span>
                    <span className="flex items-center gap-4">
                      <span className={`tabular text-[14px] transition-colors ${on ? "text-brand" : "text-sub"}`}>0{i + 1}</span>
                      <span className={`text-[19px] font-semibold tracking-[-0.015em] transition-colors ${on ? "text-ink" : "text-copy"}`}>{c.title}</span>
                    </span>
                    <AnimatePresence initial={false}>
                      {on && (
                        <motion.span
                          className="block overflow-hidden pl-9"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.45, ease }}
                        >
                          <span className="block pt-3 text-[16px] leading-relaxed text-copy">{c.copy}</span>
                          <span className="mt-3 block text-[14.5px] leading-relaxed text-ink">{c.detail}</span>
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </button>
                  {on && (
                    <div className="pb-6 lg:hidden">
                      <Panel kind={item.key} playing={inView && !reduce} reduce={reduce} />
                    </div>
                  )}
                </Fragment>
              );
            })}
          </div>

          <div id="cap-panel" role="tabpanel" aria-labelledby={`cap-tab-${item.key}`} className="hidden lg:block">
            <Panel kind={item.key} playing={inView && !reduce} reduce={reduce} />
          </div>
        </div>
      </div>
    </section>
  );
}

function Panel({ kind, playing, reduce }: { kind: CapabilityKey; playing: boolean; reduce: boolean | null }) {
  return (
    <div className="relative h-[420px] overflow-hidden rounded-3xl bg-white ring-1 ring-line lg:h-[520px]">
      <AnimatePresence mode="wait">
        <motion.div
          key={kind}
          className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_0%,#f6ffee_0%,#ffffff_60%)]"
          initial={reduce ? false : { opacity: 0, scale: 0.985 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.985 }}
          transition={{ duration: 0.45, ease }}
        >
          <CapabilityArt kind={kind} playing={playing} />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
