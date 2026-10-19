import { security } from "@/content/home";
import { Eyebrow, Reveal } from "@/components/ui/Reveal";
import { ShieldIcon } from "@/components/ui/icons";

/** Direction B: placeholder shield badges. */
export function SecurityB() {
  return (
    <section aria-labelledby="security-title" className="py-20 md:py-24">
      <div className="container-page">
        <div className="grid items-center gap-10 border-y border-line py-12 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-16">
          <Reveal className="max-w-[460px]">
            <Eyebrow>{security.eyebrow}</Eyebrow>
            <h2 id="security-title" className="mt-3 text-[clamp(1.625rem,1.3rem+1vw,2.125rem)] leading-tight font-semibold tracking-[-0.022em] text-ink">
              {security.title}
            </h2>
            <p className="mt-3 text-[16px] leading-relaxed text-copy">{security.copy}</p>
          </Reveal>
          <Reveal delay={0.08}>
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {security.badges.map((b) => (
                <li key={b.name} className="flex flex-col items-center gap-3 rounded-2xl px-4 py-5 text-center ring-1 ring-line sm:w-[150px]">
                  <span className="grid size-12 place-items-center rounded-full bg-mist text-brand ring-1 ring-mint">
                    <ShieldIcon className="size-5" />
                  </span>
                  <span>
                    <span className="block text-[15px] font-semibold text-ink">{b.name}</span>
                    <span className="mt-0.5 block text-[12.5px] text-sub">{b.line}</span>
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-right text-[12px] text-sub">{security.note}</p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
