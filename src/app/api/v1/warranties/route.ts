import prisma from "@/lib/prisma";
import { unstable_noStore as noStore } from "next/cache";
import { type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  noStore();
  const query = request.nextUrl.searchParams;
  const per_page = Number(query.get("per_page")) ?? 10;
  const page = Number(query.get("page")) ?? 1;
  const skip = (page - 1) * per_page;
  const contact_tel = query.get("contact_tel") ?? "";

  const warranties = await prisma.warranty.findMany({
    orderBy: {
      createdAt: "desc",
    },
    where: {
      isRework: { not: true },
      repair: {
        customer: {
          tel: {
            contains: contact_tel,
          },
        },
      },
    },
    include: {
      repair: {
        include: {
          customer: true,
        },
      },
    },
    take: per_page,
    skip: skip,
  });

  const total = await prisma.warranty.count({
    where: {
      isRework: { not: true },
    },
  });
  const pageCount = Math.ceil(total / per_page);

  return Response.json({ warranties, pageCount });
}
