"use client";

import createGlobe, { type Arc, type Marker } from "cobe";
import { useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";

type LatLng = [number, number];

const HUBS: Record<string, LatLng> = {
  mumbai: [19.08, 72.88],
  delhi: [28.61, 77.21],
  bengaluru: [12.97, 77.59],
  chennai: [13.08, 80.27],
  hyderabad: [17.39, 78.49],
  kolkata: [22.57, 88.36],
  ahmedabad: [23.02, 72.57],
  pune: [18.52, 73.86],
  jaipur: [26.91, 75.79],
  kochi: [9.93, 76.27],
};

const rgb = (hex: string): [number, number, number] => {
  const n = parseInt(hex.slice(1), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
};

const BRAND = rgb("#017649");
const INDIGO = rgb("#5b57d9");
const TEAL = rgb("#0e8ba3");
const ROSE = rgb("#c8507a");
const AMBER = rgb("#d9822b");

const MARKERS: Marker[] = Object.entries(HUBS).map(([id, location], i) => ({
  id,
  location,
  size: id === "mumbai" ? 0.07 : 0.035,
  color: [BRAND, INDIGO, TEAL, ROSE, AMBER][i % 5],
}));

const route = (a: string, b: string, color: [number, number, number]): Arc => ({ from: HUBS[a], to: HUBS[b], color });

const ARCS: Arc[] = [
  route("mumbai", "delhi", INDIGO),
  route("mumbai", "bengaluru", TEAL),
  route("mumbai", "kolkata", ROSE),
  route("mumbai", "chennai", BRAND),
  route("delhi", "hyderabad", AMBER),
  route("bengaluru", "kolkata", INDIGO),
  route("ahmedabad", "chennai", ROSE),
  route("jaipur", "kochi", TEAL),
];

/** Longitude/latitude to cobe's phi/theta so a location faces the viewer. */
const facing = ([lat, lng]: LatLng): [number, number] => [Math.PI - ((lng * Math.PI) / 180 - Math.PI / 2), (lat * Math.PI) / 180];

const [START_PHI, START_THETA] = facing([20, 80]);

/** Dotted WebGL globe with payment routes across India. Rotates slowly; drag to spin. */
export function PaymentGlobe({ className = "" }: { className?: string }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const inView = useInView(wrapRef, { margin: "10% 0px" });
  const reduce = useReducedMotion();
  const drag = useRef<{ x: number; phi: number } | null>(null);
  const offset = useRef(0);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap || !inView) return;
    // A fresh canvas per mount: a destroyed WebGL context cannot be reused.
    const canvas = document.createElement("canvas");
    canvas.className = "absolute inset-0 size-full opacity-0 transition-opacity duration-1000";
    wrap.appendChild(canvas);
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let size = canvas.offsetWidth;
    let phi = START_PHI;
    let raf = 0;

    const globe = createGlobe(canvas, {
      devicePixelRatio: dpr,
      width: size * dpr,
      height: size * dpr,
      phi,
      theta: START_THETA,
      dark: 0,
      diffuse: 1.15,
      mapSamples: 22000,
      mapBrightness: 2.4,
      mapBaseBrightness: 0.02,
      baseColor: [0.97, 0.98, 1],
      markerColor: BRAND,
      glowColor: [0.94, 0.95, 1],
      markers: MARKERS,
      arcs: ARCS,
      arcColor: INDIGO,
      arcWidth: 0.6,
      arcHeight: 0.18,
      markerElevation: 0.01,
      opacity: 0.92,
    });

    const ro = new ResizeObserver(() => {
      size = canvas.offsetWidth;
      globe.update({ width: size * dpr, height: size * dpr });
    });
    ro.observe(canvas);

    const tick = () => {
      if (!drag.current && !reduce) phi += 0.0022;
      globe.update({ phi: phi + offset.current });
      raf = requestAnimationFrame(tick);
    };
    tick();
    requestAnimationFrame(() => {
      canvas.style.opacity = "1";
    });

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      globe.destroy();
      canvas.remove();
    };
  }, [inView, reduce]);

  const release = () => {
    drag.current = null;
  };

  return (
    <div
      ref={wrapRef}
      className={`relative aspect-square cursor-grab touch-pan-y active:cursor-grabbing ${className}`}
      onPointerDown={(e) => {
        drag.current = { x: e.clientX, phi: offset.current };
        e.currentTarget.setPointerCapture(e.pointerId);
      }}
      onPointerMove={(e) => {
        if (drag.current) offset.current = drag.current.phi + (e.clientX - drag.current.x) / 180;
      }}
      onPointerUp={release}
      onPointerCancel={release}
      aria-hidden="true"
    />
  );
}
