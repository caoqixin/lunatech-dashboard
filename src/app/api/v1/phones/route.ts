import { phones } from "@/lib/placeholder-data";

export async function GET() {
  const data = phones;

  return Response.json({ data });
}
