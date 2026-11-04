import { redirect } from "next/navigation";
import AdminLoginForm from "@/components/AdminLoginForm";
import { getAdminSession } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  if (await getAdminSession()) {
    redirect("/admin/dashboard");
  }

  return <AdminLoginForm />;
}
