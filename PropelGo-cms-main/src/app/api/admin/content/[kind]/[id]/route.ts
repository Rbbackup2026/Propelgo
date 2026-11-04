import {
  deleteContent,
  getContent,
  updateContent,
} from "@/lib/admin-content-api";

export const runtime = "nodejs";

type Context = {
  params: Promise<{ kind: string; id: string }>;
};

export async function GET(request: Request, context: Context) {
  const { kind } = await context.params;
  return getContent(kind, context);
}

export async function PUT(request: Request, context: Context) {
  const { kind } = await context.params;
  return updateContent(kind, request, context);
}

export async function DELETE(request: Request, context: Context) {
  const { kind } = await context.params;
  return deleteContent(kind, context);
}