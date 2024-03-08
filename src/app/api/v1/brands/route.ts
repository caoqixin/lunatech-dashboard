import { brands } from "@/lib/placeholder-data";

export async function GET() {
  const data = brands;

  return Response.json({ data });
}
