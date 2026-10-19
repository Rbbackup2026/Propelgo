"use client";

import { motion, useInView, useMotionTemplate, useMotionValue, useReducedMotion } from "motion/react";
import { useRef } from "react";
import { capabilities, type CapabilityKey } from "@/content/home";
import { Button } from "@/components/ui/Button";
import { SectionIntro } from "@/components/ui/Reveal";
import { ACCENTS, CapabilityGlyph, CapabilityTileArt } from "./visuals/CapabilityTiles";

const ease = [0.16, 1, 0.3, 1] as const;

/** Bento rhythm on desktop: wide, narrow / narrow, wide. */
const SPAN: Record<CapabilityKey, string> = {
  routing: "lg:col-span-3",
  cards: "lg:col-span-2",
  workflow: "lg:col-span-2",
  reconcile: "lg:col-span-3",
};

export function Capabilities() {
  return (
    <section className="bg-surface py-28 md:py-36">
      <div className="container-page">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionIntro eyebrow={capabilities.eyebrow} title={capabilities.title} highlight={capabilities.highlight} />
          <Button href={capabilities.cta.href} variant="secondary" className="self-start lg:self-auto">
            {capabilities.cta.label}
          </Button>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:mt-16 lg:grid-cols-5">
          {capabilities.items.map((item, i) => (
            <Tile key={item.key} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Tile({ item, index }: { item: (typeof capabilities.items)[number]; index: number }) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { margin: "-15% 0px" });
  const reduce = useReducedMotion();
  const accent = ACCENTS[item.key];

  const mx = useMotionValue(-400);
  const my = useMotionValue(-400);
  const spotlight = useMotionTemplate`radial-gradient(380px circle at ${mx}px ${my}px, ${accent.glow}, transparent 70%)`;

  const onMove = (e: React.PointerEvent<HTMLElement>) => {
    if (e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    mx.set(e.clientX - r.left);
    my.set(e.clientY - r.top);
  };

  return (
    <motion.article
      ref={ref}
      onPointerMove={onMove}
      className={`group relative flex flex-col overflow-hidden rounded-[28px] bg-white ring-1 ring-line transition-shadow duration-500 hover:shadow-[0_30px_60px_-36px_rgba(31,31,31,0.35)] ${SPAN[item.key]}`}
      initial={reduce ? false : { opacity: 0, y: 48, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 0.9, ease, delay: (index % 2) * 0.12 }}
    >
      <motion.div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" style={{ background: spotlight }} />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[3px] origin-left scale-x-0 transition-transform duration-700 ease-out-expo group-hover:scale-x-100" style={{ background: accent.solid }} />

      <div className="relative p-7 md:p-8">
        <div className="flex items-center justify-between">
          <span className="grid size-11 place-items-center rounded-2xl" style={{ background: accent.soft, color: accent.solid }}>
            <CapabilityGlyph kind={item.key} />
          </span>
          <span className="tabular text-[13px] font-medium" style={{ color: accent.solid }}>
            0{index + 1}
          </span>
        </div>
        <h3 className="mt-6 text-h3 text-ink">{item.title}</h3>
        <p className="mt-2.5 max-w-[48ch] text-[16px] leading-relaxed text-copy">{item.copy}</p>
        <p className="mt-3 flex max-w-[48ch] gap-2.5 text-[14.5px] leading-relaxed text-ink/80">
          <span className="mt-[9px] h-px w-4 shrink-0" style={{ background: accent.solid }} aria-hidden="true" />
          {item.detail}
        </p>
      </div>

      <div className="relative mt-auto h-[264px] overflow-hidden" aria-hidden="true">
        <div className="absolute inset-x-6 bottom-0 top-2 rounded-t-[20px] md:inset-x-8" style={{ background: `linear-gradient(180deg, ${accent.soft}, rgba(255,255,255,0) 85%)` }} />
        <CapabilityTileArt kind={item.key} playing={inView && !reduce} />
      </div>
    </motion.article>
  );
}
