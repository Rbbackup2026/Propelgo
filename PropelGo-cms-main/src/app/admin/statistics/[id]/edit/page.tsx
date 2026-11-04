
import Link from "next/link";
import BrandLogo from "@/components/BrandLogo";
import { requireAdmin } from "@/lib/auth";
import StatisticForm from "../../StatisticForm";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditStatisticPage({ params }: PageProps) {
  await requireAdmin();

  const { id } = await params;

  if (!/^[1-9]\d*$/.test(id) || !Number.isSafeInteger(Number(id))) {
    return (
      <main className="min-h-screen bg-slate-50 p-8">
        <h1 className="text-2xl font-bold text-slate-900">Invalid statistic ID</h1>
        <Link prefetch={false} href="/admin/statistics" className="mt-4 inline-block text-teal-700 hover:underline">
          Return to statistics
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white px-5 py-4 sm:px-8">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
          <BrandLogo width={180} />
          <Link prefetch={false} href="/admin/dashboard" className="text-sm font-medium text-slate-600 hover:text-teal-700">
            Dashboard
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-5 py-8 sm:px-8">
        <Link prefetch={false} href="/admin/statistics" className="text-sm font-medium text-teal-700 hover:underline">
          ← All statistics
        </Link>

        <div className="mb-7 mt-5">
          <p className="text-sm font-semibold uppercase tracking-wider text-teal-700">
            Content management
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            Edit statistic
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Update the value, label and publication status.
          </p>
        </div>

        <StatisticForm mode="edit" statisticId={id} />
      </div>
    </main>
  );
}
