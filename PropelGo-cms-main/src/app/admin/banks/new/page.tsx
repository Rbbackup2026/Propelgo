
import Link from "next/link";
import BankForm from "../BankForm";
import BrandLogo from "@/components/BrandLogo";
import { requireAdmin } from "@/lib/auth";

export default async function NewBankPage() {
  await requireAdmin();

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white px-5 py-4 sm:px-8">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
          <BrandLogo width={130} />
          <Link
            href="/admin/dashboard"
            className="text-sm font-medium text-slate-600 hover:text-teal-700"
          >
            Back to dashboard
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-5 py-8 sm:px-8">
        <Link
          href="/admin/banks"
          className="text-sm font-medium text-teal-700 hover:underline"
        >
          ← All banks
        </Link>

        <div className="mb-7 mt-5">
          <p className="text-sm font-semibold uppercase tracking-wider text-teal-700">
            Content management
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            Add bank
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Add a bank and manage how it appears in your website content.
          </p>
        </div>

        <BankForm mode="create" />
      </div>
    </main>
  );
}
