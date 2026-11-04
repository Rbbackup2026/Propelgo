
import {
  deleteTestimonial,
  updateTestimonial,
} from "@/lib/testimonials-api";

export const runtime = "nodejs";

type Context = {
  params: Promise<{ id: string }>;
};

export async function PUT(request: Request, context: Context) {
  return updateTestimonial(request, context);
}

export async function DELETE(_request: Request, context: Context) {
  return deleteTestimonial(context);
}
