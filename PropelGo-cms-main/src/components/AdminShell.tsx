
"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Building2,
  ChartNoAxesCombined,
  FileText,
  Handshake,
  Medal,
  Users,
  MessageSquareQuote,
} from "lucide-react";

import BrandLogo from "@/components/BrandLogo";
import LogoutButton from "@/app/admin/dashboard/logout-button";


const modules = [
  {
    title: "Banks",
    href: "/admin/banks",
    icon: Building2,
  },
  {
    title: "Partners",
    href: "/admin/partners",
    icon: Handshake,
  },
  {
    title: "Accreditations",
    href: "/admin/accreditations",
    icon: Medal,
  },
  {
    title: "Statistics",
    href: "/admin/statistics",
    icon: ChartNoAxesCombined,
  },
  {
    title: "Articles",
    href: "/admin/articles",
    icon: FileText,
  },
  {
    title: "Team",
    href: "/admin/team",
    icon: Users,
  },
  {
  title: "Testimonials",
  href: "/admin/testimonials",
  icon: MessageSquareQuote,
},
];

function getPageTitle(pathname: string) {
  if (pathname.startsWith("/admin/banks")) return "Banks";
  if (pathname.startsWith("/admin/partners")) return "Partners";
  if (pathname.startsWith("/admin/accreditations")) return "Accreditations";
  if (pathname.startsWith("/admin/statistics")) return "Statistics";
  if (pathname.startsWith("/admin/articles")) return "Articles";
  if (pathname.startsWith("/admin/team")) return "Team";
  if (pathname.startsWith("/admin/testimonials")) return "Testimonials";
  if (pathname.startsWith("/admin/dashboard")) return "Dashboard";

  return "Content management";
}

export default function AdminShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Keep the login page outside the admin dashboard layout.
  if (pathname === "/admin" || pathname === "/admin/login") {
    return <>{children}</>;
  }

  const pageTitle = getPageTitle(pathname);

  return (
    <div className="min-h-screen bg-slate-50 lg:grid lg:grid-cols-[270px_minmax(0,1fr)]">

      {/* LEFT SIDEBAR */}
      <aside className="z-20 border-b border-slate-200 bg-white lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto lg:border-b-0 lg:border-r">

        {/* LOGO */}
        <div className="border-b border-slate-100 px-6 py-6">
          <BrandLogo width={190} />

          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-teal-700">
            Content studio
          </p>
        </div>

        {/* NAVIGATION */}
        <nav
          className="space-y-1 p-4"
          aria-label="Website content modules"
        >
          <p className="px-3 pb-2 pt-1 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Website modules
          </p>

          {modules.map((module) => {
            const Icon = module.icon;
            const isActive =
              pathname === module.href ||
              pathname.startsWith(`${module.href}/`);

            return (
              <Link
                key={module.href}
                href={module.href}
                aria-current={isActive ? "page" : undefined}
                className={`group flex items-center gap-3 rounded-xl px-3 py-3 transition ${
                  isActive
                    ? "bg-teal-50 text-teal-800"
                    : "text-slate-700 hover:bg-teal-50"
                }`}
              >
                <span
                  className={`rounded-lg p-2 transition ${
                    isActive
                      ? "bg-teal-100 text-teal-800"
                      : "bg-slate-100 text-slate-600 group-hover:bg-teal-100 group-hover:text-teal-800"
                  }`}
                >
                  <Icon size={18} />
                </span>

                <span className="min-w-0">
                  <span className="block text-sm font-semibold">
                    {module.title}
                  </span>
                </span>
              </Link>
            );
          })}
        </nav>

        {/* SIDEBAR FOOTER */}
        <div className="border-t border-slate-100 p-5">
          <div className="mb-4">
            <p className="text-sm font-semibold text-slate-800">
              PropelGo Admin
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Website content management
            </p>
          </div>

          <LogoutButton />
        </div>
      </aside>

      {/* RIGHT CONTENT AREA */}
      <section className="min-w-0">

        {/* COMMON HEADER */}
        <header className="sticky top-0 z-10 flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-white px-5 py-4 sm:px-8">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
              PropelGo / Admin
            </p>

            <h1 className="mt-1 text-lg font-semibold text-slate-900">
              {pageTitle}
            </h1>
          </div>

          <a
            href="https://propelgo.vercel.app"
            target="_blank"
            rel="noreferrer"
            className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-teal-300 hover:text-teal-800"
          >
            View live website ↗
          </a>
        </header>

        {/* SECTION PAGE CONTENT */}
        <div className="admin-shell-content min-w-0">
          {children}
        </div>

      </section>
    </div>
  );
}
