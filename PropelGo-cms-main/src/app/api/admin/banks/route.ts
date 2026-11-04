import {
  createEntity,
  listEntities,
} from "@/lib/admin-entity-api";

export const runtime = "nodejs";

export async function GET() {
  return listEntities("banks");
}

export async function POST(request: Request) {
  return createEntity("banks", request);
}