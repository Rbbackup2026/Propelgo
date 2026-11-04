
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { query } from "@/lib/db";
import { createAdminSession } from "@/lib/auth";

export const runtime = "nodejs";

const loginSchema = z.object({
  email: z.string().trim().email().max(191),
  password: z.string().min(1).max(200),
});

type AdminRow = {
  id: number;
  password_hash: string;
  is_active: number | boolean;
};

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: "Enter a valid email and password." },
        { status: 400 },
      );
    }

    const email = parsed.data.email.toLowerCase();
    const password = parsed.data.password;

    const admins = await query<AdminRow[]>(
      `SELECT id, password_hash, is_active
       FROM admin_users
       WHERE email = ?
       LIMIT 1`,
      [email],
    );

    const admin = admins[0];

    if (
      !admin ||
      !(await bcrypt.compare(password, admin.password_hash)) ||
      !Boolean(admin.is_active)
    ) {
      return NextResponse.json(
        { success: false, message: "Invalid email or password." },
        { status: 401 },
      );
    }

    await createAdminSession(Number(admin.id));

    return NextResponse.json({
      success: true,
      message: "Login successful.",
      redirectTo: "/admin/dashboard",
    });
  } catch (error) {
    console.error("Admin login failed:", error);

    return NextResponse.json(
      { success: false, message: "Unable to sign in right now." },
      { status: 500 },
    );
  }
}
