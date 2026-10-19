import { finalCta } from "@/content/home";
import { Button } from "@/components/ui/Button";
import { Eyebrow, HighlightTitle, Reveal } from "@/components/ui/Reveal";

/** Step colours for the spectrum tone: indigo, teal, amber. */
const STEP_ACCENTS = [
  { solid: "#5b57d9", soft: "#eeedfc", ring: "#d9d7f7" },
  { solid: "#0e8ba3", soft: "#e4f5f8", ring: "#c4e7ee" },
  { solid: "#d9822b", soft: "#fdf1e4", ring: "#f5dcc0" },
];

/** `tone="brand"` keeps the original all-green treatment for Direction B. */
export function FinalCta({ tone = "brand" }: { tone?: "spectrum" | "brand" }) {
  const spectrum = tone === "spectrum";
  return (
    <section className="pb-24 md:pb-32">
      <div className="container-page">
        <Reveal className="grid gap-14 rounded-[32px] bg-mist px-7 py-14 ring-1 ring-mint md:px-14 md:py-20 lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)] lg:gap-20">
          <div>
            <Eyebrow>{finalCta.eyebrow}</Eyebrow>
            <h2 className="mt-4 max-w-[16ch] text-h2 text-balance text-ink">
              <HighlightTitle text={finalCta.title} phrase={spectrum ? finalCta.highlight : undefined} />
            </h2>
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
            <span
              className={`absolute top-5 bottom-5 left-[19px] w-px ${spectrum ? "bg-gradient-to-b from-[#d9d7f7] via-[#c4e7ee] to-[#f5dcc0]" : "bg-mint"}`}
              aria-hidden="true"
            />
            {finalCta.steps.map((s, i) => {
              const accent = spectrum ? STEP_ACCENTS[i % STEP_ACCENTS.length] : undefined;
              return (
                <li key={s.title} className="relative flex gap-5 py-4">
                  <span
                    className={`relative z-10 grid size-10 shrink-0 place-items-center rounded-full text-[14px] font-semibold ring-1 ${accent ? "" : "bg-white text-brand ring-mint"}`}
                    style={accent ? { backgroundColor: accent.soft, color: accent.solid, ["--tw-ring-color" as string]: accent.ring } : undefined}
                  >
                    {i + 1}
                  </span>
                  <span className="pt-1.5">
                    <span className="block text-[16.5px] font-semibold tracking-[-0.01em] text-ink">{s.title}</span>
                    <span className="mt-1 block text-[15px] leading-relaxed text-copy">{s.copy}</span>
                  </span>
                </li>
              );
            })}
          </ol>
        </Reveal>
      </div>
    </section>
  );
}
