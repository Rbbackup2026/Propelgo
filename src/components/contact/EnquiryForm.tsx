"use client";

import Link from "next/link";
import { useState, type FormEvent, type ReactNode } from "react";
import { contact } from "@/content/contact";

const input =
  "mt-2 w-full rounded-xl bg-white px-3.5 text-[15px] text-ink ring-1 ring-line outline-none transition-[box-shadow] placeholder:text-sub focus:ring-2 focus:ring-brand";

type Errors = Partial<Record<"name" | "email" | "company" | "interest" | "message", string>>;

export function EnquiryForm() {
  const [sent, setSent] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const { form } = contact;

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const company = String(data.get("company") ?? "").trim();
    const interest = String(data.get("interest") ?? "");
    const phone = String(data.get("phone") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();
    const next: Errors = {};
    if (!name) next.name = "Enter your full name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = "Enter a valid work email.";
    if (!company) next.company = "Enter your company name.";
    if (!interest) next.interest = "Select what you're interested in.";
    if (message.length < 10) next.message = "Tell us a little more about your requirement.";
    setErrors(next);
    if (Object.keys(next).length > 0) return;
    const body = [`Name: ${name}`, `Email: ${email}`, `Company: ${company}`, phone && `Phone: ${phone}`, `Interested in: ${interest}`, "", message].filter(Boolean).join("\n");
    window.location.href = `mailto:${contact.direct.email}?subject=${encodeURIComponent("PropelGo enquiry")}&body=${encodeURIComponent(body)}`;
    setSent(true);
  }

  if (sent) {
    return (
      <div className="flex min-h-[420px] flex-col items-start justify-center rounded-[28px] bg-white p-8 ring-1 ring-line shadow-[0_30px_60px_-40px_rgba(31,31,31,0.3)] md:p-10">
        <span className="grid size-12 place-items-center rounded-full bg-mist text-brand ring-1 ring-mint">
          <svg viewBox="0 0 16 16" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
            <path d="M3.5 8.5 6.5 11.5 12.5 4.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <h2 className="mt-5 text-[28px] leading-tight font-semibold tracking-[-0.03em] text-ink">{form.success.title}</h2>
        <p className="mt-3 max-w-[36ch] text-[16px] leading-relaxed text-copy">{form.success.copy}</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="rounded-[28px] bg-white p-6 ring-1 ring-line shadow-[0_30px_60px_-40px_rgba(31,31,31,0.3)] md:p-8"
    >
      <h2 className="text-[28px] leading-tight font-semibold tracking-[-0.03em] text-ink">{form.title}</h2>
      <p className="mt-2 text-[15px] leading-relaxed text-copy">{form.copy}</p>

      <div className="mt-7 space-y-5">
        <Field label="Full name" name="name" error={errors.name} required>
          <input id="name" name="name" autoComplete="name" placeholder="Enter your name" aria-invalid={!!errors.name} className={`${input} h-12`} />
        </Field>
        <Field label="Work email" name="email" error={errors.email} required>
          <input id="email" name="email" type="email" autoComplete="email" placeholder="Enter your work email" aria-invalid={!!errors.email} className={`${input} h-12`} />
        </Field>
        <Field label="Company name" name="company" error={errors.company} required>
          <input id="company" name="company" autoComplete="organization" placeholder="Enter your company name" aria-invalid={!!errors.company} className={`${input} h-12`} />
        </Field>
        <Field label="Phone number" name="phone" hint="Optional">
          <input id="phone" name="phone" type="tel" autoComplete="tel" placeholder="Enter your phone number" className={`${input} h-12`} />
        </Field>
        <Field label="What are you interested in?" name="interest" error={errors.interest} required>
          <select id="interest" name="interest" defaultValue="" aria-invalid={!!errors.interest} className={`${input} h-12 appearance-none bg-[length:16px] bg-[position:right_14px_center] bg-no-repeat pr-10`} style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='none' stroke='%238c8c8c' stroke-width='1.6'%3E%3Cpath d='M4 6l4 4 4-4' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\")" }}>
            <option value="" disabled>
              Select an option
            </option>
            {form.interests.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Tell us a little about your requirement" name="message" error={errors.message} required>
          <textarea id="message" name="message" rows={5} placeholder="Type your message here..." aria-invalid={!!errors.message} className={`${input} resize-y py-3`} />
        </Field>
      </div>

      <button
        type="submit"
        className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-xl bg-brand text-[15px] font-medium text-white transition-[filter,transform] duration-300 hover:brightness-110 active:scale-[0.99]"
      >
        {form.submit}
      </button>
      <p className="mt-3 text-[12.5px] leading-relaxed text-sub">
        {form.privacy}{" "}
        <Link href="/privacy" className="font-medium text-ink underline decoration-ghost underline-offset-2 hover:decoration-brand">
          Privacy Policy
        </Link>
        .
      </p>
    </form>
  );
}

function Field({
  label,
  name,
  error,
  required,
  hint,
  children,
}: {
  label: string;
  name: string;
  error?: string;
  required?: boolean;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={name} className="text-[14px] font-medium text-ink">
        {label}
        {required ? <span className="text-brand"> *</span> : hint ? <span className="font-normal text-sub"> ({hint})</span> : null}
      </label>
      {children}
      {error && <p className="mt-1.5 text-[13px] text-[#9a5410]">{error}</p>}
    </div>
  );
}
