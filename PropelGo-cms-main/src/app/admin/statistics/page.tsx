
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import BrandLogo from "@/components/BrandLogo";

type Statistic = {
  id: number;
  label: string;
  stat_value: string;
  description: string | null;
  icon: string | null;
  display_order: number;
  is_active: number | boolean | string;
};

type StatusFilter = "all" | "active" | "inactive";

function isActive(value: Statistic["is_active"]) {
  return value === true || Number(value) === 1;
}

export default function StatisticsPage() {
  const router = useRouter();

  const [items, setItems] = useState<Statistic[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState<number | null>(null);

  const loadItems = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/statistics", {
        cache: "no-store",
      });
      const result = await response.json();

      if (response.status === 401) {
        router.replace("/admin");
        return;
      }

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Unable to load statistics.");
      }

      setItems(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load statistics.");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    void loadItems();
  }, [loadItems]);

  const filtered = items.filter((item) => {
    const term = search.trim().toLowerCase();
    const matchesSearch =
      !term ||
      item.label.toLowerCase().includes(term) ||
      item.stat_value.toLowerCase().includes(term);

    const active = isActive(item.is_active);
    const matchesStatus =
      status === "all" ||
      (status === "active" && active) ||
      (status === "inactive" && !active);

    return matchesSearch && matchesStatus;
  });

  async function toggleStatus(item: Statistic) {
    const nextStatus = !isActive(item.is_active);

    if (!window.confirm(
      `${nextStatus ? "Activate" : "Deactivate"} "${item.label}"?`,
    )) return;

    setBusyId(item.id);
    setError("");

    try {
      const response = await fetch(`/api/admin/statistics/${item.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          label: item.label,
          stat_value: item.stat_value,
          description: item.description ?? "",
          icon: item.icon ?? "",
          display_order: Number(item.display_order ?? 0),
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

      await loadItems();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update status.");
    } finally {
      setBusyId(null);
    }
  }

  async function deleteItem(item: Statistic) {
    if (!window.confirm(
      `Delete "${item.label}" permanently? This cannot be undone.`,
    )) return;

    setBusyId(item.id);
    setError("");

    try {
      const response = await fetch(`/api/admin/statistics/${item.id}`, {
        method: "DELETE",
      });
      const result = await response.json();

      if (response.status === 401) {
        router.replace("/admin");
        return;
      }

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Unable to delete statistic.");
      }

      await loadItems();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to delete statistic.");
    } finally {
      setBusyId(null);
    }
  }

  const activeCount = items.filter((item) => isActive(item.is_active)).length;

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white px-5 py-4 sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4">
          <BrandLogo width={180} />
          <Link prefetch={false}
            href="/admin/dashboard"
            className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Back to dashboard
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-teal-700">
              Content management
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
              Statistics
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Manage the numbers and metrics shown on PropelGo.
            </p>
          </div>

          <Link prefetch={false}
            href="/admin/statistics/new"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-700 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-teal-800"
          >
            <span className="text-lg leading-none">+</span>
            Add statistic
          </Link>
        </div>

        <div className="mt-7 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-sm text-slate-500">Total statistics</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">{items.length}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-sm text-slate-500">Active</p>
            <p className="mt-2 text-3xl font-bold text-teal-700">{activeCount}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-sm text-slate-500">Inactive</p>
            <p className="mt-2 text-3xl font-bold text-slate-500">
              {items.length - activeCount}
            </p>
          </div>
        </div>

        <section className="mt-7 overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="flex flex-col gap-4 border-b border-slate-200 p-5 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="font-semibold text-slate-900">All statistics</h2>
              <p className="mt-1 text-sm text-slate-500">
                {filtered.length} result{filtered.length === 1 ? "" : "s"}
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search statistics..."
                aria-label="Search statistics"
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
                onClick={() => void loadItems()}
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Refresh
              </button>
            </div>
          </div>

          {error && (
            <div role="alert" className="m-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {loading ? (
            <div className="p-12 text-center text-sm text-slate-500">
              Loading statistics…
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-3xl">📊</div>
              <h3 className="mt-3 font-semibold text-slate-900">No statistics found</h3>
              <p className="mt-1 text-sm text-slate-500">
                Add a statistic or change your search.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-5 py-4 font-semibold">Statistic</th>
                    <th className="px-5 py-4 font-semibold">Value</th>
                    <th className="px-5 py-4 font-semibold">Order</th>
                    <th className="px-5 py-4 font-semibold">Status</th>
                    <th className="px-5 py-4 text-right font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map((item) => {
                    const active = isActive(item.is_active);
                    const busy = busyId === item.id;

                    return (
                      <tr key={item.id} className="hover:bg-slate-50/70">
                        <td className="px-5 py-4">
                          <p className="font-semibold text-slate-900">{item.label}</p>
                          {item.description && (
                            <p className="mt-1 max-w-sm truncate text-xs text-slate-500">
                              {item.description}
                            </p>
                          )}
                        </td>
                        <td className="px-5 py-4 font-semibold text-slate-800">
                          {item.stat_value}
                        </td>
                        <td className="px-5 py-4 text-slate-600">
                          {item.display_order}
                        </td>
                        <td className="px-5 py-4">
                          <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                            active
                              ? "bg-teal-50 text-teal-700"
                              : "bg-slate-100 text-slate-600"
                          }`}>
                            {active ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <Link prefetch={false}
                              href={`/admin/statistics/${item.id}/edit`}
                              className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                            >
                              Edit
                            </Link>
                            <button
                              type="button"
                              disabled={busy}
                              onClick={() => void toggleStatus(item)}
                              className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-50"
                            >
                              {busy ? "Please wait…" : active ? "Deactivate" : "Activate"}
                            </button>
                            <button
                              type="button"
                              disabled={busy}
                              onClick={() => void deleteItem(item)}
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
