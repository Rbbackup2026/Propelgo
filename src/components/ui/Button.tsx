import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight } from "./icons";

type Variant = "primary" | "secondary" | "text";

const styles: Record<Variant, string> = {
  primary: "bg-brand text-white hover:bg-brand-700 shadow-[0_1px_2px_rgba(1,118,73,0.25)]",
  secondary: "bg-white text-ink ring-1 ring-inset ring-line hover:ring-ghost hover:bg-surface",
  text: "text-link hover:text-[#1b65ae]",
};

const sizes = {
  sm: "h-10 px-4 text-[14px]",
  md: "h-12 px-5 text-[15px]",
  lg: "h-[52px] px-6 text-[16px]",
};

type Props = {
  href: string;
  children: ReactNode;
  variant?: Variant;
  size?: keyof typeof sizes;
  arrow?: boolean;
  className?: string;
};

export function Button({ href, children, variant = "primary", size = "md", arrow = true, className = "" }: Props) {
  const box = variant === "text" ? "text-[15px]" : `rounded-full ${sizes[size]}`;
  return (
    <Link
      href={href}
      className={`group inline-flex items-center justify-center gap-2 font-medium tracking-[-0.006em] transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand ${box} ${styles[variant]} ${className}`}
    >
      {children}
      {arrow && <ArrowRight className="size-3.5 transition-transform duration-300 ease-out-expo group-hover:translate-x-0.5" />}
    </Link>
  );
}
