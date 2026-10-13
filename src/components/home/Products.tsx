"use client";

import Link from "next/link";
import { products } from "@/content/home";
import { SectionIntro } from "@/components/ui/Reveal";
import { FlipCard, FlipIcon } from "@/components/ui/FlipCard";
import { ArrowRight, Check } from "@/components/ui/icons";
import { ProductArt } from "./visuals/ProductArt";

const artTone = {
  versa: "bg-mist",
  odcc: "bg-surface",
  orchestration: "bg-[linear-gradient(180deg,#f6ffee,#ffffff)]",
} as const;

export function Products() {
  return (
    <section id="products" className="scroll-mt-20 py-28 md:py-40">
      <div className="container-page">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionIntro eyebrow={products.eyebrow} title={products.title} copy={products.copy} />
          <p className="flex shrink-0 items-center gap-2 text-[14px] text-sub">
            <FlipIcon className="size-4" /> {products.hint}
          </p>
        </div>

        <ProductRow>
          {products.items.map((p, i) => (
            <li key={p.key} className="w-[84vw] max-w-[380px] shrink-0 snap-start lg:w-auto lg:max-w-none">
              <FlipCard
                delay={i * 0.08}
                frontClassName="flex flex-col rounded-3xl bg-white ring-1 ring-line transition-shadow duration-300 hover:shadow-[0_24px_48px_-28px_rgba(6,38,23,0.28)]"
                backClassName="flex flex-col rounded-3xl bg-mist p-7 ring-1 ring-mint"
                front={({ flip, hover }) => (
                  <>
                    <div className={`relative h-[260px] shrink-0 ${artTone[p.key]}`}>
                      <ProductArt kind={p.key} active={hover} />
                    </div>
                    <div className="flex flex-1 flex-col p-7">
                      <p className="text-[14px] text-sub">{p.category}</p>
                      <h3 className="mt-1.5 text-h3 text-ink">{p.name}</h3>
                      <p className="mt-2 text-[16px] leading-relaxed text-copy">{p.tagline}</p>
                      <button
                        type="button"
                        onClick={flip}
                        aria-label={`See more about ${p.name}`}
                        className="mt-auto flex items-center gap-2 self-start text-[15px] font-medium text-link after:absolute after:inset-0 after:content-['']"
                      >
                        See details <FlipIcon className="size-4" />
                      </button>
                    </div>
                  </>
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

/** One horizontal row on desktop; a swipeable row on smaller screens. */
export function ProductRow({ children }: { children: React.ReactNode }) {
  return (
    <ul className="-mx-5 mt-14 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-4 md:-mx-10 md:px-10 lg:mx-0 lg:grid lg:grid-cols-3 lg:gap-6 lg:overflow-visible lg:px-0 lg:pb-0 [scrollbar-width:none]">
      {children}
    </ul>
  );
}

export function ProductBack({ product: p, onBack }: { product: (typeof products.items)[number]; onBack: () => void }) {
  return (
    <>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[14px] text-brand">{p.category}</p>
          <h3 className="mt-1.5 text-h3 text-ink">{p.name}</h3>
        </div>
        <button
          type="button"
          onClick={onBack}
          aria-label={`Back to ${p.name} overview`}
          className="grid size-9 shrink-0 place-items-center rounded-full bg-white text-ink ring-1 ring-mint transition-colors hover:ring-lime"
        >
          <FlipIcon className="size-4" />
        </button>
      </div>
      <p className="mt-4 text-[15.5px] leading-relaxed text-copy">{p.copy}</p>
      <ul className="mt-6 space-y-3 border-t border-mint pt-6">
        {p.features.map((f) => (
          <li key={f} className="flex gap-3 text-[15px] leading-snug text-ink">
            <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-mint text-brand">
              <Check className="size-2.5" />
            </span>
            {f}
          </li>
        ))}
      </ul>
      <Link
        href={p.cta.href}
        className="group mt-auto inline-flex h-12 items-center justify-center gap-2 rounded-full bg-brand text-[15px] font-medium text-white transition-colors hover:bg-brand-700"
      >
        {p.cta.label}
        <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
      </Link>
    </>
  );
}
