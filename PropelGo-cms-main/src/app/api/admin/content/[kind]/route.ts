import {
  createContent,
  listContent,
} from "@/lib/admin-content-api";

export const runtime = "nodejs";

type Context = {
  params: Promise<{ kind: string }>;
};

export async function GET(_request: Request, context: Context) {
  const { kind } = await context.params;
  return listContent(kind);
}

export async function POST(request: Request, context: Context) {
  const { kind } = await context.params;
  return createContent(kind, request);
}