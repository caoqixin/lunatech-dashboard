import prisma from "@/lib/prisma";
import { unstable_noStore as noStore } from "next/cache";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  noStore();

  const { id } = params;

  const component = await prisma.component.findFirst({
    where: {
      id: parseInt(id),
    },
  });

  return Response.json(component);
}
