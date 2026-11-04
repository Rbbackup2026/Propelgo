"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  disabled?: boolean;
  onUploadingChange?: (uploading: boolean) => void;
};

export default function ImageUploadField({
  value,
  onChange,
  label = "Upload image",
  disabled = false,
  onUploadingChange,
}: Props) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function upload(file?: File) {
    if (!file) return;

    setError("");

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
      setError("Image size must be no more than 5 MB.");
      return;
    }

    setUploading(true);
    onUploadingChange?.(true);

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
        throw new Error(result.message || "Unable to upload image.");
      }

      onChange(result.data.image_url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
      onUploadingChange?.(false);

      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  }

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-slate-700">
        {label}
      </label>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={(event) => upload(event.target.files?.[0])}
      />

      <div className="mt-2 flex flex-wrap items-center gap-3">
        <button
          type="button"
          disabled={disabled || uploading}
          onClick={() => inputRef.current?.click()}
          className="rounded-xl bg-teal-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {uploading ? "Uploading…" : value ? "Change image" : "Choose image"}
        </button>

        {value && (
          <button
            type="button"
            disabled={disabled || uploading}
            onClick={() => onChange("")}
            className="rounded-xl border border-slate-300 px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Remove
          </button>
        )}
      </div>

      <p className="mt-2 text-xs text-slate-500">
        JPG, PNG, WEBP or GIF. Maximum 5 MB.
      </p>

      {error && (
        <p role="alert" className="mt-2 text-sm text-red-600">
          {error}
        </p>
      )}

      {value && (
        <div className="mt-4 flex min-h-28 items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt="Selected image preview"
            className="max-h-28 max-w-full object-contain"
          />
        </div>
      )}
    </div>
  );
}