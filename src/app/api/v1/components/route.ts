import { components } from "@/lib/placeholder-data";

export async function GET() {
  const data = components;

  return Response.json({ data });
}
