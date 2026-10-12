"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { hero, nav } from "@/content/home";
import { Button } from "@/components/ui/Button";
import { Eyebrow, MaskLines } from "@/components/ui/Reveal";
import { ArrowUpRight } from "@/components/ui/icons";
import { ProductGlyph } from "@/components/ui/ProductGlyph";
import { HeroVisual, usePointer } from "./visuals/HeroVisual";

const ease = [0.16, 1, 0.3, 1] as const;
const glyphs = ["versa", "odcc", "orchestration"] as const;

export function Hero() {
  const pointer = usePointer();
  const reduce = useReducedMotion();

  return (
    <section
      {...pointer.handlers}
      className="grain relative isolate overflow-hidden bg-forest-950 pt-[72px] text-white"
      aria-labelledby="hero-title"
    >
      <HeroBackdrop />

      <div className="relative mx-auto grid max-w-[1320px] items-center gap-14 px-5 pt-14 pb-16 md:px-8 md:pt-20 lg:grid-cols-[1.02fr_1fr] lg:gap-10 lg:pt-24 lg:pb-24">
        <div>
          <motion.div initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.1 }}>
            <Eyebrow tone="dark">{hero.eyebrow}</Eyebrow>
          </motion.div>

          <h1 id="hero-title" className="display mt-7 text-[44px] sm:text-[62px] lg:text-[72px] xl:text-[84px]">
            <MaskLines
              lines={hero.headline}
              inView={false}
              delay={0.15}
              render={(line) =>
                line.includes(hero.accentWord) ? (
                  <>
                    <AccentWord word={hero.accentWord} />
                    {line.replace(hero.accentWord, "")}
                  </>
                ) : (
                  line
                )
              }
            />
          </h1>

          <motion.p
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease, delay: 0.7 }}
            className="mt-7 max-w-[46ch] text-[17px] leading-relaxed text-white/65 md:text-[18px]"
          >
            {hero.copy}
          </motion.p>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease, delay: 0.85 }}
            className="mt-10 flex flex-wrap items-center gap-3"
          >
            <Button href={hero.primaryCta.href} size="lg">
              {hero.primaryCta.label}
            </Button>
            <Button href={hero.secondaryCta.href} variant="ghost-dark" size="lg" magnetic={false}>
              {hero.secondaryCta.label}
            </Button>
          </motion.div>
        </div>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, ease, delay: 0.35 }}
          className="relative mx-auto w-full max-w-[600px] lg:justify-self-end"
        >
          <HeroVisual pointer={pointer} />
        </motion.div>
      </div>

      <ProductStrip />
    </section>
  );
}

function AccentWord({ word }: { word: string }) {
  const reduce = useReducedMotion();
  return (
    <span className="relative inline-block">
      <motion.span
        initial={reduce ? false : { color: "#ffffff" }}
        animate={{ color: "#07F258" }}
        transition={{ duration: 0.6, delay: 1.25 }}
      >
        {word}
      </motion.span>
      <svg className="absolute -bottom-[0.06em] left-0 h-[0.18em] w-full overflow-visible" viewBox="0 0 100 10" preserveAspectRatio="none" fill="none" aria-hidden="true">
        <motion.path
          d="M1 7 H86 L97 1"
          stroke="#07F258"
          strokeWidth="2.2"
          vectorEffect="non-scaling-stroke"
          initial={reduce ? false : { pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.9, ease, delay: 1.35 }}
        />
      </svg>
    </span>
  );
}

function HeroBackdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
      <div className="grid-lines absolute inset-0 [mask-image:radial-gradient(ellipse_70%_60%_at_65%_40%,black,transparent_75%)]" />
      <div className="animate-drift-a absolute top-[-20%] right-[-10%] size-[720px] rounded-full bg-[radial-gradient(circle,rgba(7,242,88,0.22),transparent_62%)] blur-2xl" />
      <div className="animate-drift-b absolute bottom-[-30%] left-[-15%] size-[820px] rounded-full bg-[radial-gradient(circle,rgba(4,154,57,0.28),transparent_60%)] blur-3xl" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-forest-950 to-transparent" />
      <svg className="absolute top-[72px] left-0 hidden h-[calc(100%-72px)] w-full lg:block" fill="none">
        <line x1="50%" y1="0" x2="50%" y2="100%" stroke="rgba(255,255,255,0.04)" />
      </svg>
    </div>
  );
}

function ProductStrip() {
  return (
    <div id="products-strip" className="relative border-t border-white/[0.08]">
      <ul className="mx-auto grid max-w-[1320px] md:grid-cols-3">
        {nav.products.map((p, i) => (
          <motion.li
            key={p.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease, delay: 1 + i * 0.1 }}
            className="border-white/[0.08] not-last:border-b md:not-last:border-r md:not-last:border-b-0"
          >
            <Link href={p.href} className="group relative flex items-center gap-5 overflow-hidden px-5 py-6 md:px-8 md:py-8">
              <span className="absolute inset-0 origin-bottom scale-y-0 bg-white/[0.03] transition-transform duration-500 ease-out-expo group-hover:scale-y-100" />
              <span className="relative grid size-12 shrink-0 place-items-center rounded-xl bg-white/[0.04] text-white ring-1 ring-white/10 transition-colors group-hover:ring-signal/40">
                <ProductGlyph kind={glyphs[i]} className="size-8" />
              </span>
              <span className="relative flex-1">
                <span className="label text-white/40">
                  0{i + 1} · {p.tag}
                </span>
                <span className="mt-1 block text-[19px] font-medium tracking-[-0.02em]">{p.name}</span>
                <span className="mt-0.5 block text-[14px] text-white/50">{p.line}</span>
              </span>
              <span className="relative grid size-9 place-items-center rounded-full text-signal ring-1 ring-white/10 transition-all duration-300 group-hover:bg-signal group-hover:text-forest">
                <ArrowUpRight />
              </span>
            </Link>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}
