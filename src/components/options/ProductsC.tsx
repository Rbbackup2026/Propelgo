"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { products } from "@/content/home";
import { SectionIntro } from "@/components/ui/Reveal";
import { ArrowRight, Check } from "@/components/ui/icons";
import { ProductGlyph } from "@/components/ui/ProductGlyph";
import { ProductArt } from "@/components/home/visuals/ProductArt";

/** Direction C: one row of panels; the chosen product opens wide while the others fold to a spine. */
export function ProductsC() {
  const [active, setActive] = useState(0);
  return (
    <section id="products" className="scroll-mt-20 bg-surface py-28 md:py-36">
      <div className="container-page">
        <SectionIntro eyebrow={products.eyebrow} title={products.title} copy={products.copy} />
        <div className="mt-14 flex flex-col gap-3 lg:h-[500px] lg:flex-row">
          {products.items.map((p, i) => {
            const on = i === active;
            return (
              <article
                key={p.key}
                onMouseEnter={() => setActive(i)}
                className={`relative overflow-hidden rounded-3xl ring-1 transition-[flex-grow,background-color] duration-700 ease-out-expo ${
                  on ? "bg-white ring-line lg:flex-[3.6]" : "bg-mist ring-mint lg:flex-1"
                }`}
              >
                <button
                  type="button"
                  aria-expanded={on}
                  onClick={() => setActive(i)}
                  className={`flex w-full items-center gap-4 p-6 text-left lg:h-full lg:flex-col lg:items-start ${on ? "lg:hidden" : ""}`}
                >
                  <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-white text-forest ring-1 ring-mint">
                    <ProductGlyph kind={p.key} className="size-7" />
                  </span>
                  <span className="flex-1 lg:mt-auto">
                    <span className="tabular block text-[13px] text-sub">0{i + 1}</span>
                    <span className="mt-1 block text-[20px] font-semibold tracking-[-0.02em] text-ink">{p.name}</span>
                    <span className="mt-1 block text-[14px] text-copy">{p.category}</span>
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {on && (
                    <motion.div
                      key="open"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1, transition: { duration: 0.4, delay: 0.2 } }}
                      exit={{ opacity: 0, transition: { duration: 0.15 } }}
                      className="grid gap-8 p-6 pt-0 md:grid-cols-[1fr_1fr] md:p-8 lg:absolute lg:inset-0 lg:p-10"
                    >
                      <div className="flex flex-col">
                        <span className="tabular hidden text-[13px] text-sub lg:block">0{i + 1} · {p.category}</span>
                        <h3 className="mt-2 hidden text-[clamp(1.75rem,1.4rem+1vw,2.25rem)] leading-tight font-semibold tracking-[-0.03em] text-ink lg:block">{p.name}</h3>
                        <p className="text-[17px] text-ink lg:mt-2">{p.tagline}</p>
                        <p className="mt-3 text-[15.5px] leading-relaxed text-copy">{p.copy}</p>
                        <ul className="mt-5 space-y-2.5">
                          {p.features.slice(0, 3).map((f) => (
                            <li key={f} className="flex gap-2.5 text-[14.5px] text-ink">
                              <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-mint text-brand">
                                <Check className="size-2.5" />
                              </span>
                              {f}
                            </li>
                          ))}
                        </ul>
                        <Link href={p.cta.href} className="group mt-6 inline-flex items-center gap-1.5 self-start text-[15px] font-medium text-link lg:mt-auto">
                          {p.cta.label}
                          <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                        </Link>
                      </div>
                      <div className="hidden h-full min-h-[260px] overflow-hidden rounded-2xl bg-mist md:block">
                        <div className="size-full scale-[0.82]">
                          <ProductArt kind={p.key} active />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
