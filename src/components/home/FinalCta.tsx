import { finalCta } from "@/content/home";
import { Button } from "@/components/ui/Button";
import { Eyebrow, Reveal } from "@/components/ui/Reveal";

export function FinalCta() {
  return (
    <section className="pb-24 md:pb-32">
      <div className="container-page">
        <Reveal className="grid gap-14 rounded-[32px] bg-mist px-7 py-14 ring-1 ring-mint md:px-14 md:py-20 lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)] lg:gap-20">
          <div>
            <Eyebrow>{finalCta.eyebrow}</Eyebrow>
            <h2 className="mt-4 max-w-[16ch] text-h2 text-balance text-ink">{finalCta.title}</h2>
            <p className="mt-5 max-w-[46ch] text-lead text-pretty text-copy">{finalCta.copy}</p>
            <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4">
              <Button href={finalCta.cta.href} size="lg">
                {finalCta.cta.label}
              </Button>
              <a href={`mailto:${finalCta.email}`} className="text-[15px] font-medium text-ink underline decoration-ghost underline-offset-4 hover:decoration-brand">
                {finalCta.email}
              </a>
            </div>
          </div>
          <ol className="relative self-center">
            <span className="absolute top-5 bottom-5 left-[19px] w-px bg-mint" aria-hidden="true" />
            {finalCta.steps.map((s, i) => (
              <li key={s.title} className="relative flex gap-5 py-4">
                <span className="relative z-10 grid size-10 shrink-0 place-items-center rounded-full bg-white text-[14px] font-semibold text-brand ring-1 ring-mint">
                  {i + 1}
                </span>
                <span className="pt-1.5">
                  <span className="block text-[16.5px] font-semibold tracking-[-0.01em] text-ink">{s.title}</span>
                  <span className="mt-1 block text-[15px] leading-relaxed text-copy">{s.copy}</span>
                </span>
              </li>
            ))}
          </ol>
        </Reveal>
      </div>
    </section>
  );
}
