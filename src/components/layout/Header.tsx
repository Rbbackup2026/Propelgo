"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { nav } from "@/content/home";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import { ArrowUpRight, Chevron } from "@/components/ui/icons";
import { ProductGlyph } from "@/components/ui/ProductGlyph";

type MenuKey = "products" | "solutions" | "resources" | "company";

const menus: { key: MenuKey; label: string }[] = [
  { key: "products", label: "Products" },
  { key: "solutions", label: "Solutions" },
  { key: "resources", label: "Resources" },
  { key: "company", label: "Company" },
];

const glyphs = ["versa", "odcc", "orchestration"] as const;
const ease = [0.16, 1, 0.3, 1] as const;

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState<MenuKey | null>(null);
  const [mobile, setMobile] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = mobile ? "hidden" : "";
  }, [mobile]);

  const enter = (key: MenuKey) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(key);
  };
  const leave = () => {
    closeTimer.current = setTimeout(() => setOpen(null), 140);
  };

  const solid = scrolled || open !== null;

  return (
    <header className="fixed inset-x-0 top-0 z-50" onMouseLeave={leave}>
      <div
        className={`transition-[background-color,border-color,backdrop-filter] duration-500 ${
          solid ? "border-b border-white/[0.07] bg-forest-950/80 backdrop-blur-xl" : "border-b border-transparent"
        }`}
      >
        <div className="mx-auto flex h-[72px] max-w-[1320px] items-center justify-between px-5 md:px-8">
          <Link href="/" aria-label="PropelGo home" className="shrink-0">
            <Logo tone="dark" className="h-8 w-auto md:h-9" />
          </Link>

          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {menus.map((m) => (
                <li key={m.key} onMouseEnter={() => enter(m.key)}>
                  <button
                    type="button"
                    aria-expanded={open === m.key}
                    onClick={() => setOpen(open === m.key ? null : m.key)}
                    className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-[14px] transition-colors ${
                      open === m.key ? "bg-white/[0.07] text-white" : "text-white/75 hover:text-white"
                    }`}
                  >
                    {m.label}
                    <Chevron className={`size-2.5 transition-transform duration-300 ${open === m.key ? "rotate-180" : ""}`} />
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2 md:gap-5">
            <Link href="/resources/customer-stories" className="hidden text-[14px] text-white/65 transition-colors hover:text-white xl:block">
              Customer stories
            </Link>
            <div className="hidden sm:block">
              <Button href="/contact" size="sm">
                Talk to Us
              </Button>
            </div>
            <button
              type="button"
              aria-label={mobile ? "Close menu" : "Open menu"}
              aria-expanded={mobile}
              onClick={() => setMobile((v) => !v)}
              className="relative grid size-10 place-items-center rounded-full ring-1 ring-white/15 lg:hidden"
            >
              <span className={`absolute h-px w-4 bg-white transition-transform duration-300 ${mobile ? "rotate-45" : "-translate-y-[3px]"}`} />
              <span className={`absolute h-px w-4 bg-white transition-transform duration-300 ${mobile ? "-rotate-45" : "translate-y-[3px]"}`} />
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            key="panel"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6, transition: { duration: 0.18 } }}
            transition={{ duration: 0.4, ease }}
            onMouseEnter={() => open && enter(open)}
            className="absolute inset-x-0 top-[72px] hidden lg:block"
          >
            <div className="mx-auto max-w-[1320px] px-8">
              <div className="overflow-hidden rounded-b-3xl border border-t-0 border-white/[0.08] bg-forest-950/95 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.6)] backdrop-blur-xl">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={open}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.25, ease }}
                  >
                    <MenuPanel kind={open} />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>{mobile && <MobileMenu onClose={() => setMobile(false)} />}</AnimatePresence>
    </header>
  );
}

function MenuPanel({ kind }: { kind: MenuKey }) {
  if (kind === "products") {
    return (
      <div className="grid grid-cols-[1.35fr_1fr]">
        <ul className="grid gap-1 p-4">
          {nav.products.map((p, i) => (
            <li key={p.name}>
              <Link href={p.href} className="group flex items-start gap-4 rounded-2xl p-4 transition-colors hover:bg-white/[0.05]">
                <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-white/[0.04] text-white ring-1 ring-white/10">
                  <ProductGlyph kind={glyphs[i]} className="size-8" />
                </span>
                <span className="flex-1">
                  <span className="label text-white/40">
                    0{i + 1} · {p.tag}
                  </span>
                  <span className="mt-1 flex items-center gap-2 text-[17px] font-medium text-white">
                    {p.name}
                    <ArrowUpRight className="size-3.5 text-signal opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-100" />
                  </span>
                  <span className="mt-0.5 block text-sm text-white/55">{p.line}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <div className="grid-lines relative m-4 ml-0 overflow-hidden rounded-2xl bg-forest-800 p-7 ring-1 ring-white/[0.06]">
          <p className="label text-signal">How it fits together</p>
          <p className="mt-3 max-w-[22ch] text-[22px] leading-tight font-medium tracking-[-0.02em] text-white">
            Credit, cards and vendor payments on one orchestration layer.
          </p>
          <svg viewBox="0 0 260 80" className="mt-6 w-full" fill="none" aria-hidden="true">
            <path d="M0 20h70v20h50M0 60h70V40" stroke="rgba(255,255,255,0.25)" />
            <path d="M150 40h40V15h70M190 40h70M190 40v25h70" stroke="rgba(7,242,88,0.55)" />
            <rect x="120" y="28" width="30" height="24" rx="5" fill="#07F258" />
            <path d="m130 45 10-10m-7 0h7v7" stroke="#062617" strokeWidth="1.6" />
            <circle r="2.5" fill="#07F258">
              <animateMotion dur="2.4s" repeatCount="indefinite" path="M150 40h40V15h70" />
            </circle>
          </svg>
          <Link href="/#products" className="mt-6 inline-flex items-center gap-1.5 text-sm text-white/80 hover:text-white">
            See the platform <ArrowUpRight />
          </Link>
        </div>
      </div>
    );
  }

  if (kind === "solutions") {
    return (
      <div className="grid grid-cols-[1fr_1fr_1.1fr] gap-2 p-8">
        <div>
          <p className="label text-white/40">By use case</p>
          <ul className="mt-4 space-y-1">
            {nav.solutions.useCases.map((s) => (
              <li key={s.name}>
                <MenuLink href={s.href}>{s.name}</MenuLink>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="label text-white/40">By industry</p>
          <ul className="mt-4 space-y-1">
            {nav.solutions.industries.map((s) => (
              <li key={s.name}>
                <MenuLink href={s.href}>{s.name}</MenuLink>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl bg-white/[0.04] p-6 ring-1 ring-white/[0.06]">
          <p className="label text-signal">Not sure where to start?</p>
          <p className="mt-3 text-[15px] leading-relaxed text-white/70">
            Tell us how your business pays today. We&apos;ll map it to the right PropelGo capability.
          </p>
          <Link href="/contact" className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-white hover:text-signal">
            Talk to Us <ArrowUpRight />
          </Link>
        </div>
      </div>
    );
  }

  const items = kind === "resources" ? nav.resources : nav.company;
  return (
    <ul className="grid grid-cols-3 gap-2 p-4">
      {items.map((r) => (
        <li key={r.name}>
          <Link href={r.href} className="group block rounded-2xl p-5 transition-colors hover:bg-white/[0.05]">
            <span className="flex items-center gap-2 text-[17px] font-medium text-white">
              {r.name}
              <ArrowUpRight className="size-3.5 text-signal opacity-0 transition-all group-hover:opacity-100" />
            </span>
            <span className="mt-1 block text-sm text-white/55">{r.line}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

function MenuLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="group flex items-center gap-2 rounded-lg py-1.5 text-[15px] text-white/75 transition-colors hover:text-white">
      <span className="h-px w-0 bg-signal transition-all duration-300 group-hover:w-3" />
      {children}
    </Link>
  );
}

function MobileMenu({ onClose }: { onClose: () => void }) {
  const groups = [
    { title: "Products", links: nav.products.map((p) => ({ name: p.name, href: p.href })) },
    { title: "Solutions", links: [...nav.solutions.useCases, ...nav.solutions.industries] },
    { title: "Resources", links: nav.resources },
    { title: "Company", links: nav.company },
  ];
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-x-0 top-[72px] bottom-0 overflow-y-auto bg-forest-950 px-5 pb-10 lg:hidden"
    >
      {groups.map((g, gi) => (
        <motion.div
          key={g.title}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 * gi, duration: 0.5, ease }}
          className="border-b border-white/10 py-6"
        >
          <p className="label text-white/40">{g.title}</p>
          <ul className="mt-3 space-y-2">
            {g.links.map((l) => (
              <li key={l.name}>
                <Link href={l.href} onClick={onClose} className="text-xl text-white">
                  {l.name}
                </Link>
              </li>
            ))}
          </ul>
        </motion.div>
      ))}
      <div className="pt-8">
        <Button href="/contact" size="lg" magnetic={false} className="w-full justify-between">
          Talk to Us
        </Button>
      </div>
    </motion.div>
  );
}
