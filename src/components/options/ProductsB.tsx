"use client";

import { products } from "@/content/home";
import { SectionIntro } from "@/components/ui/Reveal";
import { FlipCard, FlipIcon } from "@/components/ui/FlipCard";
import { ProductGlyph } from "@/components/ui/ProductGlyph";
import { ProductBack, ProductRow } from "@/components/home/Products";

const tone = {
  versa: { face: "bg-mist ring-mint", glyph: "bg-white text-forest ring-mint" },
  odcc: { face: "bg-white ring-line", glyph: "bg-mist text-forest ring-mint" },
  orchestration: { face: "bg-mint/60 ring-mint", glyph: "bg-white text-forest ring-mint" },
} as const;

/** Direction B: typographic flip tiles, product name as the hero of each card. */
export function ProductsB() {
  return (
    <section id="products" className="scroll-mt-20 py-28 md:py-36">
      <div className="container-page">
        <SectionIntro eyebrow={products.eyebrow} title={products.title} copy={products.copy} align="center" />
        <p className="mt-6 flex items-center justify-center gap-2 text-[14px] text-sub">
          <FlipIcon className="size-4" /> {products.hint}
        </p>
        <ProductRow>
          {products.items.map((p, i) => (
            <li key={p.key} className="w-[84vw] max-w-[380px] shrink-0 snap-start lg:w-auto lg:max-w-none">
              <FlipCard
                className="h-[460px]"
                delay={i * 0.08}
                frontClassName={`rounded-3xl ring-1 ${tone[p.key].face}`}
                backClassName="flex flex-col rounded-3xl bg-white p-7 ring-1 ring-line"
                front={({ flip, hover }) => (
                  <button type="button" onClick={flip} aria-label={`See more about ${p.name}`} className="flex size-full flex-col p-8 text-left">
                    <span className="flex w-full items-center justify-between">
                      <span className="tabular text-[14px] text-sub">0{i + 1}</span>
                      <span className={`grid size-9 place-items-center rounded-full ring-1 transition-transform duration-500 ${tone[p.key].glyph} ${hover ? "rotate-180" : ""}`}>
                        <FlipIcon className="size-4" />
                      </span>
                    </span>
                    <span className={`mt-10 grid size-20 place-items-center rounded-2xl ring-1 transition-transform duration-500 ease-out-expo ${tone[p.key].glyph} ${hover ? "-translate-y-1" : ""}`}>
                      <ProductGlyph kind={p.key} className="size-12" />
                    </span>
                    <span className="mt-auto block text-[14px] text-brand">{p.category}</span>
                    <span className="mt-2 block text-[clamp(1.75rem,1.4rem+1vw,2.25rem)] leading-tight font-semibold tracking-[-0.03em] text-ink">{p.name}</span>
                    <span className="mt-3 block text-[16px] leading-relaxed text-copy">{p.tagline}</span>
                  </button>
                )}
                back={({ flip }) => <ProductBack product={p} onBack={flip} />}
              />
            </li>
          ))}
        </ProductRow>
      </div>
    </section>
  );
}
