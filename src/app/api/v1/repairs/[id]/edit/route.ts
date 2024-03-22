import prisma from "@/lib/prisma";
import { unstable_noStore as noStore, revalidatePath } from "next/cache";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  noStore();
  const { id } = params;

  const repair = await prisma.repair.findFirst({
    where: {
      id: parseInt(id),
    },
    include: {
      customer: true,
    },
  });

  return Response.json(repair);
}
