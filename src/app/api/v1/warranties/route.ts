import prisma from "@/lib/prisma";
import { unstable_noStore as noStore, revalidatePath } from "next/cache";

export async function GET() {
  noStore();
  const warranties = await prisma.warranty.findMany({
    orderBy: {
      id: "desc",
    },
    where: {
      isRework: { not: true },
    },
    include: {
      repair: {
        include: {
          customer: true,
        },
      },
    },
  });

  return Response.json(warranties);
}
