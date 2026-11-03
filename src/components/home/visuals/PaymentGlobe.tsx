"use client";

import { useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";
import { LAND } from "./landDots";

type LatLng = [number, number];

const HUBS: Record<string, LatLng> = {
  mumbai: [19.08, 72.88],
  delhi: [28.61, 77.21],
  bengaluru: [12.97, 77.59],
  chennai: [13.08, 80.27],
  hyderabad: [17.39, 78.49],
  kolkata: [22.57, 88.36],
  ahmedabad: [23.02, 72.57],
  jaipur: [26.91, 75.79],
};

const BRAND = "#017649";
const LEAF = "#5fbf3f";

const ARCS: [string, string][] = [
  ["mumbai", "delhi"],
  ["mumbai", "bengaluru"],
  ["mumbai", "kolkata"],
  ["delhi", "hyderabad"],
  ["ahmedabad", "chennai"],
  ["jaipur", "kolkata"],
];

const RAD = Math.PI / 180;
const TILT = 18 * RAD;
const START = -80 * RAD;

type Vec = [number, number, number];

const toVec = ([lat, lng]: LatLng): Vec => [Math.cos(lat * RAD) * Math.sin(lng * RAD), Math.sin(lat * RAD), Math.cos(lat * RAD) * Math.cos(lng * RAD)];

const LAND_VECS: Vec[] = [];
for (let i = 0; i < LAND.length; i += 2) LAND_VECS.push(toVec([LAND[i], LAND[i + 1]]));

/** Great-circle points between two hubs, lifted off the surface towards the middle. */
const ARC_VECS: Vec[][] = ARCS.map(([a, b]) => {
  const p = toVec(HUBS[a]);
  const q = toVec(HUBS[b]);
  const omega = Math.acos(Math.min(1, p[0] * q[0] + p[1] * q[1] + p[2] * q[2]));
  return Array.from({ length: 25 }, (_, k) => {
    const t = k / 24;
    const s = Math.sin(omega) || 1;
    const wa = Math.sin((1 - t) * omega) / s;
    const wb = Math.sin(t * omega) / s;
    const lift = 1 + 0.06 * Math.sin(Math.PI * t);
    return [(wa * p[0] + wb * q[0]) * lift, (wa * p[1] + wb * q[1]) * lift, (wa * p[2] + wb * q[2]) * lift] as Vec;
  });
});

const HUB_VECS = Object.values(HUBS).map(toVec);

/** Rotate about the vertical axis by `rot`, then tilt towards the viewer. */
function project([x, y, z]: Vec, rot: number): Vec {
  const c = Math.cos(rot);
  const s = Math.sin(rot);
  const x1 = x * c + z * s;
  const z1 = -x * s + z * c;
  const ct = Math.cos(TILT);
  const st = Math.sin(TILT);
  return [x1, y * ct - z1 * st, y * st + z1 * ct];
}

/**
 * Dotted globe with payment routes across India, drawn on a 2D canvas.
 * It keeps one canvas for its whole life and only pauses off-screen, so it never blanks while cards flip or scroll.
 */
export function PaymentGlobe({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const inView = useInView(canvasRef, { margin: "20% 0px" });
  const reduce = useReducedMotion();
  const rot = useRef(START);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    let size = 0;
    let raf = 0;
    let last = 0;

    const fit = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      size = canvas.clientWidth || 148;
      canvas.width = Math.round(size * dpr);
      canvas.height = Math.round(size * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = () => {
      const r = size / 2 - 2;
      const c = size / 2;
      ctx.clearRect(0, 0, size, size);

      const body = ctx.createRadialGradient(c - r * 0.35, c - r * 0.4, r * 0.1, c, c, r);
      body.addColorStop(0, "#ffffff");
      body.addColorStop(1, "#eef6ee");
      ctx.fillStyle = body;
      ctx.beginPath();
      ctx.arc(c, c, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "rgba(1,118,73,0.14)";
      ctx.lineWidth = 1;
      ctx.stroke();

      const dot = Math.max(0.7, size / 150);
      for (const v of LAND_VECS) {
        const [x, y, z] = project(v, rot.current);
        if (z <= 0.02) continue;
        ctx.fillStyle = `rgba(16,72,62,${(0.18 + 0.62 * z).toFixed(3)})`;
        ctx.fillRect(c + x * r - dot / 2, c - y * r - dot / 2, dot, dot);
      }

      ctx.lineCap = "round";
      ctx.lineWidth = 1.1;
      ARC_VECS.forEach((arc, i) => {
        ctx.strokeStyle = i % 2 ? LEAF : BRAND;
        ctx.beginPath();
        let pen = false;
        for (const v of arc) {
          const [x, y, z] = project(v, rot.current);
          if (z <= 0) {
            pen = false;
            continue;
          }
          if (pen) ctx.lineTo(c + x * r, c - y * r);
          else ctx.moveTo(c + x * r, c - y * r);
          pen = true;
        }
        ctx.stroke();
      });

      for (const v of HUB_VECS) {
        const [x, y, z] = project(v, rot.current);
        if (z <= 0) continue;
        ctx.fillStyle = BRAND;
        ctx.beginPath();
        ctx.arc(c + x * r, c - y * r, Math.max(1.4, size / 90), 0, Math.PI * 2);
        ctx.fill();
      }
    };

    fit();
    draw();
    const ro = new ResizeObserver(() => {
      fit();
      draw();
    });
    ro.observe(canvas);

    if (inView && !reduce) {
      const tick = (t: number) => {
        if (last) rot.current += Math.min(t - last, 50) * 0.00012;
        last = t;
        draw();
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [inView, reduce]);

  return <canvas ref={canvasRef} className={`block aspect-square ${className}`} aria-hidden="true" />;
}
