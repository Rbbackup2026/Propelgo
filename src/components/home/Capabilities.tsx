"use client";

import { AnimatePresence, motion, useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { capabilities } from "@/content/home";
import { Button } from "@/components/ui/Button";
import { Eyebrow, MaskLines, Reveal } from "@/components/ui/Reveal";
import { CapabilityArt } from "./visuals/CapabilityArt";

gsap.registerPlugin(ScrollTrigger);

const ease = [0.16, 1, 0.3, 1] as const;
const COUNT = capabilities.items.length;

export function Capabilities() {
  return (
    <section className="grain relative bg-forest-950 text-white" aria-label={capabilities.eyebrow}>
      <div className="grid-lines pointer-events-none absolute inset-0 [mask-image:linear-gradient(to_bottom,black,transparent_70%)]" aria-hidden="true" />
      <PinnedCapabilities />
      <StackedCapabilities />
    </section>
  );
}

function Header() {
  return (
    <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
      <div>
        <Eyebrow tone="dark">{capabilities.eyebrow}</Eyebrow>
        <h2 className="heading mt-6 text-[36px] md:text-[48px] xl:text-[52px]">
          <MaskLines lines={["Built to simplify complex", "payment operations."]} />
        </h2>
      </div>
      <Button href={capabilities.cta.href} variant="ghost-dark" magnetic={false}>
        {capabilities.cta.label}
      </Button>
    </div>
  );
}

/** Desktop: the section pins and scroll progress walks through the four capabilities. */
function PinnedCapabilities() {
  const track = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [local, setLocal] = useState(0);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const st = ScrollTrigger.create({
      trigger: el,
      start: "top top+=72",
      end: "bottom bottom",
      onUpdate: (self) => {
        const p = self.progress * COUNT;
        const idx = Math.min(COUNT - 1, Math.floor(p));
        setActive(idx);
        setLocal(Math.min(1, p - idx));
      },
    });
    return () => st.kill();
  }, []);

  const goTo = (i: number) => {
    const el = track.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 72;
    const span = el.offsetHeight - (window.innerHeight - 72);
    window.scrollTo({ top: top + span * ((i + 0.15) / COUNT), behavior: "smooth" });
  };

  return (
    <div ref={track} className="relative hidden lg:block" style={{ height: `${100 + COUNT * 55}vh` }}>
      <div className="sticky top-[72px] flex h-[calc(100vh-72px)] min-h-[640px] items-center">
        <div className="mx-auto w-full max-w-[1320px] px-8">
          <Header />
          <div className="mt-12 grid grid-cols-[0.9fr_1.1fr] gap-12 xl:gap-16">
            <ol className="border-t border-white/10">
              {capabilities.items.map((c, i) => {
                const on = i === active;
                return (
                  <li key={c.title} className="border-b border-white/10">
                    <button type="button" onClick={() => goTo(i)} className="group w-full py-5 text-left">
                      <div className="flex items-baseline gap-5">
                        <span className={`font-mono text-[12px] transition-colors ${on ? "text-signal" : "text-white/30"}`}>
                          0{i + 1} / 0{COUNT}
                        </span>
                        <span className={`text-[22px] font-medium tracking-[-0.02em] transition-colors duration-300 ${on ? "text-white" : "text-white/40 group-hover:text-white/70"}`}>
                          {c.title}
                        </span>
                      </div>
                      <AnimatePresence initial={false}>
                        {on && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.45, ease }}
                            className="overflow-hidden"
                          >
                            <p className="max-w-[44ch] pt-3 pl-[76px] text-[15px] leading-relaxed text-white/60">{c.copy}</p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                      <div className="mt-4 ml-[76px] h-px bg-white/[0.06]">
                        <div className="h-px bg-signal transition-[width] duration-150" style={{ width: on ? `${local * 100}%` : i < active ? "100%" : "0%" }} />
                      </div>
                    </button>
                  </li>
                );
              })}
            </ol>

            <div className="relative overflow-hidden rounded-[28px] border border-white/[0.08] bg-forest-900/70">
              <div className="grid-lines absolute inset-0 opacity-60" aria-hidden="true" />
              <div className="relative flex items-center justify-between border-b border-white/[0.08] px-6 py-4">
                <span className="label !text-[10px] text-white/40">Fig. 0{active + 2} · {capabilities.items[active].title}</span>
                <span className="flex gap-1.5">
                  {capabilities.items.map((_, i) => (
                    <span key={i} className={`h-1 rounded-full transition-all duration-500 ${i === active ? "w-6 bg-signal" : "w-1.5 bg-white/20"}`} />
                  ))}
                </span>
              </div>
              <div className="relative h-[min(46vh,400px)] p-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={active}
                    initial={{ opacity: 0, y: 16, filter: "blur(6px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: -12, filter: "blur(6px)" }}
                    transition={{ duration: 0.45, ease }}
                    className="size-full"
                  >
                    <CapabilityArt index={active} active />
                  </motion.div>
                </AnimatePresence>
              </div>
              <p className="relative border-t border-white/[0.08] px-6 py-4 text-[14px] text-white/55">{capabilities.items[active].detail}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Tablet & mobile: no pinning, each capability plays when it scrolls into view. */
function StackedCapabilities() {
  return (
    <div className="relative mx-auto max-w-[1320px] px-5 py-24 md:px-8 lg:hidden">
      <Header />
      <ul className="mt-12 grid gap-4 md:grid-cols-2">
        {capabilities.items.map((c, i) => (
          <Reveal as="li" key={c.title} delay={(i % 2) * 0.08}>
            <StackedItem index={i} title={c.title} copy={c.copy} />
          </Reveal>
        ))}
      </ul>
    </div>
  );
}

function StackedItem({ index, title, copy }: { index: number; title: string; copy: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-20% 0px" });
  return (
    <div ref={ref} className="overflow-hidden rounded-3xl border border-white/[0.08] bg-forest-900/70">
      <div className="h-[300px] p-5">
        <CapabilityArt index={index} active={inView} />
      </div>
      <div className="border-t border-white/[0.08] p-6">
        <p className="font-mono text-[12px] text-signal">
          0{index + 1} / 0{COUNT}
        </p>
        <h3 className="mt-2 text-[22px] font-medium tracking-[-0.02em]">{title}</h3>
        <p className="mt-2 text-[15px] leading-relaxed text-white/60">{copy}</p>
      </div>
    </div>
  );
}
