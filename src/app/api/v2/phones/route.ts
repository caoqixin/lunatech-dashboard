import prisma from "@/lib/prisma";
import { unstable_noStore as noStore, revalidatePath } from "next/cache";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  noStore();
  const params = req.nextUrl.searchParams;
  const name = params.get("name") ?? "";

  const phones = await prisma.phone.findMany({
    where: {
      name: {
        contains: name,
        mode: "insensitive",
      },
    },
    select: {
      name: true,
      id: true,
    },
  });

  return Response.json(phones);
}
