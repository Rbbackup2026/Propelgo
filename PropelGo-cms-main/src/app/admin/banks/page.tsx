
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import BrandLogo from "@/components/BrandLogo";

type Bank = {
  id: number;
  name: string;
  logo_url: string | null;
  website_url: string | null;
  description: string | null;
  display_order: number;
  is_active: number | boolean | string;
};

type StatusFilter = "all" | "active" | "inactive";

function isActive(value: Bank["is_active"]) {
  return value === true || Number(value) === 1;
}

export default function BanksPage() {
  const router = useRouter();

  const [banks, setBanks] = useState<Bank[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState<number | null>(null);

  const loadBanks = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/banks", {
        cache: "no-store",
      });
      const result = await response.json();

      if (response.status === 401) {
        router.replace("/admin");
        return;
      }

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Unable to load banks.");
      }

      setBanks(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load banks.");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    void loadBanks();
  }, [loadBanks]);

  const filteredBanks = banks.filter((bank) => {
    const term = search.trim().toLowerCase();

    const matchesSearch =
      !term ||
      bank.name.toLowerCase().includes(term) ||
      (bank.website_url ?? "").toLowerCase().includes(term);

    const active = isActive(bank.is_active);
    const matchesStatus =
      status === "all" ||
      (status === "active" && active) ||
      (status === "inactive" && !active);

    return matchesSearch && matchesStatus;
  });

  async function toggleStatus(bank: Bank) {
    const nextStatus = !isActive(bank.is_active);

    if (
      !window.confirm(
        `${nextStatus ? "Activate" : "Deactivate"} ${bank.name}?`,
      )
    ) {
      return;
    }

    setBusyId(bank.id);
    setError("");

    try {
      const response = await fetch(`/api/admin/banks/${bank.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: bank.name,
          logo_url: bank.logo_url ?? "",
          website_url: bank.website_url ?? "",
          description: bank.description ?? "",
          display_order: Number(bank.display_order ?? 0),
          is_active: nextStatus,
        }),
      });

      const result = await response.json();

      if (response.status === 401) {
        router.replace("/admin");
        return;
      }

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Unable to update status.");
      }

      await loadBanks();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update status.");
    } finally {
      setBusyId(null);
    }
  }

  async function deleteBank(bank: Bank) {
    if (
      !window.confirm(
        `Delete "${bank.name}" permanently? This action cannot be undone.`,
      )
    ) {
      return;
    }

    setBusyId(bank.id);
    setError("");

    try {
      const response = await fetch(`/api/admin/banks/${bank.id}`, {
        method: "DELETE",
      });
      const result = await response.json();

      if (response.status === 401) {
        router.replace("/admin");
        return;
      }

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Unable to delete bank.");
      }

      await loadBanks();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to delete bank.");
    } finally {
      setBusyId(null);
    }
  }

  const activeCount = banks.filter((bank) => isActive(bank.is_active)).length;

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white px-5 py-4 sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4">
          <BrandLogo width={180} />
          <div className="flex items-center gap-3">
            <Link prefetch={false}
              href="/admin/dashboard"
              className="rounded-xl px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
            >
              Dashboard
            </Link>
            <Link prefetch={false}
              href="/admin/dashboard"
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              CMS home
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-teal-700">
              Content management
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
              Banks
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Manage bank names, logos, links and visibility on PropelGo.
            </p>
          </div>

          <Link prefetch={false}
            href="/admin/banks/new"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-700 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-800"
          >
            <span className="text-lg leading-none">+</span>
            Add bank
          </Link>
        </div>

        <div className="mt-7 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-sm text-slate-500">Total banks</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">
              {banks.length}
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-sm text-slate-500">Active banks</p>
            <p className="mt-2 text-3xl font-bold text-teal-700">
              {activeCount}
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-sm text-slate-500">Inactive banks</p>
            <p className="mt-2 text-3xl font-bold text-slate-500">
              {banks.length - activeCount}
            </p>
          </div>
        </div>

        <section className="mt-7 overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="flex flex-col gap-4 border-b border-slate-200 p-5 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="font-semibold text-slate-900">All banks</h2>
              <p className="mt-1 text-sm text-slate-500">
                {filteredBanks.length} result
                {filteredBanks.length === 1 ? "" : "s"}
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search banks..."
                aria-label="Search banks"
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-teal-600 sm:w-64"
              />

              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as StatusFilter)}
                aria-label="Filter by status"
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-teal-600"
              >
                <option value="all">All statuses</option>
                <option value="active">Active only</option>
                <option value="inactive">Inactive only</option>
              </select>

              <button
                type="button"
                onClick={() => void loadBanks()}
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Refresh
              </button>
            </div>
          </div>

          {error && (
            <div
              role="alert"
              className="m-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {error}
            </div>
          )}

          {loading ? (
            <div className="p-12 text-center text-sm text-slate-500">
              Loading banks…
            </div>
          ) : filteredBanks.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-3xl">🏦</div>
              <h3 className="mt-3 font-semibold text-slate-900">
                No banks found
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Add a bank or try changing your search.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-5 py-4 font-semibold">Bank</th>
                    <th className="px-5 py-4 font-semibold">Display order</th>
                    <th className="px-5 py-4 font-semibold">Status</th>
                    <th className="px-5 py-4 text-right font-semibold">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {filteredBanks.map((bank) => {
                    const active = isActive(bank.is_active);
                    const busy = busyId === bank.id;

                    return (
                      <tr key={bank.id} className="hover:bg-slate-50/70">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-12 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-slate-100 bg-white p-2">
                              {bank.logo_url ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                  src={bank.logo_url}
                                  alt={`${bank.name} logo`}
                                  className="max-h-full max-w-full object-contain"
                                />
                              ) : (
                                <span className="text-xl">🏦</span>
                              )}
                            </div>
                            <div>
                              <p className="font-semibold text-slate-900">
                                {bank.name}
                              </p>
                              {bank.website_url && (
                                <p className="mt-1 max-w-xs truncate text-xs text-slate-500">
                                  {bank.website_url}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-4 text-slate-600">
                          {bank.display_order}
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                              active
                                ? "bg-teal-50 text-teal-700"
                                : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            {active ? "Active" : "Inactive"}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <Link prefetch={false}
                              href={`/admin/banks/${bank.id}/edit`}
                              className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                            >
                              Edit
                            </Link>

                            <button
                              type="button"
                              disabled={busy}
                              onClick={() => void toggleStatus(bank)}
                              className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-50"
                            >
                              {busy
                                ? "Please wait…"
                                : active
                                  ? "Deactivate"
                                  : "Activate"}
                            </button>

                            <button
                              type="button"
                              disabled={busy}
                              onClick={() => void deleteBank(bank)}
                              className="rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-50 disabled:opacity-50"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
