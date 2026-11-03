"use client";

import Image from "next/image";
import { motion, useInView, useReducedMotion } from "motion/react";
import { useRef } from "react";
import { leadership } from "@/content/home";
import { Button } from "@/components/ui/Button";
import { BrandRibbon } from "@/components/ui/BrandRibbon";
import { Reveal } from "@/components/ui/Reveal";

const ease = [0.16, 1, 0.3, 1] as const;

export function Leadership() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });
  const reduce = useReducedMotion();

  return (
    <section id="leadership" aria-labelledby="leadership-title" className="relative px-2 py-3 sm:px-3 md:px-4">
      <div
        ref={ref}
        className="relative isolate overflow-hidden rounded-[40px] ring-1 ring-white/10"
        style={{ background: "radial-gradient(120% 90% at 85% 0%, #0d5236 0%, transparent 55%), linear-gradient(160deg, #0a3f29 0%, #062617 60%, #041b10 100%)" }}
      >
        <BrandRibbon
          variant="twist"
          play={inView}
          className="absolute -top-10 -right-24 -z-10 h-[520px] w-[min(52vw,640px)] -scale-x-100 opacity-90 [mask-image:radial-gradient(110%_100%_at_100%_0%,#000_40%,transparent_85%)] max-md:h-[320px] max-md:w-[80vw]"
        />
        <BrandRibbon
          variant="wave"
          light
          play={inView}
          className="absolute -bottom-16 -left-24 -z-10 h-[420px] w-[min(46vw,560px)] opacity-80 [mask-image:radial-gradient(110%_100%_at_0%_100%,#000_35%,transparent_80%)] max-md:hidden"
        />
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_50%_100%,rgba(149,222,100,0.08),transparent)]" />

        <div className="container-page py-16 md:py-24">
          <Reveal className="max-w-[720px]">
            <h2 id="leadership-title" className="text-[clamp(1.875rem,1.4rem+1.5vw,2.75rem)] leading-[1.12] font-semibold tracking-[-0.03em] text-balance text-white">
              {leadership.title}{" "}
              <span className="bg-[linear-gradient(90deg,#95de64_0%,#5fbf3f_100%)] bg-clip-text text-transparent">{leadership.highlight}</span>
            </h2>
            <p className="mt-4 max-w-[640px] text-[16px] leading-[1.65] text-white/70 md:text-[17px]">{leadership.copy}</p>
          </Reveal>

          <ul className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-5">
            {leadership.people.map((p, i) => (
              <motion.li
                key={p.name}
                initial={reduce ? false : { opacity: 0, y: 28 }}
                animate={inView ? { opacity: 1, y: 0 } : undefined}
                transition={{ duration: 0.8, ease, delay: 0.15 + i * 0.08 }}
                className="group relative overflow-hidden rounded-[22px] bg-[#062617] ring-1 ring-white/12 transition-[box-shadow,transform] duration-500 hover:-translate-y-1 hover:shadow-[0_30px_60px_-30px_rgba(0,0,0,0.6)] hover:ring-lime/40"
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-white">
                  <Image
                    src={p.photo}
                    alt={`${p.name}, ${p.role}`}
                    fill
                    sizes="(min-width: 1024px) 230px, (min-width: 640px) 33vw, 50vw"
                    className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                  />
                  <div className="absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-[#062617] via-[#062617]/70 to-transparent" />
                </div>
                <div className="relative -mt-[72px] px-4 pb-4 md:px-5 md:pb-5">
                  <p className="text-[15.5px] leading-snug font-semibold tracking-[-0.01em] text-white">{p.name}</p>
                  <p className="mt-1 min-h-[2.6em] text-[12.5px] leading-snug text-white/65">{p.role}</p>
                  <span className="mt-3 block h-[2px] w-6 rounded-full bg-lime transition-[width] duration-500 group-hover:w-12" />
                </div>
              </motion.li>
            ))}
          </ul>

          <Reveal delay={0.2} className="mt-12 flex justify-center">
            <Button href={leadership.cta.href} variant="secondary" size="md" className="ring-0">
              {leadership.cta.label}
            </Button>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
