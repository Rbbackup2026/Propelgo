"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ImageUploadField from "@/components/ImageUploadField";

type EntityKind = "banks" | "partners" | "accreditations";

type Props = {
  kind: EntityKind;
  mode: "create" | "edit";
  entityId?: string;
};

type FormValues = {
  name: string;
  issuer: string;
  logo_url: string;
  description: string;
  display_order: number;
  is_active: boolean;
};

const emptyForm: FormValues = {
  name: "",
  issuer: "",
  logo_url: "",
  description: "",
  display_order: 0,
  is_active: true,
};

const inputClass =
  "mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100";

const config = {
  banks: {
    singular: "bank",
    plural: "Banks",
    nameLabel: "Bank name",
    imageLabel: "Bank logo",
  },
  partners: {
    singular: "partner",
    plural: "Partners",
    nameLabel: "Partner name",
    imageLabel: "Partner logo",
  },
  accreditations: {
    singular: "accreditation",
    plural: "Accreditations",
    nameLabel: "Accreditation name",
    imageLabel: "Accreditation image",
  },
} as const;

export default function AdminEntityForm({
  kind,
  mode,
  entityId,
}: Props) {
  const router = useRouter();
  const details = config[kind];

  const [form, setForm] = useState<FormValues>(emptyForm);
  const [loading, setLoading] = useState(mode === "edit");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (mode !== "edit" || !entityId) return;

    let cancelled = false;

    async function loadItem() {
      try {
        const response = await fetch(`/api/admin/${kind}/${entityId}`);
        const result = await response.json();

        if (response.status === 401) {
          router.replace("/admin");
          return;
        }

        if (!response.ok || !result.success) {
          throw new Error(result.message || `Unable to load ${details.singular}.`);
        }

        if (!cancelled) {
          const item = result.data;

          setForm({
            name: item.name ?? "",
            issuer: item.issuer ?? "",
            logo_url: item.logo_url ?? "",
            description: item.description ?? "",
            display_order: Number(item.display_order ?? 0),
            is_active:
              item.is_active === true || Number(item.is_active) === 1,
          });
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Unable to load record.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void loadItem();

    return () => {
      cancelled = true;
    };
  }, [kind, mode, entityId, router, details.singular]);

  function update<K extends keyof FormValues>(
    key: K,
    value: FormValues[K],
  ) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      if (uploading) {
        throw new Error("Please wait for the image upload to finish.");
      }

      const payload: Record<string, unknown> = {
        name: form.name.trim(),
        logo_url: form.logo_url.trim(),
        description: form.description.trim(),
        display_order: Number(form.display_order),
        is_active: form.is_active,
      };

      if (kind === "accreditations") {
        payload.issuer = form.issuer.trim();
      }

      const response = await fetch(
        mode === "create"
          ? `/api/admin/${kind}`
          : `/api/admin/${kind}/${entityId}`,
        {
          method: mode === "create" ? "POST" : "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );

      const result = await response.json();

      if (response.status === 401) {
        router.replace("/admin");
        return;
      }

      if (!response.ok || !result.success) {
        throw new Error(result.message || `Unable to save ${details.singular}.`);
      }

      router.push(`/admin/${kind}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save record.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <p className="p-8 text-sm text-slate-500">Loading details…</p>;
  }

  return (
    <form onSubmit={submit} className="space-y-6">
      {error && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
        <h2 className="text-xl font-semibold text-slate-900">
          {details.plural} information
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Update the information and image displayed on PropelGo.
        </p>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <label className="text-sm font-medium text-slate-700">
            {details.nameLabel} *
            <input
              required
              maxLength={191}
              value={form.name}
              onChange={(event) => update("name", event.target.value)}
              placeholder={`Enter ${details.singular} name`}
              className={inputClass}
            />
          </label>

          <label className="text-sm font-medium text-slate-700">
            Display order
            <input
              type="number"
              min={0}
              max={100000}
              value={form.display_order}
              onChange={(event) =>
                update("display_order", Number(event.target.value))
              }
              className={inputClass}
            />
            <span className="mt-1 block text-xs font-normal text-slate-500">
              Smaller numbers appear first.
            </span>
          </label>

          {kind === "accreditations" && (
            <label className="text-sm font-medium text-slate-700 md:col-span-2">
              Issuing organization
              <input
                maxLength={191}
                value={form.issuer}
                onChange={(event) => update("issuer", event.target.value)}
                placeholder="e.g. Certification authority"
                className={inputClass}
              />
            </label>
          )}

          <div className="md:col-span-2">
            <ImageUploadField
              label={details.imageLabel}
              value={form.logo_url}
              onChange={(url) => update("logo_url", url)}
              disabled={saving}
              onUploadingChange={setUploading}
            />
          </div>

          <label className="text-sm font-medium text-slate-700 md:col-span-2">
            Description
            <textarea
              rows={4}
              maxLength={5000}
              value={form.description}
              onChange={(event) => update("description", event.target.value)}
              placeholder={`Enter ${details.singular} description`}
              className={inputClass}
            />
          </label>
        </div>
      </section>

      <section className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-semibold text-slate-900">Publication status</p>
          <p className="mt-1 text-sm text-slate-500">
            Inactive records are not intended for display on the public site.
          </p>
        </div>

        <label className="inline-flex cursor-pointer items-center gap-3">
          <input
            type="checkbox"
            checked={form.is_active}
            onChange={(event) => update("is_active", event.target.checked)}
            className="h-4 w-4 accent-teal-700"
          />
          <span className="text-sm font-medium text-slate-700">
            {form.is_active ? "Active" : "Inactive"}
          </span>
        </label>
      </section>

      <div className="flex flex-wrap justify-end gap-3">
        <Link
          href={`/admin/${kind}`}
          className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          Cancel
        </Link>

        <button
          type="submit"
          disabled={saving || uploading}
          className="rounded-xl bg-teal-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {uploading
            ? "Uploading image…"
            : saving
              ? "Saving…"
              : mode === "create"
                ? `Create ${details.singular}`
                : "Save changes"}
        </button>
      </div>
    </form>
  );
}