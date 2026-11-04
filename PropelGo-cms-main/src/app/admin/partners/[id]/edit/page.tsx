
import Link from "next/link";
import BrandLogo from "@/components/BrandLogo";
import { requireAdmin } from "@/lib/auth";
import PartnerForm from "../../PartnerForm";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditPartnerPage({ params }: PageProps) {
  await requireAdmin();

  const { id } = await params;

  if (!/^[1-9]\d*$/.test(id) || !Number.isSafeInteger(Number(id))) {
    return (
      <main className="min-h-screen bg-slate-50 p-8">
        <h1 className="text-2xl font-bold text-slate-900">
          Invalid partner ID
        </h1>
        <Link
          href="/admin/partners"
          className="mt-4 inline-block text-teal-700 hover:underline"
        >
          Return to partners
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white px-5 py-4 sm:px-8">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
          <BrandLogo width={180} />
          <Link
            href="/admin/dashboard"
            className="text-sm font-medium text-slate-600 hover:text-teal-700"
          >
            Dashboard
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-5 py-8 sm:px-8">
        <Link
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
            Edit partner
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Update the partner name, logo, website and publication status.
          </p>
        </div>

        <PartnerForm mode="edit" partnerId={id} />
      </div>
    </main>
  );
}
