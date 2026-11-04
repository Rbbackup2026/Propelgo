
import { requireAdmin } from "@/lib/auth";
import { query } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type AdminRow = {
  name: string;
  email: string;
};

export default async function AdminDashboardPage() {
  const session = await requireAdmin();

  const admins = await query<AdminRow[]>(
    `SELECT name, email
     FROM admin_users
     WHERE id = ? AND is_active = TRUE
     LIMIT 1`,
    [session.adminId],
  );

  if (!admins[0]) {
    return (
      <main className="min-h-screen bg-slate-50 p-8">
        <p className="text-slate-700">
          Your admin account is unavailable. Please sign in again.
        </p>
      </main>
    );
  }

  const admin = admins[0];

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8 sm:py-10">

        {/* WELCOME BANNER */}
        <section className="relative overflow-hidden rounded-3xl bg-slate-950 p-7 text-white sm:p-10">

          <div className="pointer-events-none absolute -right-16 -top-24 h-72 w-72 rounded-full bg-teal-500/20 blur-3xl" />

          <div className="pointer-events-none absolute -bottom-24 right-1/4 h-56 w-56 rounded-full bg-cyan-400/10 blur-3xl" />

          <div className="relative">
            <p className="text-sm font-medium text-teal-300">
              Welcome back
            </p>

            <h2 className="mt-3 max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl">
              Good to see you!
            </h2>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">
              Keep PropelGo&apos;s website content consistent and up to date.
              Select a section from the left navigation to manage its
              images, descriptions, records and publication status.
            </p>

            <a
              href="https://propelgo.vercel.app"
              target="_blank"
              rel="noreferrer"
              className="mt-7 inline-flex rounded-xl bg-teal-400 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-teal-300"
            >
              Open PropelGo website
            </a>
          </div>
        </section>

        {/* WORKSPACE OVERVIEW */}
        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-7 shadow-sm sm:p-9">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700">
            Workspace overview
          </p>

          <h2 className="mt-3 text-2xl font-bold text-slate-900">
            Your content studio is ready.
          </h2>

          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500">
            All website content management sections are available in the
            left navigation. Choose a section to create, update or manage
            your content.
          </p>
        </section>

        <p className="mt-8 text-xs leading-5 text-slate-400">
          Changes saved here are stored in your connected database.
          Published website sections must also be connected to the
          corresponding public-facing frontend.
        </p>

      </div>
    </main>
  );
}
