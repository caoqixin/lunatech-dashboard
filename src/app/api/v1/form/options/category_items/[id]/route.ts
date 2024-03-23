import prisma from "@/lib/prisma";
import { unstable_noStore as noStore, revalidatePath } from "next/cache";
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  noStore();
  const id = params.id;

  const items = await prisma.categoryItem.findMany({
    where: {
      categoryId: parseInt(id),
    },
    orderBy: {
      id: "asc",
    },
  });

  return Response.json(items);
}
