"use client";

import Link from "next/link";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
  type Variants,
} from "motion/react";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { products, type ProductKey } from "@/content/home";
import { SectionIntro } from "@/components/ui/Reveal";
import { FlipIcon } from "@/components/ui/FlipCard";
import { ArrowRight, Check } from "@/components/ui/icons";
import { LogoMark } from "@/components/ui/Logo";
import { ProductGlyph } from "@/components/ui/ProductGlyph";
import { useMediaQuery } from "@/lib/useMediaQuery";
import { ProductArt } from "./visuals/ProductArt";
import { PRODUCT_ACCENT, ProductIcon } from "./visuals/ProductIcon";

/** Direction A tints each product in its own accent; Direction B keeps the all-green cards. */
const Spectrum = createContext(false);

type Product = (typeof products.items)[number];

const ease = [0.16, 1, 0.3, 1] as const;
const CARD_W = 360;
const CARD_H = 540;
const FAN = [-340, 0, 340];

const tone: Record<ProductKey, { bg: string; ring: string; glow: string }> = {
  versa: { bg: "linear-gradient(165deg,#f4ffea 0%,#ddf6c6 100%)", ring: "ring-[#cdeeb4]", glow: "rgba(1,118,73,0.35)" },
  odcc: { bg: "linear-gradient(165deg,#f0fcf6 0%,#d4f1e2 100%)", ring: "ring-[#bfe6d2]", glow: "rgba(5,148,91,0.35)" },
  orchestration: { bg: "linear-gradient(165deg,#fafde8 0%,#e9f6bd 100%)", ring: "ring-[#dcedaa]", glow: "rgba(95,191,63,0.4)" },
};

/** Flat, soft pastels; the product accents carry the colour. */
const spectrumTone: Record<ProductKey, { bg: string; ring: string; glow: string }> = {
  versa: { bg: "linear-gradient(165deg,#f3f8f2 0%,#e8f1e7 100%)", ring: "ring-[#dfeadd]", glow: "rgba(1,118,73,0.28)" },
  odcc: { bg: "linear-gradient(165deg,#f3f2fb 0%,#e9e8f7 100%)", ring: "ring-[#e0dff2]", glow: "rgba(91,87,217,0.28)" },
  orchestration: { bg: "linear-gradient(165deg,#f1f8fa 0%,#e5f1f4 100%)", ring: "ring-[#d9eaee]", glow: "rgba(14,139,163,0.28)" },
};

export function Products({ tone: mode = "spectrum" }: { tone?: "spectrum" | "brand" }) {
  return (
    <Spectrum.Provider value={mode === "spectrum"}>
      <ProductsSection />
    </Spectrum.Provider>
  );
}

function ProductsSection() {
  const spectrum = useContext(Spectrum);
  const sectionRef = useRef<HTMLElement>(null);
  const desktop = useMediaQuery("(min-width: 1024px)");
  return (
    <section ref={sectionRef} id="products" className="relative scroll-mt-20 overflow-hidden py-28 md:py-36">
      <p
        aria-hidden="true"
        className={`pointer-events-none absolute top-[52%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-[21vw] leading-none font-semibold tracking-[-0.06em] whitespace-nowrap select-none ${spectrum ? "text-[#f4f4f6]" : "text-[#f1f8ea]"}`}
      >
        PropelGo
      </p>

      <div className="container-page relative">
        <SectionIntro title={products.title} highlight={spectrum ? products.highlight : undefined} copy={products.copy} align="center" />
        <p className="mt-6 flex items-center justify-center gap-2 text-[14px] text-sub">
          <FlipIcon className="size-4" /> {products.hint}
        </p>
      </div>

      {desktop ? <Stage /> : <MobileRow />}
    </section>
  );
}

function Stage() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [open, setOpen] = useState<number | null>(null);
  const [hover, setHover] = useState<number | null>(null);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "start 0.2"] });
  const spring = useSpring(scrollYProgress, { stiffness: 80, damping: 22, mass: 0.6 });
  const settled = useMotionValue(1);
  const fan = reduce ? settled : spring;

  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [5, -5]), { stiffness: 60, damping: 18 });
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [-7, 7]), { stiffness: 60, damping: 18 });

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div
      ref={ref}
      className="relative mx-auto mt-10 h-[720px] max-w-[1400px]"
      onClick={() => setOpen(null)}
      onPointerMove={(e) => {
        if (reduce || e.pointerType !== "mouse") return;
        const r = e.currentTarget.getBoundingClientRect();
        px.set((e.clientX - r.left) / r.width - 0.5);
        py.set((e.clientY - r.top) / r.height - 0.5);
      }}
      onPointerLeave={() => {
        px.set(0);
        py.set(0);
        setHover(null);
      }}
    >
      <Curve progress={fan} />
      <motion.div style={{ rotateX, rotateY, transformPerspective: 2200 }} className="absolute inset-0">
        {products.items.map((p, i) => (
          <StageCard
            key={p.key}
            p={p}
            i={i}
            fan={fan}
            open={open}
            hover={hover}
            onOpen={() => setOpen(i)}
            onClose={() => setOpen(null)}
            onHover={setHover}
          />
        ))}
      </motion.div>
    </div>
  );
}

