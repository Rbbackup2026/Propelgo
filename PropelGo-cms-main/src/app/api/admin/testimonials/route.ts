
import {
  createTestimonial,
  listTestimonials,
} from "@/lib/testimonials-api";

export const runtime = "nodejs";

export async function GET() {
  return listTestimonials();
}

export async function POST(request: Request) {
  return createTestimonial(request);
}
