import {
  deleteEntity,
  getEntity,
  updateEntity,
} from "@/lib/admin-entity-api";

export const runtime = "nodejs";

type Context = {
  params: Promise<{ id: string }>;
};

export async function GET(request: Request, context: Context) {
  return getEntity("banks", context);
}

export async function PUT(request: Request, context: Context) {
  return updateEntity("banks", request, context);
}

export async function DELETE(request: Request, context: Context) {
  return deleteEntity("banks", context);
}