function StageCard({
  p,
  i,
  fan,
  open,
  hover,
  onOpen,
  onClose,
  onHover,
}: {
  p: Product;
  i: number;
  fan: MotionValue<number>;
  open: number | null;
  hover: number | null;
  onOpen: () => void;
  onClose: () => void;
  onHover: (i: number | null) => void;
}) {
  const base = FAN[i];
  const x = useTransform(fan, [0, 1], [base * 0.12, base]);
  const y = useTransform(fan, [0, 1], [160 + i * 18, 0]);
  const rotate = useTransform(fan, [0, 1], [(i - 1) * -9, 0]);
  const opacity = useTransform(fan, [0, 0.35], [0, 1]);

  const isOpen = open === i;
  const other = open !== null && !isOpen;
  const isHover = hover === i && open === null;

  let target;
  if (isOpen) {
    target = { x: -base, y: -24, rotateX: 0, rotateY: 0, rotateZ: 0, scale: 1.05, opacity: 1 };
  } else if (other) {
    const side = Math.sign(i - (open as number));
    const rank = Math.abs(i - (open as number)) - 1;
    target = { x: side * (430 + rank * 250) - base, y: 30 + rank * 30, rotateX: 10, rotateY: side * -30, rotateZ: side * 6, scale: 0.84 - rank * 0.06, opacity: 0.5 - rank * 0.15 };
  } else if (isHover) {
    target = { x: 0, y: -44, rotateX: 6, rotateY: -16, rotateZ: 3, scale: 1.04, opacity: 1 };
  } else {
    target = { x: 0, y: 0, rotateX: 12, rotateY: -26, rotateZ: 7, scale: 1, opacity: 1 };
  }

  return (
    <motion.div
      style={{ x, y, rotate, opacity, zIndex: isOpen ? 30 : isHover ? 20 : 10 - i, width: CARD_W, height: CARD_H, marginLeft: -CARD_W / 2 }}
      className="absolute top-[70px] left-1/2"
    >
      <motion.article
        initial={false}
        animate={target}
        transition={{ type: "spring", bounce: 0.18, visualDuration: 0.7 }}
        style={{ transformPerspective: 1400 }}
        onPointerEnter={(e) => e.pointerType === "mouse" && onHover(i)}
        onPointerLeave={() => onHover(null)}
        onClick={(e) => e.stopPropagation()}
        className="size-full"
      >
        <CardBody p={p} open={isOpen} hover={isHover} onOpen={onOpen} onClose={onClose} lifted={isHover || isOpen} />
      </motion.article>
    </motion.div>
  );
}

function CardBody({ p, open, hover, lifted, onOpen, onClose }: { p: Product; open: boolean; hover: boolean; lifted: boolean; onOpen: () => void; onClose: () => void }) {
  const spectrum = useContext(Spectrum);
  const t = (spectrum ? spectrumTone : tone)[p.key];
  return (
    <div
      className={`relative size-full overflow-hidden rounded-[30px] ring-1 ${t.ring} transition-shadow duration-500`}
      style={{
        background: t.bg,
        boxShadow: lifted ? `0 60px 100px -40px ${t.glow}, 0 2px 6px rgba(6,38,23,0.06)` : "0 40px 80px -48px rgba(6,38,23,0.35), 0 1px 2px rgba(6,38,23,0.05)",
      }}
    >
      <div className="pointer-events-none absolute -top-24 -right-24 size-64 rounded-full bg-white/50 blur-2xl" />
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1/2 animate-shine bg-gradient-to-r from-transparent via-white/40 to-transparent transition-opacity duration-500 motion-reduce:hidden" style={{ opacity: hover ? 1 : 0 }} />
      <AnimatePresence mode="wait" initial={false}>
        {open ? <Details key="details" p={p} onBack={onClose} /> : <Front key="front" p={p} hover={hover} onOpen={onOpen} />}
      </AnimatePresence>
    </div>
  );
}

