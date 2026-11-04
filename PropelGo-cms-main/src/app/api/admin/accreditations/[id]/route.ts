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
  return getEntity("accreditations", context);
}

export async function PUT(request: Request, context: Context) {
  return updateEntity("accreditations", request, context);
}

export async function DELETE(request: Request, context: Context) {
  return deleteEntity("accreditations", context);
}