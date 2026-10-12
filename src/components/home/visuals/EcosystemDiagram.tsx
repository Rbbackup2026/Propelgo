"use client";

import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { overview } from "@/content/home";
import { LogoMark } from "@/components/ui/Logo";
import { useStageScale } from "@/lib/useStageScale";

gsap.registerPlugin(ScrollTrigger);

const W = 560;
const H = 440;
const C = { x: 280, y: 220 };

const nodes = [
  { x: 120, y: 70, rail: "M120 92 V130 H250 V173" },
  { x: 440, y: 70, rail: "M440 92 V130 H310 V173" },
  { x: 92, y: 220, rail: "M162 220 H224" },
  { x: 470, y: 220, rail: "M394 220 H336" },
  { x: 120, y: 370, rail: "M120 348 V310 H250 V267" },
  { x: 440, y: 370, rail: "M440 348 V310 H310 V267" },
];

const icons = [
  <path key="b" d="M3 6.5 8 3.5l5 3M4 7v5m2.7-5v5m2.6-5v5M12 7v5M3 12.5h10" />,
  <g key="i">
    <rect x="2.5" y="4.5" width="11" height="7.5" rx="1.5" />
    <path d="M2.5 7h11" />
  </g>,
  <g key="n">
    <circle cx="6.2" cy="8" r="3.4" />
    <circle cx="9.8" cy="8" r="3.4" />
  </g>,
  <path key="p" d="M3.5 4h9v8h-9zM5.5 6.5h5M5.5 9h3" />,
  <g key="w">
    <circle cx="4" cy="4.5" r="1.5" />
    <circle cx="12" cy="8" r="1.5" />
    <circle cx="4" cy="11.5" r="1.5" />
    <path d="M5.5 4.5h2.5V8h2.5M5.5 11.5h2.5V8" />
  </g>,
  <path key="r" d="M3.5 12V8m3 4V5m3 7V7m3 5V3.5" />,
];

export function EcosystemDiagram() {
  const { ref, scale } = useStageScale<HTMLDivElement>(W);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      const rails = gsap.utils.toArray<SVGPathElement>(".rail-live");
      rails.forEach((p) => {
        const len = p.getTotalLength();
        gsap.set(p, { strokeDasharray: len, strokeDashoffset: len });
      });
      gsap.set(".eco-node", { opacity: 0, y: 12 });
      gsap.set(".eco-core", { scale: 0.6, opacity: 0 });
      gsap.set(".eco-packet", { opacity: 0 });
      gsap
        .timeline({
          scrollTrigger: { trigger: el, start: "top 78%", once: true },
          defaults: { ease: "expo.out" },
        })
        .to(".eco-core", { scale: 1, opacity: 1, duration: 1 })
        .to(rails, { strokeDashoffset: 0, duration: 1.1, stagger: 0.12, ease: "power2.inOut" }, "-=0.6")
        .to(".eco-node", { opacity: 1, y: 0, duration: 0.8, stagger: 0.1 }, "-=1.3")
        .to(".eco-packet", { opacity: 1, duration: 0.4, stagger: 0.08 }, "-=0.3");
    }, el);
    return () => ctx.revert();
  }, [ref]);

  return (
    <figure className="grid-lines-ink relative overflow-hidden rounded-[28px] border border-paper-300 bg-white">
      <div ref={ref} className="relative w-full" style={{ height: H * scale + 24 }}>
        <div className="absolute top-3 left-1/2 origin-top" style={{ width: W, height: H, transform: `translateX(-50%) scale(${scale})` }}>
          <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 size-full" fill="none" aria-hidden="true">
            {nodes.map((n, i) => (
              <path key={`base-${i}`} d={n.rail} stroke="rgba(12,31,22,0.12)" />
            ))}
            {nodes.map((n, i) => (
              <path key={`live-${i}`} id={`eco-rail-${i}`} className="rail-live" d={n.rail} stroke="#049A39" strokeWidth="1.4" />
            ))}
            {nodes.map((_, i) => (
              <circle key={`pk-${i}`} className="eco-packet" r="3.2" fill="#07F258" stroke="#049A39">
                <animateMotion
                  dur={`${2.2 + (i % 3) * 0.45}s`}
                  repeatCount="indefinite"
                  begin={`${i * 0.3}s`}
                  keyPoints={i % 2 ? "0;1" : "1;0"}
                  keyTimes="0;1"
                  calcMode="linear"
                >
                  <mpath href={`#eco-rail-${i}`} />
                </animateMotion>
              </circle>
            ))}
          </svg>

          <div className="eco-core absolute grid place-items-center" style={{ left: C.x, top: C.y, translate: "-50% -50%" }}>
            <span className="animate-pulse-ring absolute size-[112px] rounded-full bg-signal/35" />
            <span className="absolute size-[148px] rounded-full bg-mint/70" />
            <span className="relative grid size-[112px] place-items-center rounded-full bg-forest shadow-[0_20px_50px_-15px_rgba(6,38,23,0.6)]">
              <LogoMark tone="dark" className="size-16" />
            </span>
          </div>

          {overview.nodes.map((n, i) => (
            <div
              key={n.noun}
              className="eco-node absolute flex items-center gap-2.5 rounded-xl border border-paper-300 bg-paper py-2 pr-3.5 pl-2 shadow-[0_8px_20px_-12px_rgba(6,38,23,0.35)]"
              style={{ left: nodes[i].x, top: nodes[i].y, translate: "-50% -50%" }}
            >
              <span className="grid size-8 place-items-center rounded-lg bg-forest text-signal">
                <svg viewBox="0 0 16 16" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.2">
                  {icons[i]}
                </svg>
              </span>
              <span className="leading-tight">
                <span className="label block !text-[9px] text-muted">{n.verb}</span>
                <span className="block text-[13px] font-medium whitespace-nowrap text-ink">{n.noun}</span>
              </span>
            </div>
          ))}
        </div>
      </div>
      <figcaption className="label border-t border-paper-300 bg-white/80 px-6 py-3.5 !text-[10px] text-muted">
        Fig. 01 · One layer between enterprise and ecosystem
      </figcaption>
    </figure>
  );
}
