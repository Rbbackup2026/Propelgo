"use client";

import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform, type MotionValue } from "motion/react";
import { useRef } from "react";
import { hero } from "@/content/home";
import { Button } from "@/components/ui/Button";
import { Magnetic } from "@/components/ui/Magnetic";
import { GRADIENT_TEXT } from "@/components/ui/Reveal";
import { usePreloaderDone } from "@/lib/preloader";
import { useContinuousGradient } from "@/lib/useContinuousGradient";
import { HeroStage } from "@/components/home/visuals/HeroStage";

const ease = [0.16, 1, 0.3, 1] as const;

/** Trailing words of the headline set in the brand gradient. */
const HIGHLIGHT_WORDS = 4;

/** Lets the preloader curtain clear the top of the screen before copy rises. */
const BASE = 0.35;

/** Direction B: the homepage hero as first reviewed, with the drifting aurora and both CTAs. */
export function HeroB() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const ready = usePreloaderDone();

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const copyY = useTransform(scrollYProgress, [0, 1], [0, -90]);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);
  const stageY = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const stageScale = useTransform(scrollYProgress, [0, 1], [1, 0.92]);
  const auroraY = useTransform(scrollYProgress, [0, 1], [0, 140]);

  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const mx = useSpring(px, { stiffness: 70, damping: 20, mass: 0.8 });
  const my = useSpring(py, { stiffness: 70, damping: 20, mass: 0.8 });
  const auroraX = useTransform(mx, [-0.5, 0.5], [-30, 30]);

  const onMove = (e: React.PointerEvent<HTMLElement>) => {
    if (reduce || e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width - 0.5);
    py.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onLeave = () => {
    px.set(0);
    py.set(0);
  };

  const rise = (delay: number) =>
    reduce ? {} : { initial: { opacity: 0, y: 22 }, animate: ready ? { opacity: 1, y: 0 } : undefined, transition: { duration: 0.9, ease, delay: BASE + delay } };

  const words = hero.headline.split(" ");
  const titleRef = useContinuousGradient<HTMLHeadingElement>();

  return (
    <section
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className="relative isolate overflow-hidden pt-[124px] pb-16 md:pt-[148px] md:pb-24 lg:min-h-[100svh]"
    >
      <Aurora y={reduce ? undefined : auroraY} x={reduce ? undefined : auroraX} />

      <div className="container-page grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,560px)] lg:gap-10">
        <motion.div style={reduce ? undefined : { y: copyY, opacity: copyOpacity }} className="relative max-w-[600px]">
          <motion.p
            {...rise(0)}
            className="inline-flex items-center gap-2.5 rounded-full bg-white/80 py-1.5 pr-4 pl-1.5 text-[14px] font-medium text-forest shadow-[0_1px_2px_rgba(6,38,23,0.06)] ring-1 ring-mint backdrop-blur"
          >
            <span className="relative grid size-6 place-items-center rounded-full bg-mint">
              <span className="absolute inset-1 animate-ping-soft rounded-full bg-lime" />
              <span className="relative size-2 rounded-full bg-brand" />
            </span>
            {hero.eyebrow}
          </motion.p>

          <h1 ref={titleRef} className="mt-6 text-[clamp(2.6rem,1.5rem+3.4vw,4.4rem)] leading-[1.02] font-semibold tracking-[-0.04em] text-balance text-ink">
            {words.map((word, i) => {
              const highlight = i >= words.length - HIGHLIGHT_WORDS;
              return (
                <span key={i}>
                  <span className="-mb-[0.12em] inline-block overflow-hidden pb-[0.12em] align-bottom">
                    <motion.span
                      data-gradient-word={highlight || undefined}
                      className={`inline-block ${highlight ? GRADIENT_TEXT : ""}`}
                      initial={reduce ? false : { y: "110%", rotate: 6 }}
                      animate={ready ? { y: "0%", rotate: 0 } : undefined}
                      transition={{ duration: 1, ease, delay: BASE + 0.12 + i * 0.06 }}
                    >
                      {word}
                    </motion.span>
                  </span>
                  {i < words.length - 1 && " "}
                </span>
              );
            })}
          </h1>

          <motion.p {...rise(0.55)} className="mt-6 max-w-[52ch] text-lead text-pretty text-copy">
            {hero.copy}
          </motion.p>

          <motion.div {...rise(0.68)} className="mt-9 flex flex-wrap items-center gap-3">
            <Magnetic>
              <Button
                href={hero.primaryCta.href}
                size="lg"
                className="relative overflow-hidden shadow-[0_14px_30px_-12px_rgba(1,118,73,0.65)]"
              >
                <span className="pointer-events-none absolute inset-y-0 left-0 w-1/3 animate-shine bg-gradient-to-r from-transparent via-white/30 to-transparent motion-reduce:hidden" />
                <span className="relative">{hero.primaryCta.label}</span>
              </Button>
            </Magnetic>
            <Magnetic strength={0.2}>
              <Button href={hero.secondaryCta.href} size="lg" variant="secondary" arrow={false} className="bg-white/80 backdrop-blur">
                {hero.secondaryCta.label}
              </Button>
            </Magnetic>
          </motion.div>
        </motion.div>

        <motion.div style={reduce ? undefined : { y: stageY, scale: stageScale }} className="relative">
          <HeroStage mx={mx} my={my} ready={ready} rails={false} accents={false} />
        </motion.div>
      </div>

      <motion.div
        initial={reduce ? false : { opacity: 0 }}
        animate={ready ? { opacity: 1 } : undefined}
        transition={{ delay: BASE + 1.6, duration: 0.8 }}
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 lg:block"
        aria-hidden="true"
      >
        <div className="flex h-10 w-6 justify-center rounded-full ring-1 ring-ghost">
          <motion.span
            className="mt-2 h-2 w-1 rounded-full bg-brand"
            animate={reduce ? undefined : { y: [0, 12, 0], opacity: [1, 0.2, 1] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </motion.div>
    </section>
  );
}

function Aurora({ x, y }: { x?: MotionValue<number>; y?: MotionValue<number> }) {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
      <div className="absolute inset-0 bg-[radial-gradient(60%_50%_at_15%_0%,#f6ffee_0%,transparent_70%)]" />
      <motion.div
        style={{ x, y }}
        className="absolute -top-[30%] -right-[18%] h-[105%] w-[78%] origin-top-right -skew-y-12 overflow-hidden opacity-90 [mask-image:linear-gradient(to_right,transparent,#000_30%)] max-lg:-right-[40%] max-lg:w-[130%] max-lg:opacity-60"
      >
        <div className="absolute inset-0 bg-[#f6ffee]" />
        <div className="absolute -top-[10%] left-[5%] size-[70%] animate-blob-a rounded-full bg-[radial-gradient(circle,#95de64_0%,transparent_62%)] motion-reduce:animate-none" />
        <div className="absolute top-[20%] right-[-10%] size-[75%] animate-blob-b rounded-full bg-[radial-gradient(circle,#2fd38a_0%,transparent_60%)] opacity-80 motion-reduce:animate-none" />
        <div className="absolute bottom-[-20%] left-[25%] size-[70%] animate-blob-c rounded-full bg-[radial-gradient(circle,#b8f0d4_0%,transparent_62%)] motion-reduce:animate-none" />
        <div className="absolute top-[35%] left-[-10%] size-[55%] animate-blob-b rounded-full bg-[radial-gradient(circle,#e8fa9e_0%,transparent_60%)] [animation-delay:-9s] motion-reduce:animate-none" />
        <div className="absolute top-[5%] right-[15%] size-[45%] animate-blob-a rounded-full bg-[radial-gradient(circle,rgba(1,118,73,0.55)_0%,transparent_62%)] [animation-delay:-12s] motion-reduce:animate-none" />
      </motion.div>
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(6,38,23,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(6,38,23,0.05)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(70%_60%_at_30%_30%,#000_0%,transparent_80%)]" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-white" />
    </div>
  );
}
