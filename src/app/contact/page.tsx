import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { EnquiryForm } from "@/components/contact/EnquiryForm";
import { contact } from "@/content/contact";

export const metadata: Metadata = {
  title: "Talk to Us",
  description: "Tell us about your payment requirements and the PropelGo team will get in touch.",
};

export default function ContactPage() {
  return (
    <>
      <Header />
      <main className="bg-[linear-gradient(180deg,#f7fbf4_0%,#ffffff_28%)] pt-[100px] pb-16 md:pt-[104px] md:pb-20">
        <div className="container-page grid items-start gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,520px)] lg:gap-14">
          <div>
            <p className="text-[13px] font-semibold tracking-[0.14em] text-brand uppercase">{contact.eyebrow}</p>
            <h1 className="mt-3 max-w-[16ch] text-[clamp(2rem,1.5rem+1.6vw,2.875rem)] leading-[1.07] font-semibold tracking-[-0.035em] text-balance text-ink">
              {contact.title}
            </h1>
            {contact.paragraphs.map((paragraph) => (
              <p key={paragraph} className="mt-3 max-w-[56ch] text-[15px] leading-[1.55] text-pretty text-copy">
                {paragraph}
              </p>
            ))}

            <h2 className="mt-6 text-[12.5px] font-semibold tracking-[0.14em] text-ink uppercase">{contact.next.eyebrow}</h2>
            <ol className="mt-3 space-y-3">
              {contact.next.steps.map((step, i) => (
                <li key={step.title} className="flex gap-3.5">
                  <span className="grid size-9 shrink-0 place-items-center rounded-full bg-mist text-[12px] font-semibold text-brand ring-1 ring-mint">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span>
                    <span className="block text-[15.5px] font-semibold tracking-[-0.01em] text-ink">{step.title}</span>
                    <span className="mt-0.5 block max-w-[60ch] text-[13.5px] leading-[1.5] text-copy">{step.copy}</span>
                  </span>
                </li>
              ))}
            </ol>

            <div className="mt-5 border-t border-line pt-5">
              <h2 className="text-[15.5px] font-semibold tracking-[-0.01em] text-ink">{contact.direct.title}</h2>
              <ul className="mt-3 flex flex-wrap gap-x-8 gap-y-2">
                <li>
                  <a href={`mailto:${contact.direct.email}`} className="inline-flex items-center gap-3 text-[15px] text-ink hover:text-brand">
                    <MailIcon />
                    {contact.direct.email}
                  </a>
                </li>
                <li>
                  <a href={contact.direct.phoneHref} className="inline-flex items-center gap-3 text-[15px] text-ink hover:text-brand">
                    <PhoneIcon />
                    {contact.direct.phone}
                  </a>
                </li>
              </ul>
              <p className="mt-2 text-[13px] text-sub">{contact.direct.note}</p>
            </div>
          </div>

          <EnquiryForm />
        </div>
      </main>
      <Footer ribbon="twist" />
    </>
  );
}

function MailIcon() {
  return (
    <svg viewBox="0 0 20 20" className="size-5 text-brand" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <rect x="2.5" y="4.5" width="15" height="11" rx="2" />
      <path d="m3.5 6 6.5 5 6.5-5" strokeLinejoin="round" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 20 20" className="size-5 text-brand" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path d="M6.2 3.5h2l1.2 3-1.4 1a9 9 0 0 0 4.5 4.5l1-1.4 3 1.2v2A1.5 1.5 0 0 1 15 15 11.5 11.5 0 0 1 5 5a1.5 1.5 0 0 1 1.2-1.5z" strokeLinejoin="round" />
    </svg>
  );
}
