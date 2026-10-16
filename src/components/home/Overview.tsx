"use client";

import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { overview, stats } from "@/content/home";
import { Button } from "@/components/ui/Button";
import { Counter } from "@/components/ui/Counter";
import { LogoMark } from "@/components/ui/Logo";
import { Check } from "@/components/ui/icons";
import { useMediaQuery } from "@/lib/useMediaQuery";
import { NodeGlyph, type NodeKind } from "./visuals/NodeGlyph";

const ease = [0.16, 1, 0.3, 1] as const;
const kinds: NodeKind[] = ["connect", "issue", "route", "integrate", "automate", "reconcile"];

/** Index of the title word set in the brand gradient ("infrastructure"). */
const ACCENT_WORD = 2;

export function Overview() {
  const sheetRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: sheetRef, offset: ["start end", "start 0.1"] });
  const scale = useTransform(scrollYProgress, [0, 1], [0.9, 1]);
  const radius = useTransform(scrollYProgress, [0, 1], [96, 40]);

  return (
    <section id="about" aria-labelledby="about-title" className="relative px-2 pb-3 sm:px-3 md:px-4">
      <motion.div
        ref={sheetRef}
        style={reduce ? undefined : { scale, borderRadius: radius }}
        className="relative origin-top overflow-clip rounded-[40px] bg-mist ring-1 ring-mint"
      >
        <SheetBackdrop progress={scrollYProgress} />
        <Statement />
        <Rail />
        <Stats />
      </motion.div>
    </section>
  );
}

function SheetBackdrop({ progress }: { progress: MotionValue<number> }) {
  const rotate = useTransform(progress, [0, 1], [-30, 0]);
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden="true">
      <div className="absolute inset-0 bg-[radial-gradient(rgba(1,118,73,0.13)_1px,transparent_1px)] bg-[size:22px_22px] [mask-image:linear-gradient(to_bottom,#000,transparent_45%)]" />
      <div className="absolute -top-40 left-1/2 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(149,222,100,0.45),transparent)]" />
      <motion.div style={{ rotate }} className="absolute -top-24 -right-24 opacity-[0.05]">
        <LogoMark className="size-[420px]" />
      </motion.div>
    </div>
  );
}

function Statement() {
  const [founded, first] = overview.milestone.split(/(?<=\.)\s+/);
  return (
    <div className="container-page relative pt-24 pb-20 md:pt-36 md:pb-28 lg:pb-4">
      <ClipReveal className="flex justify-center">
        <p className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-[14px] font-medium text-brand shadow-[0_1px_2px_rgba(6,38,23,0.06)] ring-1 ring-mint">
          <span className="size-1.5 rounded-full bg-lime" />
          {overview.eyebrow}
        </p>
      </ClipReveal>

      <ScrollFillTitle text={overview.title} id="about-title" />

      <div className="mx-auto mt-16 grid max-w-[1040px] items-start gap-10 md:mt-24 md:grid-cols-[1.15fr_1fr] md:gap-16">
        <ClipReveal>
          <p className="text-[clamp(1.25rem,1rem+0.8vw,1.65rem)] leading-[1.45] font-medium tracking-[-0.015em] text-pretty text-ink">{overview.lead}</p>
          <Button href={overview.cta.href} className="mt-8">
            {overview.cta.label}
          </Button>
        </ClipReveal>

        <ClipReveal delay={0.12}>
          <div className="relative overflow-hidden rounded-[28px] bg-white p-6 shadow-[0_30px_60px_-36px_rgba(6,38,23,0.35)] ring-1 ring-mint md:p-7">
            <FlightPath />
            <ul className="relative mt-5 space-y-4">
              <li className="flex items-start gap-3">
                <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full bg-mint text-brand">
                  <LogoMark className="size-4" />
                </span>
                <p className="text-[16px] leading-relaxed text-ink">{founded}</p>
              </li>
              {first && (
                <li className="flex items-start gap-3">
                  <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full bg-brand text-white">
                    <Check className="size-3" />
                  </span>
                  <p className="text-[16px] leading-relaxed text-copy">{first}</p>
                </li>
              )}
            </ul>
          </div>
        </ClipReveal>
      </div>
    </div>
  );
}

