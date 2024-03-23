import prisma from "@/lib/prisma";
import { Supplier } from "@prisma/client";
import { unstable_noStore as noStore } from "next/cache";

export async function GET() {
  noStore();
  const suppliers: Supplier[] = await prisma.supplier.findMany({
    orderBy: {
      id: "asc",
    },
  });

  return Response.json(suppliers);
}
