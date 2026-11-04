import { NextResponse } from "next/server";
import { z } from "zod";
import { query } from "@/lib/db";
import { getAdminSession } from "@/lib/auth";

export type EntityKind = "banks" | "partners" | "accreditations";

type Context = {
  params: Promise<{ id: string }>;
};

const schema = z.object({
  name: z.string().trim().min(1).max(191),
  issuer: z.string().trim().max(191).optional().default(""),
  logo_url: z.string().trim().max(2048).optional().default(""),
  description: z.string().trim().max(5000).optional().default(""),
  display_order: z.coerce.number().int().min(0).max(100000).default(0),
  is_active: z.boolean().default(true),
});

function validId(value: string): number | null {
  if (!/^[1-9]\d*$/.test(value)) return null;

  const id = Number(value);
  return Number.isSafeInteger(id) ? id : null;
}

function columns(kind: EntityKind) {
  return kind === "accreditations"
    ? "id, name, issuer, logo_url, description, display_order, is_active, created_at, updated_at"
    : "id, name, logo_url, description, display_order, is_active, created_at, updated_at";
}

function unauthorized() {
  return NextResponse.json(
    { success: false, message: "Unauthorized. Please log in." },
    { status: 401 },
  );
}

export async function listEntities(kind: EntityKind) {
  try {
    if (!(await getAdminSession())) return unauthorized();

    const rows = await query<Record<string, unknown>[]>(
      `SELECT ${columns(kind)}
       FROM ${kind}
       ORDER BY display_order ASC, id DESC`,
    );

    return NextResponse.json({ success: true, data: rows });
  } catch (error) {
    console.error(`Fetch ${kind} failed:`, error);

    return NextResponse.json(
      { success: false, message: `Unable to fetch ${kind}.` },
      { status: 500 },
    );
  }
}

export async function createEntity(
  kind: EntityKind,
  request: Request,
) {
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

    const result =
      kind === "accreditations"
        ? await query<{ insertId: number }>(
            `INSERT INTO accreditations
             (name, issuer, logo_url, description, display_order, is_active)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [
              item.name,
              item.issuer || null,
              item.logo_url || null,
              item.description || null,
              item.display_order,
              item.is_active,
            ],
          )
        : await query<{ insertId: number }>(
            `INSERT INTO ${kind}
             (name, logo_url, description, display_order, is_active)
             VALUES (?, ?, ?, ?, ?)`,
            [
              item.name,
              item.logo_url || null,
              item.description || null,
              item.display_order,
              item.is_active,
            ],
          );

    return NextResponse.json(
      {
        success: true,
        message: `${kind} record created successfully.`,
        id: Number(result.insertId),
      },
      { status: 201 },
    );
  } catch (error) {
    console.error(`Create ${kind} failed:`, error);

    return NextResponse.json(
      { success: false, message: `Unable to create ${kind} record.` },
      { status: 500 },
    );
  }
}

export async function getEntity(
  kind: EntityKind,
  context: Context,
) {
  try {
    if (!(await getAdminSession())) return unauthorized();

    const { id: rawId } = await context.params;
    const id = validId(rawId);

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Invalid record ID." },
        { status: 400 },
      );
    }

    const rows = await query<Record<string, unknown>[]>(
      `SELECT ${columns(kind)}
       FROM ${kind}
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
    console.error(`Fetch ${kind} record failed:`, error);

    return NextResponse.json(
      { success: false, message: "Unable to fetch record." },
      { status: 500 },
    );
  }
}

export async function updateEntity(
  kind: EntityKind,
  request: Request,
  context: Context,
) {
  try {
    if (!(await getAdminSession())) return unauthorized();

    const { id: rawId } = await context.params;
    const id = validId(rawId);

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

    const result =
      kind === "accreditations"
        ? await query<{ affectedRows: number }>(
            `UPDATE accreditations
             SET name = ?, issuer = ?, logo_url = ?, description = ?,
                 display_order = ?, is_active = ?,
                 updated_at = CURRENT_TIMESTAMP
             WHERE id = ?`,
            [
              item.name,
              item.issuer || null,
              item.logo_url || null,
              item.description || null,
              item.display_order,
              item.is_active,
              id,
            ],
          )
        : await query<{ affectedRows: number }>(
            `UPDATE ${kind}
             SET name = ?, logo_url = ?, description = ?,
                 display_order = ?, is_active = ?,
                 updated_at = CURRENT_TIMESTAMP
             WHERE id = ?`,
            [
              item.name,
              item.logo_url || null,
              item.description || null,
              item.display_order,
              item.is_active,
              id,
            ],
          );

    if (result.affectedRows === 0) {
      const existing = await query<{ id: number }[]>(
        `SELECT id FROM ${kind} WHERE id = ? LIMIT 1`,
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
    console.error(`Update ${kind} failed:`, error);

    return NextResponse.json(
      { success: false, message: "Unable to update record." },
      { status: 500 },
    );
  }
}

export async function deleteEntity(
  kind: EntityKind,
  context: Context,
) {
  try {
    if (!(await getAdminSession())) return unauthorized();

    const { id: rawId } = await context.params;
    const id = validId(rawId);

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Invalid record ID." },
        { status: 400 },
      );
    }

    const result = await query<{ affectedRows: number }>(
      `DELETE FROM ${kind} WHERE id = ?`,
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
    console.error(`Delete ${kind} failed:`, error);

    return NextResponse.json(
      { success: false, message: "Unable to delete record." },
      { status: 500 },
    );
  }
}