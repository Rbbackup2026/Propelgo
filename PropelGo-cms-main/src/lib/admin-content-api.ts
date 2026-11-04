import { NextResponse } from "next/server";
import { z } from "zod";
import { query } from "@/lib/db";
import { getAdminSession } from "@/lib/auth";

type Kind = "articles" | "team";

type Context = {
  params: Promise<{ kind: string; id: string }>;
};

const schema = z.object({
  name: z.string().trim().min(1).max(191),
  designation: z.string().trim().max(191).optional().default(""),
  image_url: z.string().trim().min(1).max(2048),
  description: z.string().trim().max(10000).optional().default(""),
  display_order: z.coerce.number().int().min(0).max(100000).default(0),
  is_active: z.boolean().default(true),
});

function getKind(value: string): Kind | null {
  return value === "articles" || value === "team" ? value : null;
}

function getId(value: string): number | null {
  if (!/^[1-9]\d*$/.test(value)) return null;

  const id = Number(value);
  return Number.isSafeInteger(id) ? id : null;
}

function tableFor(kind: Kind) {
  return kind === "articles" ? "articles" : "team_members";
}

function fieldsFor(kind: Kind) {
  return kind === "articles"
    ? "id, name, image_url, description, display_order, is_active, created_at, updated_at"
    : "id, name, designation, image_url, description, display_order, is_active, created_at, updated_at";
}

function unauthorized() {
  return NextResponse.json(
    { success: false, message: "Please log in as an administrator." },
    { status: 401 },
  );
}

export async function listContent(rawKind: string) {
  const kind = getKind(rawKind);

  if (!kind) {
    return NextResponse.json(
      { success: false, message: "Invalid content section." },
      { status: 404 },
    );
  }

  try {
    if (!(await getAdminSession())) return unauthorized();

    const rows = await query<Record<string, unknown>[]>(
      `SELECT ${fieldsFor(kind)}
       FROM ${tableFor(kind)}
       ORDER BY display_order ASC, id DESC`,
    );

    return NextResponse.json({ success: true, data: rows });
  } catch (error) {
    console.error("List content failed:", error);

    return NextResponse.json(
      { success: false, message: "Unable to load records. Check the database tables." },
      { status: 500 },
    );
  }
}

