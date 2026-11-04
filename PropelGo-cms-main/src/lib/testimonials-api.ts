
import { NextResponse } from "next/server";
import { z } from "zod";
import { query } from "@/lib/db";
import { getAdminSession } from "@/lib/auth";

const testimonialSchema = z.object({
  name: z.string().trim().min(1).max(191),
  designation: z.string().trim().min(1).max(191),
  photo_url: z.string().trim().min(1).max(2048),
  review: z.string().trim().min(1).max(10000),
  display_order: z.coerce.number().int().min(0).max(100000).default(0),
  is_active: z.boolean().default(true),
});

type RouteContext = {
  params: Promise<{ id: string }>;
};

function unauthorized() {
  return NextResponse.json(
    { success: false, message: "Please log in as an administrator." },
    { status: 401 },
  );
}

function getId(value: string): number | null {
  if (!/^[1-9]\d*$/.test(value)) return null;

  const id = Number(value);
  return Number.isSafeInteger(id) ? id : null;
}

export async function listTestimonials() {
  try {
    if (!(await getAdminSession())) return unauthorized();

    const rows = await query<Record<string, unknown>[]>(
      `SELECT id, name, designation, photo_url, review,
              display_order, is_active, created_at, updated_at
       FROM testimonials
       ORDER BY display_order ASC, id DESC`,
    );

    return NextResponse.json({ success: true, data: rows });
  } catch (error) {
    console.error("List testimonials failed:", error);

    return NextResponse.json(
      { success: false, message: "Unable to load testimonials." },
      { status: 500 },
    );
  }
}

export async function createTestimonial(request: Request) {
  try {
    if (!(await getAdminSession())) return unauthorized();

    const parsed = testimonialSchema.safeParse(await request.json());

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: "Please check the submitted details." },
        { status: 400 },
      );
    }

    const item = parsed.data;

    const result = await query<{ insertId: number }>(
      `INSERT INTO testimonials
       (name, designation, photo_url, review, display_order, is_active)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        item.name,
        item.designation,
        item.photo_url,
        item.review,
        item.display_order,
        item.is_active,
      ],
    );

    return NextResponse.json(
      {
        success: true,
        id: Number(result.insertId),
        message: "Testimonial created successfully.",
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Create testimonial failed:", error);

    return NextResponse.json(
      { success: false, message: "Unable to create testimonial." },
      { status: 500 },
    );
  }
}

export async function updateTestimonial(
  request: Request,
  context: RouteContext,
) {
  try {
    if (!(await getAdminSession())) return unauthorized();

    const { id: rawId } = await context.params;
    const id = getId(rawId);

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Invalid testimonial ID." },
        { status: 400 },
      );
    }

    const parsed = testimonialSchema.safeParse(await request.json());

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: "Please check the submitted details." },
        { status: 400 },
      );
    }

    const item = parsed.data;

    const result = await query<{ affectedRows: number }>(
      `UPDATE testimonials
       SET name = ?, designation = ?, photo_url = ?, review = ?,
           display_order = ?, is_active = ?,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [
        item.name,
        item.designation,
        item.photo_url,
        item.review,
        item.display_order,
        item.is_active,
        id,
      ],
    );

    if (result.affectedRows === 0) {
      const existing = await query<{ id: number }[]>(
        "SELECT id FROM testimonials WHERE id = ? LIMIT 1",
        [id],
      );

      if (!existing.length) {
        return NextResponse.json(
          { success: false, message: "Testimonial not found." },
          { status: 404 },
        );
      }
    }

    return NextResponse.json({
      success: true,
      message: "Testimonial updated successfully.",
    });
  } catch (error) {
    console.error("Update testimonial failed:", error);

    return NextResponse.json(
      { success: false, message: "Unable to update testimonial." },
      { status: 500 },
    );
  }
}

export async function deleteTestimonial(context: RouteContext) {
  try {
    if (!(await getAdminSession())) return unauthorized();

    const { id: rawId } = await context.params;
    const id = getId(rawId);

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Invalid testimonial ID." },
        { status: 400 },
      );
    }

    const result = await query<{ affectedRows: number }>(
      "DELETE FROM testimonials WHERE id = ?",
      [id],
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { success: false, message: "Testimonial not found." },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Testimonial deleted successfully.",
    });
  } catch (error) {
    console.error("Delete testimonial failed:", error);

    return NextResponse.json(
      { success: false, message: "Unable to delete testimonial." },
      { status: 500 },
    );
  }
}
