
import { NextResponse } from "next/server";
import { z } from "zod";
import { query } from "@/lib/db";
import { getAdminSession } from "@/lib/auth";

export const runtime = "nodejs";

const statisticSchema = z.object({
  label: z.string().trim().min(1).max(191),
  stat_value: z.string().trim().min(1).max(191),
  description: z.string().trim().max(5000).optional().default(""),
  icon: z.string().trim().max(100).optional().default(""),
  display_order: z.coerce.number().int().min(0).max(100000).default(0),
  is_active: z.boolean().default(true),
});

export async function GET() {
  try {
    if (!(await getAdminSession())) {
      return NextResponse.json(
        { success: false, message: "Unauthorized." },
        { status: 401 },
      );
    }

    const statistics = await query(
      `SELECT id, label, stat_value, description, icon,
              display_order, is_active, created_at, updated_at
       FROM site_statistics
       ORDER BY display_order ASC, id DESC`,
    );

    return NextResponse.json({ success: true, data: statistics });
  } catch (error) {
    console.error("Fetch statistics failed:", error);
    return NextResponse.json(
      { success: false, message: "Unable to fetch statistics." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    if (!(await getAdminSession())) {
      return NextResponse.json(
        { success: false, message: "Unauthorized." },
        { status: 401 },
      );
    }

    const body: unknown = await request.json();
    const parsed = statisticSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Please check the statistic details.",
          errors: parsed.error.flatten(),
        },
        { status: 400 },
      );
    }

    const item = parsed.data;

    const result = await query<{ insertId: number }>(
      `INSERT INTO site_statistics
       (label, stat_value, description, icon, display_order, is_active)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        item.label,
        item.stat_value,
        item.description || null,
        item.icon || null,
        item.display_order,
        item.is_active,
      ],
    );

    return NextResponse.json(
      {
        success: true,
        message: "Statistic created successfully.",
        id: Number(result.insertId),
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Create statistic failed:", error);
    return NextResponse.json(
      { success: false, message: "Unable to create statistic." },
      { status: 500 },
    );
  }
}