export async function createContent(rawKind: string, request: Request) {
  const kind = getKind(rawKind);

  if (!kind) {
    return NextResponse.json(
      { success: false, message: "Invalid content section." },
      { status: 404 },
    );
  }

  try {
    if (!(await getAdminSession())) return unauthorized();

    const parsed = schema.safeParse(await request.json());

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Please check the submitted details.",
          errors: parsed.error.flatten(),
        },
        { status: 400 },
      );
    }

    const item = parsed.data;

    if (kind === "articles") {
      const result = await query<{ insertId: number }>(
        `INSERT INTO articles
         (name, image_url, description, display_order, is_active)
         VALUES (?, ?, ?, ?, ?)`,
        [
          item.name,
          item.image_url,
          item.description || null,
          item.display_order,
          item.is_active,
        ],
      );

      return NextResponse.json(
        { success: true, id: Number(result.insertId) },
        { status: 201 },
      );
    }

    if (!item.designation.trim()) {
      return NextResponse.json(
        { success: false, message: "Designation is required." },
        { status: 400 },
      );
    }

    const result = await query<{ insertId: number }>(
      `INSERT INTO team_members
       (name, designation, image_url, description, display_order, is_active)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        item.name,
        item.designation.trim(),
        item.image_url,
        item.description || null,
        item.display_order,
        item.is_active,
      ],
    );

    return NextResponse.json(
      { success: true, id: Number(result.insertId) },
      { status: 201 },
    );
  } catch (error) {
    console.error("Create content failed:", error);

    return NextResponse.json(
      { success: false, message: "Unable to create record. Check the database table." },
      { status: 500 },
    );
  }
}

export async function getContent(rawKind: string, context: Context) {
  const kind = getKind(rawKind);

  if (!kind) {
    return NextResponse.json(
      { success: false, message: "Invalid content section." },
      { status: 404 },
    );
  }

  try {
    if (!(await getAdminSession())) return unauthorized();

    const { id: rawId } = await context.params;
    const id = getId(rawId);

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Invalid record ID." },
        { status: 400 },
      );
    }

    const rows = await query<Record<string, unknown>[]>(
      `SELECT ${fieldsFor(kind)}
       FROM ${tableFor(kind)}
       WHERE id = ?
       LIMIT 1`,
      [id],
    );

    if (!rows[0]) {
      return NextResponse.json(
        { success: false, message: "Record not found." },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error("Get content failed:", error);

    return NextResponse.json(
      { success: false, message: "Unable to load record." },
      { status: 500 },
    );
  }
}

export async function updateContent(
  rawKind: string,
  request: Request,
  context: Context,
) {
  const kind = getKind(rawKind);

  if (!kind) {
    return NextResponse.json(
      { success: false, message: "Invalid content section." },
      { status: 404 },
    );
  }

  try {
    if (!(await getAdminSession())) return unauthorized();

    const { id: rawId } = await context.params;
    const id = getId(rawId);

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Invalid record ID." },
        { status: 400 },
      );
    }

    const parsed = schema.safeParse(await request.json());

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Please check the submitted details.",
          errors: parsed.error.flatten(),
        },
        { status: 400 },
      );
    }

    const item = parsed.data;
    let result: { affectedRows: number };

    if (kind === "articles") {
      result = await query<{ affectedRows: number }>(
        `UPDATE articles
         SET name = ?, image_url = ?, description = ?,
             display_order = ?, is_active = ?,
             updated_at = CURRENT_TIMESTAMP
         WHERE id = ?`,
        [
          item.name,
          item.image_url,
          item.description || null,
          item.display_order,
          item.is_active,
          id,
        ],
      );
    } else {
      if (!item.designation.trim()) {
        return NextResponse.json(
          { success: false, message: "Designation is required." },
          { status: 400 },
        );
      }

      result = await query<{ affectedRows: number }>(
        `UPDATE team_members
         SET name = ?, designation = ?, image_url = ?, description = ?,
             display_order = ?, is_active = ?,
             updated_at = CURRENT_TIMESTAMP
         WHERE id = ?`,
        [
          item.name,
          item.designation.trim(),
          item.image_url,
          item.description || null,
          item.display_order,
          item.is_active,
          id,
        ],
      );
    }

    if (result.affectedRows === 0) {
      const existing = await query<{ id: number }[]>(
        `SELECT id FROM ${tableFor(kind)} WHERE id = ? LIMIT 1`,
        [id],
      );

      if (!existing.length) {
        return NextResponse.json(
          { success: false, message: "Record not found." },
          { status: 404 },
        );
      }
    }

    return NextResponse.json({
      success: true,
      message: "Record updated successfully.",
    });
  } catch (error) {
    console.error("Update content failed:", error);

    return NextResponse.json(
      { success: false, message: "Unable to update record." },
      { status: 500 },
    );
  }
}

export async function deleteContent(rawKind: string, context: Context) {
  const kind = getKind(rawKind);

  if (!kind) {
    return NextResponse.json(
      { success: false, message: "Invalid content section." },
      { status: 404 },
    );
  }

  try {
    if (!(await getAdminSession())) return unauthorized();

    const { id: rawId } = await context.params;
    const id = getId(rawId);

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Invalid record ID." },
        { status: 400 },
      );
    }

    const result = await query<{ affectedRows: number }>(
      `DELETE FROM ${tableFor(kind)} WHERE id = ?`,
      [id],
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { success: false, message: "Record not found." },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Record deleted successfully.",
    });
  } catch (error) {
    console.error("Delete content failed:", error);

    return NextResponse.json(
      { success: false, message: "Unable to delete record." },
      { status: 500 },
    );
  }
}