function Front({ p, hover, onOpen }: { p: Product; hover: boolean; onOpen: () => void }) {
  const spectrum = useContext(Spectrum);
  const accent = PRODUCT_ACCENT[p.key];
  const main = spectrum ? accent.main : "#017649";
  const deep = spectrum ? `color-mix(in oklab, ${accent.main} 72%, #062617)` : "#04452b";
  const glow = spectrum ? accent.glow : "rgba(1,118,73,0.55)";
  return (
    <motion.div
      className="relative flex size-full flex-col p-7"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -14 }}
      transition={{ duration: 0.3, ease }}
    >
      {spectrum ? (
        <div className="flex items-center justify-between">
          <ProductIcon kind={p.key} active={hover} />
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/80 px-3 py-1 text-[12.5px] font-medium ring-1 ring-white" style={{ color: accent.main }}>
            <span className="size-1.5 rounded-full" style={{ backgroundColor: accent.main }} />
            {p.category}
          </span>
        </div>
      ) : (
        <div className="flex items-center justify-between">
          <motion.span
            animate={{ rotate: hover ? -8 : 0, scale: hover ? 1.08 : 1 }}
            transition={{ type: "spring", bounce: 0.4, visualDuration: 0.4 }}
            className="grid size-12 place-items-center rounded-2xl bg-white text-forest shadow-[0_8px_20px_-12px_rgba(6,38,23,0.4)]"
          >
            <ProductGlyph kind={p.key} className="size-8" />
          </motion.span>
          <span className="rounded-full bg-white/75 px-3 py-1 text-[12.5px] font-medium text-forest ring-1 ring-white">{p.category}</span>
        </div>
      )}
      <h3 className="mt-6 text-[34px] leading-none font-semibold tracking-[-0.04em] text-ink">{p.name}</h3>
      <p className="mt-3 text-[16px] leading-relaxed text-pretty text-copy">{p.tagline}</p>
      <div className="relative mt-6 min-h-0 flex-1 overflow-hidden rounded-2xl bg-white/65 ring-1 ring-white">
        <ProductArt kind={p.key} active={hover} />
      </div>
      <button type="button" onClick={onOpen} tabIndex={-1} aria-hidden="true" className="absolute inset-0 cursor-pointer rounded-[30px]" />
      <div className="relative z-10 mt-5 flex items-center gap-2.5">
        <Link
          href={p.cta.href}
          className="group/cta inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-full text-[15px] font-medium text-white transition-[filter,transform] duration-300 hover:brightness-110 active:scale-[0.98]"
          style={{ background: `linear-gradient(135deg, ${main} 0%, ${deep} 100%)`, boxShadow: `0 14px 28px -14px ${glow}, inset 0 1px 0 rgba(255,255,255,0.18)` }}
        >
          {p.cta.label}
          <ArrowRight className="size-3.5 transition-transform duration-300 group-hover/cta:translate-x-1" />
        </Link>
        <button
          type="button"
          onClick={onOpen}
          aria-label={`See more about ${p.name}`}
          title="See details"
          className="grid size-12 shrink-0 place-items-center rounded-full bg-white/85 ring-1 ring-white backdrop-blur transition-transform duration-300 hover:rotate-180"
          style={{ color: main }}
        >
          <FlipIcon className="size-4" />
        </button>
      </div>
    </motion.div>
  );
}

const list: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.07, delayChildren: 0.15 } } };
const item: Variants = { hidden: { opacity: 0, x: -14 }, show: { opacity: 1, x: 0, transition: { duration: 0.45, ease } } };

function Details({ p, onBack }: { p: Product; onBack: () => void }) {
  const accent = useContext(Spectrum) ? PRODUCT_ACCENT[p.key].main : undefined;
  return (
    <motion.div
      className="relative flex size-full cursor-pointer flex-col p-7"
      variants={list}
      initial="hidden"
      animate="show"
      exit={{ opacity: 0, y: 14, transition: { duration: 0.2 } }}
      onClick={onBack}
    >
      <motion.div variants={item} className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[14px] text-brand" style={accent ? { color: accent } : undefined}>
            {p.category}
          </p>
          <h3 className="mt-1.5 text-h3 text-ink">{p.name}</h3>
        </div>
        <button
          type="button"
          onClick={onBack}
          aria-label={`Back to ${p.name} overview`}
          className="grid size-9 shrink-0 place-items-center rounded-full bg-white text-ink ring-1 ring-mint transition-colors hover:ring-lime"
        >
          <FlipIcon className="size-4" />
        </button>
      </motion.div>
      <motion.p variants={item} className="mt-4 text-[15.5px] leading-relaxed text-copy">
        {p.copy}
      </motion.p>
      <ul className="mt-5 space-y-3 border-t border-white pt-5">
        {p.features.map((f) => (
          <motion.li key={f} variants={item} className="flex gap-3 text-[15px] leading-snug text-ink">
            <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-brand text-white" style={accent ? { backgroundColor: accent } : undefined}>
              <Check className="size-2.5" />
            </span>
            {f}
          </motion.li>
        ))}
      </ul>
      <motion.div variants={item} className="mt-auto">
        <Link
          href={p.cta.href}
          onClick={(e) => e.stopPropagation()}
          className="group inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-brand text-[15px] font-medium text-white transition-[filter,background-color] hover:bg-brand-700 hover:brightness-110"
          style={accent ? { background: `linear-gradient(135deg, ${accent} 0%, color-mix(in oklab, ${accent} 72%, #062617) 100%)` } : undefined}
        >
          {p.cta.label}
          <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </motion.div>
    </motion.div>
  );
}

