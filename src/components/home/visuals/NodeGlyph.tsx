"use client";

import { motion } from "motion/react";
import { Fragment } from "react";

export type NodeKind = "connect" | "issue" | "route" | "integrate" | "automate" | "reconcile";

const ease = [0.16, 1, 0.3, 1] as const;
const BRAND = "#017649";
const LIME = "#95DE64";
const MINT = "#D9F7BE";
const LINE = "#CFE8C0";

/** Small animated schematic for each step of the PropelGo ecosystem. Plays while `active`. */
export function NodeGlyph({ kind, active }: { kind: NodeKind; active: boolean }) {
  return (
    <svg viewBox="0 0 260 140" className="h-full w-full" fill="none" aria-hidden="true">
      {kind === "connect" && <Connect active={active} />}
      {kind === "issue" && <Issue active={active} />}
      {kind === "route" && <Route active={active} />}
      {kind === "integrate" && <Integrate active={active} />}
      {kind === "automate" && <Automate active={active} />}
      {kind === "reconcile" && <Reconcile active={active} />}
    </svg>
  );
}

function Pulse({ path, dur = 1.8, begin = 0, active, color = BRAND }: { path: string; dur?: number; begin?: number; active: boolean; color?: string }) {
  if (!active) return null;
  return (
    <circle r="4" fill={color} stroke="#fff" strokeWidth="1.5">
      <animateMotion dur={`${dur}s`} begin={`${begin}s`} repeatCount="indefinite" path={path} />
    </circle>
  );
}

function Bank({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x="-22" y="-18" width="44" height="36" rx="10" fill="#fff" stroke={LINE} />
      <path d="M-11 -5 0 -11 11 -5Z" fill={BRAND} />
      <path d="M-8 -3v9M-3 -3v9M3 -3v9M8 -3v9" stroke={BRAND} strokeWidth="1.6" />
      <path d="M-11 8h22" stroke={BRAND} strokeWidth="1.6" />
    </g>
  );
}

function Connect({ active }: { active: boolean }) {
  const ys = [28, 70, 112];
  const paths = ys.map((y) => `M58 ${y} C 120 ${y}, 140 70, 186 70`);
  return (
    <>
      {paths.map((d, i) => (
        <path key={i} d={d} stroke={LINE} strokeWidth="1.5" />
      ))}
      {paths.map((d, i) => (
        <Pulse key={i} path={d} begin={i * 0.5} active={active} />
      ))}
      {ys.map((y) => (
        <Bank key={y} x={36} y={y} />
      ))}
      <motion.circle cx="212" cy="70" r="26" fill={BRAND} animate={active ? { scale: [1, 1.08, 1] } : { scale: 1 }} transition={{ duration: 1.8, repeat: active ? Infinity : 0 }} style={{ transformOrigin: "212px 70px" }} />
      <circle cx="212" cy="70" r="34" stroke={LIME} strokeDasharray="3 5" />
      <path d="M203 77l14-14M206 63h11v11" stroke="#fff" strokeWidth="2.2" />
    </>
  );
}

function Issue({ active }: { active: boolean }) {
  const cards = [
    { fill: MINT, rot: -14, x: -34 },
    { fill: LIME, rot: 0, x: 0 },
    { fill: BRAND, rot: 14, x: 34 },
  ];
  return (
    <>
      <rect x="40" y="112" width="180" height="10" rx="5" fill={MINT} />
      {cards.map((c, i) => (
        <motion.g
          key={i}
          style={{ transformOrigin: "130px 120px" }}
          initial={false}
          animate={active ? { rotate: c.rot, x: c.x, y: -4 } : { rotate: 0, x: 0, y: 6 }}
          transition={{ type: "spring", bounce: 0.25, visualDuration: 0.6, delay: i * 0.08 }}
        >
          <rect x="80" y="30" width="100" height="64" rx="10" fill={c.fill} stroke="#fff" strokeWidth="2" />
          <rect x="92" y="48" width="16" height="12" rx="3" fill={i === 2 ? "#E9E3C8" : "#fff"} opacity="0.9" />
          <rect x="92" y="74" width="44" height="5" rx="2.5" fill={i === 2 ? "#fff" : BRAND} opacity="0.55" />
        </motion.g>
      ))}
    </>
  );
}

function Route({ active }: { active: boolean }) {
  const outs = [26, 70, 114];
  const paths = outs.map((y) => `M70 70 C 130 70, 140 ${y}, 196 ${y}`);
  return (
    <>
      {paths.map((d, i) => (
        <motion.path
          key={i}
          d={d}
          stroke={active ? BRAND : LINE}
          strokeWidth="1.5"
          initial={false}
          animate={{ pathLength: active ? [0, 1] : 1 }}
          transition={{ duration: 0.7, ease, delay: i * 0.12 }}
        />
      ))}
      {paths.map((d, i) => (
        <Pulse key={i} path={d} begin={0.6 + i * 0.4} dur={1.6} active={active} color={LIME} />
      ))}
      <rect x="20" y="50" width="50" height="40" rx="12" fill={BRAND} />
      <path d="M36 70h18M48 64l6 6-6 6" stroke="#fff" strokeWidth="2" />
      {outs.map((y, i) => (
        <g key={y}>
          <rect x="196" y={y - 15} width="48" height="30" rx="15" fill="#fff" stroke={LINE} />
          <motion.circle
            cx="212"
            cy={y}
            r="5"
            initial={false}
            animate={{ fill: active ? BRAND : "#E8E8E8" }}
            transition={{ delay: 0.5 + i * 0.12 }}
          />
          <rect x="222" y={y - 2.5} width="14" height="5" rx="2.5" fill={LINE} />
        </g>
      ))}
    </>
  );
}