function ScrollFillTitle({ text, id }: { text: string; id: string }) {
  const ref = useRef<HTMLHeadingElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.9", "end 0.5"] });
  const words = text.split(" ");
  return (
    <h2
      ref={ref}
      id={id}
      className="mx-auto mt-8 max-w-[19ch] text-center text-[clamp(2.25rem,1.1rem+3.6vw,4.5rem)] leading-[1.04] font-semibold tracking-[-0.04em] text-balance text-ink"
    >
      {words.map((w, i) => (
        <span key={i}>
          <FillWord progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]} still={!!reduce} accent={i === ACCENT_WORD}>
            {w}
          </FillWord>
          {i < words.length - 1 && " "}
        </span>
      ))}
    </h2>
  );
}

function FillWord({ progress, range, still, accent, children }: { progress: MotionValue<number>; range: [number, number]; still: boolean; accent: boolean; children: ReactNode }) {
  const opacity = useTransform(progress, range, [0.12, 1]);
  const y = useTransform(progress, range, [10, 0]);
  return (
    <motion.span
      style={still ? undefined : { opacity, y }}
      className={`inline-block ${accent ? "bg-[linear-gradient(100deg,#017649,#03a35f_55%,#5fbf3f)] bg-clip-text text-transparent" : ""}`}
    >
      {children}
    </motion.span>
  );
}

function ClipReveal({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : { clipPath: "inset(0 0 100% 0)", y: 40 }}
      whileInView={{ clipPath: "inset(0 0 0% 0)", y: 0 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 1, ease, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function FlightPath() {
  const d = "M8 52 C 70 52, 90 8, 160 14 S 250 40, 292 18";
  return (
    <svg viewBox="0 0 300 60" className="w-full" fill="none" aria-hidden="true">
      <path d={d} stroke="#D9F7BE" strokeWidth="2" strokeDasharray="2 6" strokeLinecap="round" />
      <motion.path
        d={d}
        stroke="#017649"
        strokeWidth="2"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.8, ease, delay: 0.4 }}
      />
      <circle cx="8" cy="52" r="5" fill="#95DE64" />
      <motion.g initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ delay: 2, type: "spring", bounce: 0.3, visualDuration: 0.4 }} style={{ transformOrigin: "292px 18px" }}>
        <circle cx="292" cy="18" r="7" fill="#017649" />
        <path d="M289 18.5l2 2 3.5-4" stroke="#fff" strokeWidth="1.6" />
      </motion.g>
    </svg>
  );
}

