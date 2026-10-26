"use client";

import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform, type MotionValue } from "motion/react";
import { useRef } from "react";
import { hero } from "@/content/home";
import { BrandRibbon, type RibbonVariant } from "@/components/ui/BrandRibbon";
import { Button } from "@/components/ui/Button";
import { Magnetic } from "@/components/ui/Magnetic";
import { GRADIENT_TEXT } from "@/components/ui/Reveal";
import { usePreloaderDone } from "@/lib/preloader";
import { useContinuousGradient } from "@/lib/useContinuousGradient";
import { HeroStage, type StageVariant } from "./visuals/HeroStage";
const ease = [0.16, 1, 0.3, 1] as const;

/** Trailing words of the headline set in the brand gradient. */
const HIGHLIGHT_WORDS = 4;

/** Lets the preloader curtain clear the top of the screen before copy rises. */
const BASE = 0.35;
/** Each ribbon style tucked into the corner its strands grow from, faded towards the copy. */
const HERO_RIBBON: Record<RibbonVariant, string> = {
  twist:
    "absolute top-0 left-0 -z-10 h-[78%] w-[min(34vw,420px)] [mask-image:radial-gradient(115%_100%_at_0%_0%,#000_35%,transparent_80%)] max-md:w-[55vw] max-md:h-[45%]",
  fan: "absolute bottom-0 left-0 -z-10 h-[72%] w-[min(40vw,500px)] [mask-image:radial-gradient(120%_100%_at_0%_100%,#000_40%,transparent_82%)] max-md:w-[60vw] max-md:h-[40%]",
  wave: "absolute bottom-0 left-0 -z-10 h-[50%] w-[min(50vw,640px)] [mask-image:radial-gradient(110%_100%_at_0%_100%,#000_40%,transparent_80%)]",
  loop: "absolute top-0 left-0 -z-10 h-[80%] w-[min(34vw,420px)] [mask-image:radial-gradient(115%_100%_at_0%_0%,#000_35%,transparent_80%)]",
};

export function Hero({ stage = "payments", ribbon }: { stage?: StageVariant; ribbon?: RibbonVariant }) {
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
      {ribbon && <BrandRibbon variant={ribbon} light pulse={ribbon !== "twist"} play={ready} className={HERO_RIBBON[ribbon]} />}
      <div className="container-page grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,560px)] lg:gap-10">
        <motion.div style={reduce ? undefined : { y: copyY, opacity: copyOpacity }} className="relative max-w-[600px]">

          <h1 ref={titleRef} className="text-[clamp(2.25rem,1.4rem+2.4vw,3.5rem)] leading-[1.05] font-semibold tracking-[-0.04em] text-balance text-ink">
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
          </motion.div>
        </motion.div>

        <motion.div style={reduce ? undefined : { y: stageY, scale: stageScale }} className="relative">
          <HeroStage mx={mx} my={my} ready={ready} variant={stage} />
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
        className="absolute -top-[30%] -right-[18%] h-[105%] w-[78%] max-lg:-right-[40%] max-lg:w-[130%]"
      >
        {/* Skew and mask live on their own layer: motion's inline transform would override the skew, and a mask on the parent clips the slanted edge. */}
        <div className="absolute inset-0 origin-top-right -skew-y-12 overflow-hidden bg-[linear-gradient(115deg,#f6ffee_0%,#effbf3_50%,#eef8fb_100%)] [mask-image:linear-gradient(to_right,transparent,#000_30%)]">
          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-mint to-[#cdeee6]" />
        </div>
      </motion.div>
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-white" />
    </div>
  );
}
