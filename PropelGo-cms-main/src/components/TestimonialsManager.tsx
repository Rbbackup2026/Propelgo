
"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  MessageSquareQuote,
  Pencil,
  Plus,
  RefreshCw,
  Trash2,
  UserRound,
  X,
} from "lucide-react";

type Testimonial = {
  id: number;
  name: string;
  designation: string;
  photo_url: string;
  review: string;
  display_order: number;
  is_active: boolean | number;
};

type FormValues = {
  name: string;
  designation: string;
  photo_url: string;
  review: string;
  display_order: number;
  is_active: boolean;
};

const emptyForm: FormValues = {
  name: "",
  designation: "",
  photo_url: "",
  review: "",
  display_order: 0,
  is_active: true,
};

const inputClass =
  "mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-teal-600 focus:ring-2 focus:ring-teal-100";

export default function TestimonialsManager() {
  const router = useRouter();

  const [items, setItems] = useState<Testimonial[]>([]);
  const [form, setForm] = useState<FormValues>(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const endpoint = "/api/admin/testimonials";

  const loadItems = useCallback(async () => {
    setLoading(true);

    try {
      const response = await fetch(endpoint, { cache: "no-store" });
      const result = await response.json();

      if (response.status === 401) {
        router.replace("/admin");
        return;
      }

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Unable to load testimonials.");
      }

      setItems(result.data ?? []);
      setError("");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to load testimonials.",
      );
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    void loadItems();
  }, [loadItems]);

  function update<K extends keyof FormValues>(
    key: K,
    value: FormValues[K],
  ) {
    setForm((previous) => ({ ...previous, [key]: value }));
  }

  function resetForm() {
    setEditingId(null);
    setForm(emptyForm);
    setError("");
    setNotice("");
  }

  function editItem(item: Testimonial) {
    setEditingId(item.id);
    setForm({
      name: item.name,
      designation: item.designation,
      photo_url: item.photo_url,
      review: item.review,
      display_order: Number(item.display_order ?? 0),
      is_active:
        item.is_active === true || Number(item.is_active) === 1,
    });
    setError("");
    setNotice("");

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function uploadPhoto(file?: File) {
    if (!file) return;

    setError("");
    setNotice("");

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
    ];

    if (!allowedTypes.includes(file.type)) {
      setError("Choose a JPG, PNG, WEBP or GIF photograph.");
      return;
    }

    if (file.size === 0 || file.size > 5 * 1024 * 1024) {
      setError("Photo size must be greater than 0 and no more than 5 MB.");
      return;
    }

    setUploading(true);

    try {
      const data = new FormData();
      data.append("image", file);

      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body: data,
      });

      const result = await response.json();

      if (response.status === 401) {
        router.replace("/admin");
        return;
      }

      if (!response.ok || !result.success || !result.data?.image_url) {
        throw new Error(result.message || "Photo upload failed.");
      }

      update("photo_url", result.data.image_url);
      setNotice("Customer photo uploaded successfully.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Photo upload failed.");
    } finally {
      setUploading(false);
    }
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setNotice("");

    if (uploading) {
      setError("Please wait until the photo upload finishes.");
      return;
    }

    if (!form.photo_url.trim()) {
      setError("Please upload a customer photo.");
      return;
    }

    setSaving(true);

    try {
      const payload = {
        name: form.name.trim(),
        designation: form.designation.trim(),
        photo_url: form.photo_url.trim(),
        review: form.review.trim(),
        display_order: Number(form.display_order),
        is_active: form.is_active,
      };

      const response = await fetch(
        editingId === null ? endpoint : `${endpoint}/${editingId}`,
        {
          method: editingId === null ? "POST" : "PUT",
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
        throw new Error(result.message || "Unable to save testimonial.");
      }

      setNotice(
        editingId === null
          ? "Testimonial added successfully."
          : "Testimonial updated successfully.",
      );

      setEditingId(null);
      setForm(emptyForm);
      await loadItems();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to save testimonial.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function deleteItem(item: Testimonial) {
    if (
      !window.confirm(
        `Delete the testimonial from "${item.name}"? This cannot be undone.`,
      )
    ) {
      return;
    }

    setError("");
    setNotice("");

    try {
      const response = await fetch(`${endpoint}/${item.id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (response.status === 401) {
        router.replace("/admin");
        return;
      }

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Unable to delete testimonial.");
      }

      if (editingId === item.id) resetForm();

      setNotice("Testimonial deleted successfully.");
      await loadItems();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to delete testimonial.",
      );
    }
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8">

        {/* PAGE INTRO */}
        <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-sm font-medium text-teal-700">
              <MessageSquareQuote size={18} />
              Customer testimonials
            </div>

            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
              Testimonials
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Manage customer reviews, photographs, names and designations
              displayed on the PropelGo website.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              resetForm();
              document.getElementById("testimonial-form")?.scrollIntoView({
                behavior: "smooth",
              });
            }}
            className="inline-flex items-center gap-2 rounded-xl bg-teal-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-teal-800"
          >
            <Plus size={17} />
            Add testimonial
          </button>
        </div>

        {/* FEEDBACK */}
        {(error || notice) && (
          <div
            role={error ? "alert" : "status"}
            className={`mb-5 rounded-xl border px-4 py-3 text-sm ${
              error
                ? "border-red-200 bg-red-50 text-red-700"
                : "border-emerald-200 bg-emerald-50 text-emerald-800"
            }`}
          >
            {error || notice}
          </div>
        )}

        {/* FORM */}
        <section
          id="testimonial-form"
          className="mb-9 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7"
        >
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-5">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">
                {editingId === null ? "Add new testimonial" : "Edit testimonial"}
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Enter the customer&apos;s review and profile details.
              </p>
            </div>

            {editingId !== null && (
              <button
                type="button"
                onClick={resetForm}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
              >
                <X size={15} />
                Cancel edit
              </button>
            )}
          </div>

          <form onSubmit={submit} className="mt-6 space-y-6">
            <div>
              <label className="text-sm font-semibold text-slate-700">
                Customer review *
              </label>

              <textarea
                required
                rows={5}
                maxLength={10000}
                value={form.review}
                onChange={(event) => update("review", event.target.value)}
                className={inputClass}
                placeholder="Write the customer's testimonial here..."
              />

              <p className="mt-1 text-xs text-slate-400">
                {form.review.length}/10000 characters
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <label className="text-sm font-semibold text-slate-700">
                Customer name *
                <input
                  required
                  maxLength={191}
                  value={form.name}
                  onChange={(event) => update("name", event.target.value)}
                  className={inputClass}
                  placeholder="e.g. Name Surname"
                />
              </label>

              <label className="text-sm font-semibold text-slate-700">
                Designation *
                <input
                  required
                  maxLength={191}
                  value={form.designation}
                  onChange={(event) =>
                    update("designation", event.target.value)
                  }
                  className={inputClass}
                  placeholder="e.g. Head of Finance, Customer company"
                />
              </label>
            </div>

            {/* CUSTOMER PHOTO */}
            <div>
              <label className="block text-sm font-semibold text-slate-700">
                Customer photograph *
              </label>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                Upload a square photograph for the circular customer avatar.
                JPG, PNG, WEBP or GIF; maximum 5 MB.
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-5">
                <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-slate-50">
                  {form.photo_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={form.photo_url}
                      alt="Customer photo preview"
                      className="h-full w-full rounded-full object-cover"
                    />
                  ) : (
                    <UserRound size={30} className="text-slate-400" />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    disabled={saving || uploading}
                    onChange={(event) => {
                      void uploadPhoto(event.target.files?.[0]);
                      event.currentTarget.value = "";
                    }}
                    className="block w-full rounded-xl border border-slate-200 p-3 text-sm file:mr-4 file:rounded-lg file:border-0 file:bg-teal-50 file:px-4 file:py-2 file:font-semibold file:text-teal-800"
                  />

                  {uploading && (
                    <p className="mt-2 text-sm text-teal-700">
                      Uploading photograph…
                    </p>
                  )}

                  {form.photo_url && (
                    <button
                      type="button"
                      onClick={() => update("photo_url", "")}
                      className="mt-2 text-sm font-semibold text-red-600 hover:text-red-700"
                    >
                      Remove photograph
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <label className="text-sm font-semibold text-slate-700">
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
              </label>

              <div className="flex items-center gap-3 self-end rounded-xl border border-slate-200 p-4">
                <input
                  id="testimonial-active"
                  type="checkbox"
                  checked={form.is_active}
                  onChange={(event) =>
                    update("is_active", event.target.checked)
                  }
                  className="h-4 w-4 accent-teal-700"
                />
                <label
                  htmlFor="testimonial-active"
                  className="text-sm font-medium text-slate-700"
                >
                  Active — eligible to appear on the website
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
              {editingId !== null && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
              )}

              <button
                type="submit"
                disabled={saving || uploading}
                className="rounded-xl bg-teal-700 px-6 py-3 text-sm font-semibold text-white hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {uploading
                  ? "Uploading…"
                  : saving
                    ? "Saving…"
                    : editingId === null
                      ? "Create testimonial"
                      : "Save changes"}
              </button>
            </div>
          </form>
        </section>

        {/* TESTIMONIAL LIST */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-5 py-4 sm:px-7">
            <div>
              <h3 className="font-semibold text-slate-900">
                All testimonials
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                {items.length} {items.length === 1 ? "testimonial" : "testimonials"}
              </p>
            </div>

            <button
              type="button"
              onClick={() => void loadItems()}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50"
            >
              <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
              Refresh
            </button>
          </div>

          {loading ? (
            <p className="p-8 text-sm text-slate-500">
              Loading testimonials…
            </p>
          ) : items.length === 0 ? (
            <div className="p-10 text-center">
              <MessageSquareQuote
                size={32}
                className="mx-auto text-slate-300"
              />
              <p className="mt-3 font-semibold text-slate-800">
                No testimonials yet
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Add your first customer testimonial using the form above.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 p-5 sm:p-7 xl:grid-cols-2">
              {items.map((item) => {
                const active =
                  item.is_active === true || Number(item.is_active) === 1;

                return (
                  <article
                    key={item.id}
                    className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-teal-200 hover:shadow-sm"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                          active
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {active ? "Active" : "Inactive"}
                      </span>

                      <span className="text-xs text-slate-400">
                        Order: {item.display_order}
                      </span>
                    </div>

                    <blockquote className="mt-5 whitespace-pre-wrap text-base leading-7 text-slate-800">
                      “{item.review}”
                    </blockquote>

                    <div className="mt-6 flex items-center gap-3 border-t border-slate-100 pt-5">
                      <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full border border-slate-200 bg-slate-50">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.photo_url}
                          alt={item.name}
                          className="h-full w-full rounded-full object-cover"
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-bold text-slate-900">
                          {item.name}
                        </p>
                        <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">
                          {item.designation}
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 flex justify-end gap-2 border-t border-slate-100 pt-4">
                      <button
                        type="button"
                        onClick={() => editItem(item)}
                        className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                      >
                        <Pencil size={14} />
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => void deleteItem(item)}
                        className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-50"
                      >
                        <Trash2 size={14} />
                        Delete
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