function Integrate({ active }: { active: boolean }) {
  return (
    <>
      <motion.g initial={false} animate={{ x: active ? 12 : 0 }} transition={{ type: "spring", bounce: 0.2, visualDuration: 0.6 }}>
        <rect x="18" y="34" width="86" height="72" rx="14" fill="#fff" stroke={LINE} />
        <text x="61" y="66" textAnchor="middle" fontSize="13" fontWeight="600" fill="#1F1F1F">ERP</text>
        <rect x="38" y="78" width="46" height="5" rx="2.5" fill={MINT} />
        <rect x="104" y="62" width="10" height="16" rx="3" fill={BRAND} />
      </motion.g>
      <motion.g initial={false} animate={{ x: active ? -12 : 0 }} transition={{ type: "spring", bounce: 0.2, visualDuration: 0.6 }}>
        <rect x="156" y="34" width="86" height="72" rx="14" fill={BRAND} />
        <text x="199" y="66" textAnchor="middle" fontSize="13" fontWeight="600" fill="#fff">API</text>
        <text x="199" y="86" textAnchor="middle" fontSize="12" fill={LIME} fontFamily="monospace">{"{ }"}</text>
        <rect x="146" y="62" width="10" height="16" rx="3" fill={LIME} />
      </motion.g>
      <motion.path
        d="M118 70h26"
        stroke={BRAND}
        strokeWidth="2"
        strokeDasharray="4 4"
        animate={active ? { strokeDashoffset: [0, -16] } : { strokeDashoffset: 0 }}
        transition={{ duration: 0.8, repeat: active ? Infinity : 0, ease: "linear" }}
      />
    </>
  );
}

function Automate({ active }: { active: boolean }) {
  const xs = [34, 98, 162, 226];
  return (
    <>
      <path d="M34 70H226" stroke={LINE} strokeWidth="2" />
      <motion.path
        d="M34 70H226"
        stroke={BRAND}
        strokeWidth="2"
        initial={false}
        animate={{ pathLength: active ? [0, 1] : 0 }}
        transition={{ duration: 1.6, ease: "linear" }}
      />
      {xs.map((x, i) => (
        <Fragment key={x}>
          <motion.circle
            cx={x}
            cy="70"
            r="16"
            initial={false}
            animate={{ fill: active ? BRAND : "#FFFFFF" }}
            transition={{ duration: 0.3, delay: active ? i * 0.45 : 0 }}
            stroke={active ? BRAND : LINE}
            strokeWidth="1.5"
          />
          <motion.path
            d={`M${x - 6} 70.5l4 4 8-9`}
            stroke="#fff"
            strokeWidth="2.2"
            initial={false}
            animate={{ pathLength: active ? 1 : 0 }}
            transition={{ duration: 0.3, delay: active ? i * 0.45 + 0.15 : 0 }}
          />
          <rect x={x - 16} y="98" width="32" height="5" rx="2.5" fill={i % 2 ? MINT : LINE} />
        </Fragment>
      ))}
    </>
  );
}

const MATCH = [1, 0, 3, 2];

function Reconcile({ active }: { active: boolean }) {
  const ys = [28, 56, 84, 112];
  return (
    <>
      {ys.map((y, i) => (
        <Fragment key={y}>
          <rect x="18" y={y - 9} width="72" height="18" rx="6" fill="#fff" stroke={LINE} />
          <rect x="26" y={y - 2} width={30 + (i % 2) * 14} height="4" rx="2" fill={LINE} />
          <rect x="170" y={y - 9} width="72" height="18" rx="6" fill={MINT} />
          <rect x="178" y={y - 2} width={30 + (i % 2) * 14} height="4" rx="2" fill={BRAND} opacity="0.4" />
          <motion.path
            d={`M90 ${y} C 130 ${y}, 130 ${ys[MATCH[i]]}, 170 ${ys[MATCH[i]]}`}
            stroke={BRAND}
            strokeWidth="1.5"
            initial={false}
            animate={{ pathLength: active ? 1 : 0, opacity: active ? 1 : 0.2 }}
            transition={{ duration: 0.5, ease, delay: active ? i * 0.18 : 0 }}
          />
          <motion.circle
            cx="242"
            cy={y}
            r="7"
            fill={BRAND}
            initial={false}
            animate={{ scale: active ? 1 : 0 }}
            transition={{ type: "spring", bounce: 0.3, visualDuration: 0.3, delay: active ? 0.4 + i * 0.18 : 0 }}
            style={{ transformOrigin: `242px ${y}px` }}
          />
          <motion.path
            d={`M238.5 ${y}l2.5 2.5 4.5-5`}
            stroke="#fff"
            strokeWidth="1.6"
            initial={false}
            animate={{ opacity: active ? 1 : 0 }}
            transition={{ delay: active ? 0.5 + i * 0.18 : 0 }}
          />
        </Fragment>
      ))}
    </>
  );
}
