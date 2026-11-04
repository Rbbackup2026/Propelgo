
"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Props = {
  mode: "create" | "edit";
  statisticId?: string;
};

type FormData = {
  label: string;
  stat_value: string;
  description: string;
  icon: string;
  display_order: number;
  is_active: boolean;
};

const initial: FormData = {
  label: "",
  stat_value: "",
  description: "",
  icon: "",
  display_order: 0,
  is_active: true,
};

const fieldClass =
  "mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100";

export default function StatisticForm({ mode, statisticId }: Props) {
  const router = useRouter();
  const [form, setForm] = useState<FormData>(initial);
  const [loading, setLoading] = useState(mode === "edit");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (mode !== "edit" || !statisticId) return;

    let cancelled = false;

    async function load() {
      try {
        const response = await fetch(`/api/admin/statistics/${statisticId}`);
        const result = await response.json();

        if (response.status === 401) {
          router.replace("/admin");
          return;
        }

        if (!response.ok || !result.success) {
          throw new Error(result.message || "Unable to load statistic.");
        }

        if (!cancelled) {
          const item = result.data;
          setForm({
            label: item.label ?? "",
            stat_value: item.stat_value ?? "",
            description: item.description ?? "",
            icon: item.icon ?? "",
            display_order: Number(item.display_order ?? 0),
            is_active:
              item.is_active === true || Number(item.is_active) === 1,
          });
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Unable to load statistic.",
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [mode, statisticId, router]);

  function update<K extends keyof FormData>(key: K, value: FormData[K]) {
    setForm((previous) => ({ ...previous, [key]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      const response = await fetch(
        mode === "create"
          ? "/api/admin/statistics"
          : `/api/admin/statistics/${statisticId}`,
        {
          method: mode === "create" ? "POST" : "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...form,
            label: form.label.trim(),
            stat_value: form.stat_value.trim(),
            description: form.description.trim(),
            icon: form.icon.trim(),
            display_order: Number(form.display_order),
          }),
        },
      );

      const result = await response.json();

      if (response.status === 401) {
        router.replace("/admin");
        return;
      }

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Unable to save statistic.");
      }

      router.push("/admin/statistics");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to save statistic.",
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <p className="p-8 text-sm text-slate-500">Loading statistic…</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <section className="rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-slate-900">
          Statistic information
        </h2>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <label className="text-sm font-medium text-slate-700">
            Label *
            <input
              required
              maxLength={191}
              value={form.label}
              onChange={(e) => update("label", e.target.value)}
              placeholder="Enterprise customers"
              className={fieldClass}
            />
          </label>

          <label className="text-sm font-medium text-slate-700">
            Display value *
            <input
              required
              maxLength={191}
              value={form.stat_value}
              onChange={(e) => update("stat_value", e.target.value)}
              placeholder="e.g. 500+ or ₹10 Cr+"
              className={fieldClass}
            />
            <span className="mt-1 block text-xs font-normal text-slate-500">
              Enter the complete display text, including + or units.
            </span>
          </label>

          <label className="text-sm font-medium text-slate-700">
            Icon name or symbol
            <input
              maxLength={100}
              value={form.icon}
              onChange={(e) => update("icon", e.target.value)}
              placeholder="e.g. chart or 🏢"
              className={fieldClass}
            />
          </label>

          <label className="text-sm font-medium text-slate-700">
            Display order
            <input
              type="number"
              min={0}
              max={100000}
              value={form.display_order}
              onChange={(e) =>
                update("display_order", Number(e.target.value))
              }
              className={fieldClass}
            />
          </label>

          <label className="text-sm font-medium text-slate-700 md:col-span-2">
            Description
            <textarea
              rows={4}
              maxLength={5000}
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              placeholder="Optional supporting text"
              className={fieldClass}
            />
          </label>
        </div>
      </section>

      <section className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-semibold text-slate-900">Publication status</p>
          <p className="mt-1 text-sm text-slate-500">
            Only active statistics should appear on the public website.
          </p>
        </div>

        <label className="inline-flex cursor-pointer items-center gap-3">
          <input
            type="checkbox"
            checked={form.is_active}
            onChange={(e) => update("is_active", e.target.checked)}
            className="h-4 w-4 accent-teal-700"
          />
          <span className="text-sm font-medium text-slate-700">
            {form.is_active ? "Active" : "Inactive"}
          </span>
        </label>
      </section>

      <div className="flex justify-end gap-3">
        <Link
          href="/admin/statistics"
          className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          Cancel
        </Link>
        <button
          type="submit"
          disabled={saving}
          className="rounded-xl bg-teal-700 px-6 py-3 text-sm font-semibold text-white hover:bg-teal-800 disabled:opacity-60"
        >
          {saving
            ? "Saving…"
            : mode === "create"
              ? "Create statistic"
              : "Save changes"}
        </button>
      </div>
    </form>
  );
}
