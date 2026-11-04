
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function logout() {
    setLoading(true);

    try {
      const response = await fetch("/api/admin/logout", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Logout failed");
      }

      router.replace("/admin");
      router.refresh();
    } catch {
      setLoading(false);
      window.alert("Unable to log out. Please try again.");
    }
  }

  return (
    <button
      type="button"
      onClick={logout}
      disabled={loading}
      className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
    >
      {loading ? "Signing out..." : "Sign out"}
    </button>
  );
}
