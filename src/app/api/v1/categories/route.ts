import { categories } from "@/lib/placeholder-data";

export async function GET() {
  const data = categories;

  return Response.json({ data });
}
