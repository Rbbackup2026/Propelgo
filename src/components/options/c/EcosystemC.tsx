"use client";

import { motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import { useState } from "react";
import { ecosystem } from "@/content/home";
import { LogoMark } from "@/components/ui/Logo";

const ease = [0.16, 1, 0.3, 1] as const;

/** Board geometry in viewBox units; columns are 22% wide, so x maps 1:1 at any width. */
const VB_W = 1200;
const VB_H = 408;
const ROW = 68;
const TILE_H = 56;
const COL = 0.22 * VB_W;
const HUB_R = 92;
const cy = (i: number) => 6 + i * ROW + TILE_H / 2;
const leftPath = (i: number) => `M ${COL} ${cy(i)} C ${COL + 150} ${cy(i)}, ${VB_W / 2 - HUB_R - 120} ${VB_H / 2}, ${VB_W / 2 - HUB_R} ${VB_H / 2}`;
const rightPath = (i: number) => `M ${VB_W - COL} ${cy(i)} C ${VB_W - COL - 150} ${cy(i)}, ${VB_W / 2 + HUB_R + 120} ${VB_H / 2}, ${VB_W / 2 + HUB_R} ${VB_H / 2}`;

type Logo = (typeof ecosystem.groups)[number]["logos"][number];

export function EcosystemC() {
  const [banks, partners] = ecosystem.groups;
  const [hot, setHot] = useState<string | null>(null);
  const reduce = useReducedMotion();

  return (
    <section aria-labelledby="eco-c-title" className="relative py-16 md:py-24">
      <div className="container-page">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px -10% 0px" }}
          transition={{ duration: 0.8, ease }}
          className="text-center"
        >
          <h2 id="eco-c-title" className="text-[clamp(1.375rem,1.15rem+0.8vw,1.875rem)] leading-tight font-semibold tracking-[-0.025em] text-ink">
            {ecosystem.caption}
          </h2>
          <p className="mt-3 text-[15px] text-copy">
            {banks.logos.length} {banks.label.toLowerCase()} · {partners.logos.length} {partners.label.toLowerCase()} · one integration
          </p>
        </motion.div>

        <div className="mt-12 hidden items-center justify-between text-[12px] font-semibold tracking-[0.12em] text-ink uppercase lg:flex">
          <GroupLabel label={banks.label} />
          <GroupLabel label={partners.label} align="right" />
        </div>

        <motion.div
          initial={reduce ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "0px 0px -15% 0px" }}
          transition={{ duration: 0.8 }}
          className="relative mt-4 hidden h-[408px] lg:block"
        >
          <svg viewBox={`0 0 ${VB_W} ${VB_H}`} preserveAspectRatio="none" className="absolute inset-0 size-full" fill="none" aria-hidden="true">
            <defs>
              <linearGradient id="eco-c-l" x1="0" x2="1">
                <stop offset="0%" stopColor="#d9f7be" />
                <stop offset="100%" stopColor="#95de64" />
              </linearGradient>
              <linearGradient id="eco-c-r" x1="1" x2="0">
                <stop offset="0%" stopColor="#cdeef4" />
                <stop offset="100%" stopColor="#6fd0de" />
              </linearGradient>
            </defs>
            {banks.logos.map((l, i) => (
              <Wire key={l.name} d={leftPath(i)} grad="url(#eco-c-l)" hot={hot === l.name} color="#017649" index={i} reduce={!!reduce} />
            ))}
            {partners.logos.map((l, i) => (
              <Wire key={l.name} d={rightPath(i)} grad="url(#eco-c-r)" hot={hot === l.name} color="#0e8ba3" index={i} reduce={!!reduce} outbound />
            ))}
          </svg>

          <Column logos={banks.logos} side="left" hot={hot} setHot={setHot} />
          <Column logos={partners.logos} side="right" hot={hot} setHot={setHot} />
          <Hub />
        </motion.div>

        <div className="mt-10 space-y-8 lg:hidden">
          {[banks, partners].map((g) => (
            <div key={g.label}>
              <GroupLabel label={g.label} />
              <ul className="mt-3 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                {g.logos.map((l) => (
                  <li key={l.name} className="flex h-16 items-center justify-center rounded-2xl bg-white px-4 ring-1 ring-line">
                    <LogoImg logo={l} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function GroupLabel({ label, align = "left" }: { label: string; align?: "left" | "right" }) {
  return (
    <p className={`flex items-center gap-2 text-[12px] font-semibold tracking-[0.12em] text-ink uppercase ${align === "right" ? "flex-row-reverse" : ""}`}>
      <span className={`size-1.5 rounded-full ${align === "right" ? "bg-[#0e8ba3]" : "bg-brand"}`} />
      {label}
    </p>
  );
}

function Wire({ d, grad, hot, color, index, reduce, outbound }: { d: string; grad: string; hot: boolean; color: string; index: number; reduce: boolean; outbound?: boolean }) {
  return (
    <g>
      <path d={d} stroke={grad} strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
      <path d={d} stroke={color} strokeWidth="2" vectorEffect="non-scaling-stroke" className="transition-opacity duration-300" opacity={hot ? 1 : 0} />
      {!reduce && (
        <circle r="3.2" fill={color}>
          <animateMotion
            dur="3.4s"
            begin={`${index * 0.55 + (outbound ? 0.3 : 0)}s`}
            repeatCount="indefinite"
            path={d}
            keyPoints={outbound ? "1;0" : "0;1"}
            keyTimes="0;1"
            calcMode="linear"
          />
          <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.1;0.85;1" dur="3.4s" begin={`${index * 0.55 + (outbound ? 0.3 : 0)}s`} repeatCount="indefinite" />
        </circle>
      )}
    </g>
  );
}

function Column({ logos, side, hot, setHot }: { logos: Logo[]; side: "left" | "right"; hot: string | null; setHot: (n: string | null) => void }) {
  const reduce = useReducedMotion();
  return (
    <ul className={`absolute inset-y-0 w-[22%] ${side === "left" ? "left-0" : "right-0"}`}>
      {logos.map((l, i) => {
        const on = hot === l.name;
        return (
          <motion.li
            key={l.name}
            initial={reduce ? false : { opacity: 0, x: side === "left" ? -24 : 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease, delay: 0.1 + i * 0.06 }}
            onMouseEnter={() => setHot(l.name)}
            onMouseLeave={() => setHot(null)}
            className={`absolute inset-x-0 flex items-center justify-center rounded-2xl bg-white px-5 ring-1 transition-[box-shadow,transform] duration-300 ${
              on ? "-translate-y-0.5 shadow-[0_16px_30px_-18px_rgba(6,38,23,0.4)] ring-brand/30" : "shadow-[0_1px_2px_rgba(0,0,0,0.03)] ring-line"
            }`}
            style={{ top: 6 + i * ROW, height: TILE_H }}
          >
            <LogoImg logo={l} />
          </motion.li>
        );
      })}
    </ul>
  );
}

function LogoImg({ logo }: { logo: Logo }) {
  const fit = Math.min(132 / logo.width, 28 / logo.height);
  const w = Math.round(logo.width * fit);
  const h = Math.round(logo.height * fit);
  return <Image src={logo.src} alt={logo.name} width={w} height={h} unoptimized draggable={false} className="max-w-full object-contain select-none" style={{ width: w, height: "auto" }} />;
}

function Hub() {
  return (
    <div className="absolute top-1/2 left-1/2 grid size-[184px] -translate-x-1/2 -translate-y-1/2 place-items-center">
      <span className="absolute inset-0 rounded-full bg-[radial-gradient(closest-side,rgba(149,222,100,0.35),transparent)]" />
      <span className="absolute inset-3 animate-[spin_28s_linear_infinite] rounded-full border border-dashed border-brand/25 motion-reduce:animate-none" />
      <span className="absolute inset-7 animate-ping-soft rounded-full ring-1 ring-lime/70 [animation-duration:3.2s] motion-reduce:hidden" />
      <div className="relative grid size-[112px] place-items-center rounded-full bg-white shadow-[0_24px_50px_-20px_rgba(1,118,73,0.55)] ring-1 ring-mint">
        <div className="flex flex-col items-center">
          <LogoMark className="size-11" />
          <span className="mt-1.5 text-[12px] font-semibold tracking-[-0.01em] text-ink">PropelGo</span>
        </div>
      </div>
    </div>
  );
}
