
import { NextResponse } from "next/server";
import { z } from "zod";
import { query } from "@/lib/db";
import { getAdminSession } from "@/lib/auth";

export const runtime = "nodejs";

type Context = {
  params: Promise<{ id: string }>;
};

const statisticSchema = z.object({
  label: z.string().trim().min(1).max(191),
  stat_value: z.string().trim().min(1).max(191),
  description: z.string().trim().max(5000).optional().default(""),
  icon: z.string().trim().max(100).optional().default(""),
  display_order: z.coerce.number().int().min(0).max(100000).default(0),
  is_active: z.boolean().default(true),
});

function validId(value: string): number | null {
  if (!/^[1-9]\d*$/.test(value)) return null;
  const id = Number(value);
  return Number.isSafeInteger(id) ? id : null;
}

async function authorized() {
  return Boolean(await getAdminSession());
}

export async function GET(_request: Request, context: Context) {
  try {
    if (!(await authorized())) {
      return NextResponse.json(
        { success: false, message: "Unauthorized." },
        { status: 401 },
      );
    }

    const { id: rawId } = await context.params;
    const id = validId(rawId);

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Invalid statistic ID." },
        { status: 400 },
      );
    }

    const rows = await query<Array<Record<string, unknown>>>(
      `SELECT id, label, stat_value, description, icon,
              display_order, is_active, created_at, updated_at
       FROM site_statistics WHERE id = ? LIMIT 1`,
      [id],
    );

    if (!rows[0]) {
      return NextResponse.json(
        { success: false, message: "Statistic not found." },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error("Fetch statistic failed:", error);
    return NextResponse.json(
      { success: false, message: "Unable to fetch statistic." },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request, context: Context) {
  try {
    if (!(await authorized())) {
      return NextResponse.json(
        { success: false, message: "Unauthorized." },
        { status: 401 },
      );
    }

    const { id: rawId } = await context.params;
    const id = validId(rawId);

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Invalid statistic ID." },
        { status: 400 },
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

    const result = await query<{ affectedRows: number }>(
      `UPDATE site_statistics
       SET label = ?, stat_value = ?, description = ?, icon = ?,
           display_order = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [
        item.label,
        item.stat_value,
        item.description || null,
        item.icon || null,
        item.display_order,
        item.is_active,
        id,
      ],
    );

    if (result.affectedRows === 0) {
      const exists = await query<Array<{ id: number }>>(
        "SELECT id FROM site_statistics WHERE id = ? LIMIT 1",
        [id],
      );

      if (!exists.length) {
        return NextResponse.json(
          { success: false, message: "Statistic not found." },
          { status: 404 },
        );
      }
    }

    return NextResponse.json({
      success: true,
      message: "Statistic updated successfully.",
    });
  } catch (error) {
    console.error("Update statistic failed:", error);
    return NextResponse.json(
      { success: false, message: "Unable to update statistic." },
      { status: 500 },
    );
  }
}

export async function DELETE(_request: Request, context: Context) {
  try {
    if (!(await authorized())) {
      return NextResponse.json(
        { success: false, message: "Unauthorized." },
        { status: 401 },
      );
    }

    const { id: rawId } = await context.params;
    const id = validId(rawId);

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Invalid statistic ID." },
        { status: 400 },
      );
    }

    const result = await query<{ affectedRows: number }>(
      "DELETE FROM site_statistics WHERE id = ?",
      [id],
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { success: false, message: "Statistic not found." },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Statistic deleted successfully.",
    });
  } catch (error) {
    console.error("Delete statistic failed:", error);
    return NextResponse.json(
      { success: false, message: "Unable to delete statistic." },
      { status: 500 },
    );
  }
}