function Rail() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const desktop = useMediaQuery("(min-width: 1024px)");
  const reduce = useReducedMotion();
  const pinned = desktop && !reduce;
  const nodes = overview.nodes;

  const { scrollYProgress } = useScroll({ target: wrapRef, offset: ["start start", "end end"] });
  const dist = useMotionValue(0);
  const x = useTransform(() => -scrollYProgress.get() * dist.get());
  const [active, setActive] = useState(0);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (pinned) setActive(Math.min(nodes.length - 1, Math.floor(v * nodes.length)));
  });

  useEffect(() => {
    const view = viewRef.current;
    const track = trackRef.current;
    if (!pinned || !view || !track) return;
    const measure = () => dist.set(Math.max(0, track.scrollWidth - view.clientWidth));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(view);
    ro.observe(track);
    return () => ro.disconnect();
  }, [pinned, dist]);

  return (
    <div ref={wrapRef} className={pinned ? "relative h-[340vh]" : "relative"}>
      <div className={pinned ? "sticky top-0 flex h-screen items-center overflow-hidden" : "pb-20"}>
        <div className="container-page grid w-full items-center gap-10 lg:grid-cols-[320px_minmax(0,1fr)] lg:gap-12">
          <div>
            <p className="text-body text-pretty text-copy">{overview.body}</p>
            {pinned && (
              <div className="mt-10">
                <div className="flex items-baseline gap-2 text-ink">
                  <span className="relative inline-block h-[44px] w-[1.3em] overflow-hidden text-[40px] leading-[44px] font-semibold tracking-[-0.04em]">
                    <AnimatePresence mode="popLayout" initial={false}>
                      <motion.span
                        key={active}
                        initial={{ y: "100%" }}
                        animate={{ y: "0%" }}
                        exit={{ y: "-100%" }}
                        transition={{ duration: 0.45, ease }}
                        className="tabular absolute inset-0"
                      >
                        {String(active + 1).padStart(2, "0")}
                      </motion.span>
                    </AnimatePresence>
                  </span>
                  <span className="tabular text-[15px] text-sub">/ {String(nodes.length).padStart(2, "0")}</span>
                </div>
                <div className="mt-4 h-1 w-full overflow-hidden rounded-full bg-white ring-1 ring-mint">
                  <motion.div style={{ scaleX: scrollYProgress }} className="h-full origin-left rounded-full bg-gradient-to-r from-lime to-brand" />
                </div>
              </div>
            )}
          </div>

          <div ref={viewRef} className={pinned ? "relative overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_6%,#000_90%,transparent)]" : ""}>
            <motion.div
              ref={trackRef}
              style={pinned ? { x } : undefined}
              className={pinned ? "relative flex w-max gap-5 py-16 pr-[30%] pl-[4%]" : "grid gap-4 sm:grid-cols-2 lg:grid-cols-3"}
            >
              {pinned && <div className="absolute top-[108px] right-[30%] left-[4%] h-px bg-[repeating-linear-gradient(90deg,#95de64_0_6px,transparent_6px_12px)]" />}
              {nodes.map((n, i) => (
                <NodeCard key={n.noun} index={i} node={n} kind={kinds[i]} active={pinned ? i === active : true} pinned={pinned} />
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

function NodeCard({
  index,
  node,
  kind,
  active,
  pinned,
}: {
  index: number;
  node: (typeof overview.nodes)[number];
  kind: NodeKind;
  active: boolean;
  pinned: boolean;
}) {
  const reduce = useReducedMotion();
  const enter = pinned || reduce ? {} : { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: "0px 0px -10% 0px" } };
  return (
    <motion.article
      {...enter}
      animate={pinned ? { scale: active ? 1 : 0.94, opacity: active ? 1 : 0.62 } : undefined}
      transition={{ duration: 0.6, ease, delay: pinned ? 0 : (index % 3) * 0.08 }}
      className={`relative flex flex-col rounded-[28px] bg-white p-6 ring-1 transition-shadow duration-500 ${pinned ? "h-[400px] w-[320px] shrink-0" : ""} ${
        active && pinned ? "shadow-[0_40px_80px_-40px_rgba(1,118,73,0.55)] ring-brand/25" : "ring-mint"
      }`}
    >
      <div className="flex items-center justify-between">
        <span
          className={`tabular relative z-10 grid size-10 place-items-center rounded-full text-[13px] font-semibold transition-colors duration-500 ${
            active ? "bg-brand text-white" : "bg-mist text-forest ring-1 ring-mint"
          }`}
        >
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className="rounded-full bg-mist px-3 py-1 text-[12.5px] font-medium text-forest ring-1 ring-mint">{node.noun}</span>
      </div>
      <div className="mt-6 h-[140px] rounded-2xl bg-[linear-gradient(160deg,#f6ffee,#ffffff)] p-2 ring-1 ring-mint/70">
        <NodeGlyph kind={kind} active={active} />
      </div>
      <h3 className="mt-6 text-[30px] leading-none font-semibold tracking-[-0.035em] text-ink">{node.verb}</h3>
      <p className="mt-3 text-[15px] leading-relaxed text-pretty text-copy">{node.line}</p>
    </motion.article>
  );
}

function Stats() {
  return (
    <div className="container-page relative pt-8 pb-20 md:pb-28 lg:pt-0">
      <ClipReveal>
        <h3 className="max-w-[20ch] text-[clamp(1.75rem,1.2rem+1.6vw,2.75rem)] leading-[1.1] font-semibold tracking-[-0.03em] text-balance text-ink">{stats.title}</h3>
      </ClipReveal>
      <dl className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:grid-rows-2">
        {stats.items.map((s, i) => (
          <StatTile key={s.label} index={i} featured={i === 0} className={i === 0 ? "sm:col-span-2 lg:row-span-2" : i === 1 ? "lg:col-span-2" : ""}>
            <dt className={`text-[15px] ${i === 0 ? "text-white/75" : "text-copy"}`}>{s.label}</dt>
            <dd
              className={`mt-3 leading-none font-semibold tracking-[-0.04em] whitespace-nowrap ${
                i === 0 ? "text-[clamp(3.5rem,2rem+5vw,6.5rem)] text-white" : "text-[clamp(2rem,1.5rem+1.6vw,2.9rem)] text-ink"
              }`}
            >
              <Counter value={s.value} prefix={s.prefix} suffix={s.suffix} suffixClassName={s.suffix.length > 2 ? "text-[0.55em] tracking-[-0.01em]" : ""} />
            </dd>
          </StatTile>
        ))}
      </dl>
      <p className="mt-6 text-[13px] text-sub">{stats.note}</p>
    </div>
  );
}

function StatTile({ index, featured, className, children }: { index: number; featured: boolean; className: string; children: ReactNode }) {
  const reduce = useReducedMotion();
  const mx = useMotionValue(-200);
  const my = useMotionValue(-200);
  const spot = useMotionTemplate`radial-gradient(260px circle at ${mx}px ${my}px, ${featured ? "rgba(149,222,100,0.35)" : "rgba(149,222,100,0.28)"}, transparent 70%)`;
  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set(e.clientX - r.left);
    my.set(e.clientY - r.top);
  };

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 50, rotateX: 18 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      transition={{ type: "spring", bounce: 0.15, visualDuration: 0.9, delay: index * 0.09 }}
      whileHover={reduce ? undefined : { y: -6 }}
      onPointerMove={onMove}
      onPointerLeave={() => {
        mx.set(-200);
        my.set(-200);
      }}
      className={`group relative flex min-h-[200px] flex-col justify-end overflow-hidden rounded-[28px] p-7 ${
        featured ? "text-white" : "bg-white ring-1 ring-mint"
      } ${className}`}
      style={{
        transformPerspective: 900,
        background: featured ? "linear-gradient(145deg, #03a35f 0%, #017649 45%, #04452b 100%)" : undefined,
      }}
    >
      <motion.div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" style={{ background: spot }} />
      {featured && (
        <svg viewBox="0 0 400 400" className="pointer-events-none absolute -top-24 -right-24 size-[420px]" fill="none" aria-hidden="true">
          {[0, 1, 2, 3, 4].map((i) => (
            <motion.circle
              key={i}
              cx="200"
              cy="200"
              r={60 + i * 34}
              stroke="#fff"
              strokeOpacity={0.12 - i * 0.015}
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.6, ease, delay: 0.3 + i * 0.12 }}
            />
          ))}
        </svg>
      )}
      {!featured && <MiniBars index={index} />}
      <div className="relative">{children}</div>
    </motion.div>
  );
}

function MiniBars({ index }: { index: number }) {
  const heights = [[30, 46, 38, 62, 74], [22, 34, 52, 48, 70], [40, 36, 58, 66, 80]][(index - 1) % 3];
  return (
    <div className="absolute top-7 right-7 flex h-[56px] items-end gap-1.5" aria-hidden="true">
      {heights.map((h, i) => (
        <motion.span
          key={i}
          className={`w-2 origin-bottom rounded-full ${i === heights.length - 1 ? "bg-brand" : "bg-mint"}`}
          style={{ height: `${h}%` }}
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease, delay: 0.4 + i * 0.07 }}
        />
      ))}
    </div>
  );
}
