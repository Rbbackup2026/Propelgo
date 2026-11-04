
import { NextResponse } from "next/server";
import { destroyAdminSession } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST() {
  await destroyAdminSession();

  return NextResponse.json({
    success: true,
    message: "Logged out successfully.",
  });
}
