import type { ReactNode } from "react";
import { products } from "@/content/home";
import { TextLink } from "@/components/ui/Button";
import { Eyebrow, MaskLines, Reveal } from "@/components/ui/Reveal";
import { ArrowUpRight } from "@/components/ui/icons";
import { VersaVisual } from "./visuals/VersaVisual";
import { OdccVisual } from "./visuals/OdccVisual";
import { OrchestrationVisual } from "./visuals/OrchestrationVisual";

type Product = (typeof products)["versa"];

export function Products() {
  const { versa, odcc, orchestration } = products;
  return (
    <section id="products" className="scroll-mt-20 bg-white" aria-labelledby="products-title">
      <div className="mx-auto max-w-[1320px] px-5 py-24 md:px-8 md:py-32">
        <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-end">
          <div>
            <Eyebrow>{products.eyebrow}</Eyebrow>
            <h2 id="products-title" className="heading mt-6 text-[36px] text-ink md:text-[52px] lg:text-[56px]">
              <MaskLines lines={["One platform.", "Multiple ways to power", "business payments."]} />
            </h2>
          </div>
          <Reveal delay={0.15}>
            <p className="max-w-[44ch] text-[16px] leading-relaxed text-ink-soft lg:pb-2">{products.copy}</p>
          </Reveal>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-4 md:mt-16 lg:grid-cols-2 lg:gap-5 [&>*]:min-w-0">
          <Reveal>
            <ProductCard product={versa} visual={<VersaVisual />} />
          </Reveal>
          <Reveal delay={0.1}>
            <ProductCard product={odcc} visual={<OdccVisual />} />
          </Reveal>
        </div>

        <Reveal className="mt-4 lg:mt-5">
          <article className="group grain relative overflow-hidden rounded-[28px] bg-forest text-white">
            <div className="grid-lines absolute inset-0 opacity-70" aria-hidden="true" />
            <div className="relative grid gap-10 p-5 sm:p-7 md:p-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14 lg:p-12 [&>*]:min-w-0">
              <div className="flex flex-col">
                <div className="flex items-center justify-between gap-3">
                  <FlowChip flow={orchestration.flow} tone="dark" />
                  <span className="label hidden rounded bg-white/[0.06] px-2 py-1 !text-[9.5px] text-white/45 sm:inline">{orchestration.index}</span>
                </div>
                <h3 className="heading mt-8 text-[34px] md:text-[42px]">{orchestration.name}</h3>
                <p className="mt-3 text-[19px] leading-snug font-medium text-signal">{orchestration.tagline}</p>
                <p className="mt-4 max-w-[46ch] text-[15.5px] leading-relaxed text-white/65">{orchestration.copy}</p>
                <p className="mt-6 border-l-2 border-signal pl-4 text-[15px] leading-relaxed text-white/85">{orchestration.note}</p>
                <div className="mt-auto flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-6 max-lg:mt-10">
                  <Chips chips={orchestration.chips} tone="dark" />
                  <TextLink href={orchestration.cta.href} tone="dark">
                    {orchestration.cta.label}
                  </TextLink>
                </div>
              </div>
              <div className="rounded-2xl border border-white/[0.08] bg-forest-900/60 p-3 sm:p-4 md:p-6">
                <OrchestrationVisual />
              </div>
            </div>
          </article>
        </Reveal>
      </div>
    </section>
  );
}

function ProductCard({ product, visual }: { product: Product; visual: ReactNode }) {
  return (
    <article className="group flex h-full min-w-0 flex-col rounded-[28px] border border-paper-300/80 bg-paper p-5 transition-[border-color,box-shadow] duration-500 hover:border-leaf/30 hover:shadow-[0_30px_80px_-40px_rgba(6,38,23,0.35)] sm:p-7 md:p-10">
      <div className="flex items-center justify-between">
        <FlowChip flow={product.flow} />
        <span className="label hidden rounded bg-paper-200 px-2 py-1 !text-[9.5px] text-muted sm:inline">{product.index}</span>
      </div>
      <h3 className="heading mt-8 text-[34px] text-ink md:text-[42px]">{product.name}</h3>
      <p className="mt-2 text-[18px] leading-snug font-medium text-leaf">{product.tagline}</p>
      <p className="mt-3 max-w-[48ch] text-[15.5px] leading-relaxed text-ink-soft">{product.copy}</p>
      <div className="mt-8 flex-1">{visual}</div>
      <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-paper-300 pt-6">
        <Chips chips={product.chips} />
        <TextLink href={product.cta.href}>{product.cta.label}</TextLink>
      </div>
    </article>
  );
}

function FlowChip({ flow, tone = "light" }: { flow: string[]; tone?: "light" | "dark" }) {
  return (
    <span
      className={`label inline-flex w-fit items-center gap-2 rounded-full px-3 py-1.5 !text-[10px] whitespace-nowrap ${
        tone === "dark" ? "bg-white/[0.06] text-white/75 ring-1 ring-white/10" : "bg-white text-ink-soft ring-1 ring-paper-300"
      }`}
    >
      {flow[0]}
      <ArrowUpRight className={`size-3 ${tone === "dark" ? "text-signal" : "text-leaf"}`} />
      {flow[1]}
    </span>
  );
}

function Chips({ chips, tone = "light" }: { chips: string[]; tone?: "light" | "dark" }) {
  return (
    <ul className="flex flex-wrap gap-1.5">
      {chips.map((c) => (
        <li
          key={c}
          className={`label rounded px-2 py-1 !text-[9.5px] ${tone === "dark" ? "bg-white/[0.06] text-white/55" : "bg-paper-200 text-muted"}`}
        >
          {c}
        </li>
      ))}
    </ul>
  );
}
