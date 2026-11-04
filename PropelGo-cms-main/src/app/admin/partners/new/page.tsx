
import Link from "next/link";
import BrandLogo from "@/components/BrandLogo";
import { requireAdmin } from "@/lib/auth";
import PartnerForm from "../PartnerForm";

export default async function NewPartnerPage() {
  await requireAdmin();

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white px-5 py-4 sm:px-8">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
          <BrandLogo width={180} />
          <Link prefetch={false}
            href="/admin/dashboard"
            className="text-sm font-medium text-slate-600 hover:text-teal-700"
          >
            Dashboard
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-5 py-8 sm:px-8">
        <Link prefetch={false}
          href="/admin/partners"
          className="text-sm font-medium text-teal-700 hover:underline"
        >
          ← All partners
        </Link>

        <div className="mb-7 mt-5">
          <p className="text-sm font-semibold uppercase tracking-wider text-teal-700">
            Content management
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            Add partner
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Create a partner record with its logo and website information.
          </p>
        </div>

        <PartnerForm mode="create" />
      </div>
    </main>
  );
}
