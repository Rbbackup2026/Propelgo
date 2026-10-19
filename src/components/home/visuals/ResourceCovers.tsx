"use client";

import { useReducedMotion } from "motion/react";

export type CoverArt = "orchestration" | "credit" | "vendors";

export const COVER_ACCENT: Record<CoverArt, string> = {
  orchestration: "#0e8ba3",
  credit: "#5b57d9",
  vendors: "#d9822b",
};

/** Editorial covers in the multi-colour palette, each with a slow ambient loop. */
export function SpectrumCover({ art }: { art: CoverArt }) {
  const still = !!useReducedMotion();
  if (art === "orchestration") return <Orchestration still={still} />;
  if (art === "credit") return <Credit still={still} />;
  return <Vendors still={still} />;
}

function Orchestration({ still }: { still: boolean }) {
  const ys = [60, 105, 150, 195, 240];
  const paths = ys.map((y) => `M0 ${y} C 140 ${y}, 160 150, 260 150`);
  return (
    <svg viewBox="0 0 400 300" className="size-full bg-[linear-gradient(160deg,#effafc,#f7fdfe)]" fill="none" aria-hidden="true">
      {paths.map((d, i) => (
        <path key={i} d={d} stroke={i === 2 ? "#0e8ba3" : "#9fdde7"} strokeWidth={i === 2 ? 3 : 2} />
      ))}
      <path d="M260 150 H400" stroke="#0e8ba3" strokeWidth="3" />
      {!still &&
        paths.map((d, i) => (
          <circle key={i} r="5" fill={i % 2 ? "#6fd0de" : "#0e8ba3"} stroke="#fff" strokeWidth="2">
            <animateMotion dur="2.6s" begin={`${i * 0.45}s`} repeatCount="indefinite" path={`${d} H400`} />
          </circle>
        ))}
      {!still && (
        <circle cx="260" cy="150" r="22" stroke="#6fd0de" strokeWidth="2" fill="none">
          <animate attributeName="r" values="22;40" dur="2.2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.8;0" dur="2.2s" repeatCount="indefinite" />
        </circle>
      )}
      <circle cx="260" cy="150" r="22" fill="#fff" stroke="#0e8ba3" strokeWidth="3" />
      <circle cx="260" cy="150" r="8" fill="#0e8ba3" />
    </svg>
  );
}

function Credit({ still }: { still: boolean }) {
  const shades = ["#e6e5fd", "#d0cefa", "#a9a6f5", "#8480e8", "#5b57d9"];
  return (
    <svg viewBox="0 0 400 300" className="size-full bg-[linear-gradient(160deg,#f5f4ff,#fbfbff)]" fill="none" aria-hidden="true">
      {shades.map((c, i) => {
        const h = (i + 1) * 30;
        return (
          <rect
            key={i}
            x={70 + i * 56}
            y={220 - h}
            width="36"
            height={h}
            rx="6"
            fill={c}
            className={still ? undefined : "animate-[bar-breathe_3.2s_ease-in-out_infinite] [transform-box:fill-box] [transform-origin:bottom]"}
            style={still ? undefined : { animationDelay: `${i * 0.25}s` }}
          />
        );
      })}
      <path d="M60 240h290" stroke="#e1dffb" strokeWidth="2" />
      <g className={still ? undefined : "animate-float"}>
        <g transform="rotate(-8 270 94)">
          <rect x="200" y="50" width="140" height="88" rx="12" fill="#fff" stroke="#d8d6f6" strokeWidth="2" />
          <rect x="216" y="70" width="24" height="18" rx="4" fill="#e6e5fd" />
          <rect x="216" y="108" width="62" height="6" rx="3" fill="#5b57d9" opacity="0.5" />
          <circle cx="314" cy="112" r="8" fill="#a9a6f5" />
          <circle cx="324" cy="112" r="8" fill="#5b57d9" opacity="0.8" />
        </g>
      </g>
    </svg>
  );
}

/** Order the highlight visits the twelve tiles in, so it hops rather than scans. */
const HOP = [0, 6, 3, 9, 1, 11, 4, 8, 2, 7, 10, 5];

function Vendors({ still }: { still: boolean }) {
  return (
    <svg viewBox="0 0 400 300" className="size-full bg-[linear-gradient(160deg,#fff8ef,#fffdf9)]" fill="none" aria-hidden="true">
      {[0, 1, 2].map((row) =>
        [0, 1, 2, 3].map((col) => {
          const n = row * 4 + col;
          const lit = still && (n === 0 || n === 6);
          return (
            <g key={n} transform={`translate(${52 + col * 78} ${52 + row * 70})`}>
              <rect width="64" height="54" rx="8" fill="#fff" stroke="#f1dcc1" />
              <rect x="10" y="12" width="28" height="4" rx="2" fill="#f1dcc1" />
              <rect x="10" y="22" width="40" height="4" rx="2" fill="#f5ebde" />
              <rect x="10" y="38" width="20" height="6" rx="3" fill="#fdecd6" />
              <g opacity={still ? (lit ? 1 : 0) : 0}>
                {!still && (
                  <animate
                    attributeName="opacity"
                    values="0;1;1;0;0"
                    keyTimes="0;0.04;0.14;0.2;1"
                    dur="6s"
                    begin={`${HOP.indexOf(n) * 0.5}s`}
                    repeatCount="indefinite"
                  />
                )}
                <rect width="64" height="54" rx="8" fill="#d9822b" />
                <rect x="10" y="12" width="28" height="4" rx="2" fill="#f5c27d" />
                <rect x="10" y="22" width="40" height="4" rx="2" fill="#fff" opacity="0.45" />
                <rect x="10" y="38" width="20" height="6" rx="3" fill="#fff" opacity="0.85" />
              </g>
            </g>
          );
        }),
      )}
    </svg>
  );
}
