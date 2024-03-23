import prisma from "@/lib/prisma";
import { Brand } from "@prisma/client";
import { unstable_noStore as noStore } from "next/cache";

export async function GET() {
  noStore();
  const brands: Brand[] = await prisma.brand.findMany({
    orderBy: {
      id: "asc",
    },
  });

  return Response.json(brands);
}
