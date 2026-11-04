
"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

type Kind = "articles" | "team";

type Item = {
  id: number;
  name: string;
  designation?: string;
  image_url: string;
  description: string | null;
  display_order: number;
  is_active: boolean | number;
};

type FormValues = {
  name: string;
  designation: string;
  image_url: string;
  description: string;
  display_order: number;
  is_active: boolean;
};

const emptyForm: FormValues = {
  name: "",
  designation: "",
  image_url: "",
  description: "",
  display_order: 0,
  is_active: true,
};

const inputClass =
  "mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100";

export default function ContentManager({ kind }: { kind: Kind }) {
  const router = useRouter();
  const isTeam = kind === "team";
  const title = isTeam ? "Team" : "Articles";
  const endpoint = `/api/admin/content/${kind}`;
  const singular = isTeam ? "team member" : "article";

  const [items, setItems] = useState<Item[]>([]);
  const [form, setForm] = useState<FormValues>(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

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
        throw new Error(result.message || `Unable to load ${title}.`);
      }

      setItems(result.data ?? []);
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load records.");
    } finally {
      setLoading(false);
    }
  }, [endpoint, router, title]);

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

  function editItem(item: Item) {
    setEditingId(item.id);
    setForm({
      name: item.name ?? "",
      designation: item.designation ?? "",
      image_url: item.image_url ?? "",
      description: item.description ?? "",
      display_order: Number(item.display_order ?? 0),
      is_active: item.is_active === true || Number(item.is_active) === 1,
    });
    setError("");
    setNotice("");

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function uploadImage(file?: File) {
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
      setError("Choose a JPG, PNG, WEBP or GIF image.");
      return;
    }

    if (file.size === 0 || file.size > 5 * 1024 * 1024) {
      setError("Image size must be greater than 0 and no more than 5 MB.");
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
        throw new Error(result.message || "Image upload failed.");
      }

      update("image_url", result.data.image_url);
      setNotice("Image uploaded successfully.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Image upload failed.");
    } finally {
      setUploading(false);
    }
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setNotice("");

    if (uploading) {
      setError("Please wait until the image upload finishes.");
      return;
    }

    if (!form.image_url.trim()) {
      setError("Please upload an image.");
      return;
    }

    if (isTeam && !form.designation.trim()) {
      setError("Please enter the team member's designation.");
      return;
    }

    setSaving(true);

    try {
      const payload = {
        name: form.name.trim(),
        designation: form.designation.trim(),
        image_url: form.image_url.trim(),
        description: form.description.trim(),
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
        throw new Error(result.message || `Unable to save ${singular}.`);
      }

      setNotice(editingId === null ? "Record created." : "Record updated.");
      setEditingId(null);
      setForm(emptyForm);
      await loadItems();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save record.");
    } finally {
      setSaving(false);
    }
  }

  async function deleteItem(item: Item) {
    if (!window.confirm(`Delete "${item.name}"? This cannot be undone.`)) {
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
        throw new Error(result.message || "Unable to delete record.");
      }

      if (editingId === item.id) resetForm();

      setNotice("Record deleted.");
      await loadItems();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to delete record.");
    }
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8">

        {/* PAGE INTRO */}
        <div className="mb-8">
          <p className="text-sm font-medium text-teal-700">
            PropelGo CMS / Website content
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            {title}
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Manage {isTeam ? "your team profiles" : "your website articles"}.
          </p>
        </div>

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

        {/* ADD / EDIT FORM */}
        <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <h2 className="text-lg font-semibold text-slate-900">
            {editingId === null ? `Add ${singular}` : `Edit ${singular}`}
          </h2>

          <form onSubmit={submit} className="mt-6 space-y-5">
            <div className="grid gap-5 md:grid-cols-2">

              <label className="text-sm font-medium text-slate-700">
                {isTeam ? "Full name *" : "Article name *"}
                <input
                  required
                  maxLength={191}
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  className={inputClass}
                  placeholder={isTeam ? "Enter full name" : "Enter article title"}
                />
              </label>

              {isTeam && (
                <label className="text-sm font-medium text-slate-700">
                  Designation *
                  <input
                    required
                    maxLength={191}
                    value={form.designation}
                    onChange={(e) => update("designation", e.target.value)}
                    className={inputClass}
                    placeholder="e.g. Chief Executive Officer"
                  />
                </label>
              )}

              {/* IMAGE UPLOAD */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700">
                  {isTeam ? "Team member portrait *" : "Article image *"}
                </label>

                <p className="mt-1 text-xs text-slate-500">
                  {isTeam
                    ? "Upload a vertical portrait photograph. Recommended ratio: 3:4."
                    : "Upload an article image."}
                  {" "}JPG, PNG, WEBP or GIF. Maximum 5 MB.
                </p>

                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  disabled={saving || uploading}
                  onChange={(e) => {
                    void uploadImage(e.target.files?.[0]);
                    e.currentTarget.value = "";
                  }}
                  className="mt-3 block w-full rounded-xl border border-slate-200 p-3 text-sm file:mr-4 file:rounded-lg file:border-0 file:bg-teal-50 file:px-4 file:py-2 file:font-semibold file:text-teal-800"
                />

                {uploading && (
                  <p className="mt-2 text-sm text-teal-700">
                    Uploading image…
                  </p>
                )}

                {form.image_url && (
                  <div className="mt-4 flex flex-wrap items-center gap-5 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4">

                    <div
                      className={
                        isTeam
                          ? "h-48 w-36 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-white"
                          : "h-28 w-40 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-white"
                      }
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={form.image_url}
                        alt={isTeam ? "Team member portrait preview" : "Article image preview"}
                        className={
                          isTeam
                            ? "h-full w-full object-cover object-top"
                            : "h-full w-full object-contain"
                        }
                      />
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-slate-800">
                        {isTeam ? "Portrait preview" : "Image preview"}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        {isTeam
                          ? "Displayed in portrait format (3:4)."
                          : "Article image preview."}
                      </p>

                      <button
                        type="button"
                        onClick={() => update("image_url", "")}
                        className="mt-3 text-sm font-semibold text-red-600 hover:text-red-700"
                      >
                        Remove image
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <label className="text-sm font-medium text-slate-700 md:col-span-2">
                Description *
                <textarea
                  required
                  rows={5}
                  maxLength={10000}
                  value={form.description}
                  onChange={(e) => update("description", e.target.value)}
                  className={inputClass}
                  placeholder={
                    isTeam
                      ? "Describe the person's role and experience"
                      : "Enter the article description"
                  }
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
                  className={inputClass}
                />
              </label>

              <div className="flex items-center gap-3 self-end rounded-xl border border-slate-200 p-4">
                <input
                  id={`${kind}-active`}
                  type="checkbox"
                  checked={form.is_active}
                  onChange={(e) => update("is_active", e.target.checked)}
                  className="h-4 w-4 accent-teal-700"
                />
                <label
                  htmlFor={`${kind}-active`}
                  className="text-sm font-medium text-slate-700"
                >
                  Active — eligible to appear on the website
                </label>
              </div>
            </div>

            <div className="flex flex-wrap justify-end gap-3">
              {editingId !== null && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel edit
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
                      ? `Create ${singular}`
                      : "Save changes"}
              </button>
            </div>
          </form>
        </section>

        {/* RECORD LIST */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-5 py-4 sm:px-7">
            <h2 className="font-semibold text-slate-900">
              All {title.toLowerCase()}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {items.length} {items.length === 1 ? "record" : "records"}
            </p>
          </div>

          {loading ? (
            <p className="p-8 text-sm text-slate-500">Loading records…</p>
          ) : items.length === 0 ? (
            <p className="p-8 text-sm text-slate-500">
              No records added yet.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-sm">
                <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500">
                  <tr>
                    <th className="px-5 py-4">Image</th>
                    <th className="px-5 py-4">Name</th>
                    {isTeam && <th className="px-5 py-4">Designation</th>}
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4 text-right">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {items.map((item) => {
                    const active =
                      item.is_active === true || Number(item.is_active) === 1;

                    return (
                      <tr key={item.id} className="hover:bg-slate-50">
                        <td className="px-5 py-4">
                          <div
                            className={
                              isTeam
                                ? "h-20 w-16 overflow-hidden rounded-lg border border-slate-200 bg-slate-50"
                                : "h-12 w-16 overflow-hidden rounded-lg border border-slate-200 bg-slate-50"
                            }
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={item.image_url}
                              alt={item.name}
                              className={
                                isTeam
                                  ? "h-full w-full object-cover object-top"
                                  : "h-full w-full object-contain"
                              }
                            />
                          </div>
                        </td>

                        <td className="px-5 py-4 font-medium text-slate-900">
                          {item.name}
                        </td>

                        {isTeam && (
                          <td className="px-5 py-4 text-slate-600">
                            {item.designation}
                          </td>
                        )}

                        <td className="px-5 py-4">
                          <span
                            className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                              active
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            {active ? "Active" : "Inactive"}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => editItem(item)}
                              className="rounded-lg border border-slate-300 px-3 py-2 font-medium text-slate-700 hover:bg-white"
                            >
                              Edit
                            </button>

                            <button
                              type="button"
                              onClick={() => void deleteItem(item)}
                              className="rounded-lg border border-red-200 px-3 py-2 font-medium text-red-700 hover:bg-red-50"
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
