import prisma from "@/lib/prisma";
import { Category } from "@prisma/client";
import { unstable_noStore as noStore } from "next/cache";

export async function GET() {
  noStore();
  const categories: Category[] = await prisma.category.findMany({
    orderBy: {
      id: "asc",
    },
  });

  return Response.json(categories);
}