const curve = "M -40 520 C 140 470, 180 160, 360 150 S 520 470, 700 430 S 880 70, 1060 110 S 1220 380, 1290 330";

function Curve({ progress }: { progress: MotionValue<number> }) {
  const spectrum = useContext(Spectrum);
  const badge = useTransform(progress, [0.85, 1], [0, 1]);
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden="true">
      <svg viewBox="0 0 1300 720" preserveAspectRatio="none" className="absolute inset-0 size-full" fill="none">
        <defs>
          <linearGradient id="product-curve" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="#95DE64" />
            <stop offset="55%" stopColor="#03a35f" />
            <stop offset="100%" stopColor="#017649" />
          </linearGradient>
        </defs>
        <path d={curve} stroke="#E3F3D6" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
        <motion.path d={curve} stroke="url(#product-curve)" strokeWidth={spectrum ? 1.5 : 2} strokeLinecap="round" vectorEffect="non-scaling-stroke" style={{ pathLength: progress }} />
      </svg>
      <motion.div
        style={{ opacity: badge, scale: badge }}
        className="absolute top-[42%] right-[0.6%] grid size-14 place-items-center rounded-full bg-white ring-2 ring-brand shadow-[0_12px_30px_-12px_rgba(1,118,73,0.5)]"
      >
        <span className="absolute inset-0 animate-ping-soft rounded-full ring-2 ring-lime" />
        <LogoMark className="size-8" />
      </motion.div>
    </div>
  );
}

function MobileRow() {
  const [open, setOpen] = useState<number | null>(null);
  const reduce = useReducedMotion();
  return (
    <ul className="relative mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-6 [scrollbar-width:none] md:px-10">
      {products.items.map((p, i) => (
        <motion.li
          key={p.key}
          initial={reduce ? false : { opacity: 0, y: 40, rotate: 4 }}
          whileInView={{ opacity: 1, y: 0, rotate: 0 }}
          viewport={{ once: true, margin: "0px 0px -10% 0px" }}
          transition={{ type: "spring", bounce: 0.2, visualDuration: 0.7, delay: i * 0.08 }}
          className="h-[540px] w-[84vw] max-w-[360px] shrink-0 snap-center"
        >
          <CardBody p={p} open={open === i} hover={false} lifted={open === i} onOpen={() => setOpen(i)} onClose={() => setOpen(null)} />
        </motion.li>
      ))}
    </ul>
  );
}

/** One horizontal row on desktop; a swipeable row on smaller screens. */
export function ProductRow({ children }: { children: React.ReactNode }) {
  return (
    <ul className="-mx-5 mt-14 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-4 md:-mx-10 md:px-10 lg:mx-0 lg:grid lg:grid-cols-3 lg:gap-6 lg:overflow-visible lg:px-0 lg:pb-0 [scrollbar-width:none]">
      {children}
    </ul>
  );
}

export function ProductBack({ product: p, onBack }: { product: Product; onBack: () => void }) {
  return (
    <>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[14px] text-brand">{p.category}</p>
          <h3 className="mt-1.5 text-h3 text-ink">{p.name}</h3>
        </div>
        <button
          type="button"
          onClick={onBack}
          aria-label={`Back to ${p.name} overview`}
          className="grid size-9 shrink-0 place-items-center rounded-full bg-white text-ink ring-1 ring-mint transition-colors hover:ring-lime"
        >
          <FlipIcon className="size-4" />
        </button>
      </div>
      <p className="mt-4 text-[15.5px] leading-relaxed text-copy">{p.copy}</p>
      <ul className="mt-6 space-y-3 border-t border-mint pt-6">
        {p.features.map((f) => (
          <li key={f} className="flex gap-3 text-[15px] leading-snug text-ink">
            <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-mint text-brand">
              <Check className="size-2.5" />
            </span>
            {f}
          </li>
        ))}
      </ul>
      <Link
        href={p.cta.href}
        className="group mt-auto inline-flex h-12 items-center justify-center gap-2 rounded-full bg-brand text-[15px] font-medium text-white transition-colors hover:bg-brand-700"
      >
        {p.cta.label}
        <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
      </Link>
    </>
  );
}
