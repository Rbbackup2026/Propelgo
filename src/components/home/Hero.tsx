"use client";

import { motion, useReducedMotion } from "motion/react";
import { hero } from "@/content/home";
import { Button } from "@/components/ui/Button";
import { HeroSlip } from "./visuals/HeroSlip";

const ease = [0.16, 1, 0.3, 1] as const;

export function Hero() {
  const reduce = useReducedMotion();
  const rise = (delay: number) =>
    reduce ? {} : { initial: { opacity: 0, y: 18 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.9, ease, delay } };

  return (
    <section className="relative overflow-hidden pt-[128px] pb-20 md:pt-[148px] md:pb-28">
      <div className="container-page grid items-center gap-14 lg:grid-cols-[1fr_minmax(0,540px)] lg:gap-16">
        <div className="max-w-[580px]">
          <motion.p {...rise(0)} className="text-[15px] font-medium text-brand">
            {hero.eyebrow}
          </motion.p>
          <motion.h1 {...rise(0.06)} className="mt-5 text-display text-balance text-ink">
            {hero.headline}
          </motion.h1>
          <motion.p {...rise(0.14)} className="mt-6 max-w-[50ch] text-lead text-pretty text-copy">
            {hero.copy}
          </motion.p>
          <motion.div {...rise(0.22)} className="mt-9 flex flex-wrap items-center gap-3">
            <Button href={hero.primaryCta.href} size="lg">
              {hero.primaryCta.label}
            </Button>
            <Button href={hero.secondaryCta.href} size="lg" variant="secondary" arrow={false}>
              {hero.secondaryCta.label}
            </Button>
          </motion.div>
        </div>

        <motion.div {...(reduce ? {} : { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 1, delay: 0.1 } })}>
          <HeroSlip />
        </motion.div>
      </div>
    </section>
  );
}
