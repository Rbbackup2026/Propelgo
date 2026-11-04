import {
  createEntity,
  listEntities,
} from "@/lib/admin-entity-api";

export const runtime = "nodejs";

export async function GET() {
  return listEntities("accreditations");
}

export async function POST(request: Request) {
  return createEntity("accreditations", request);
}