import prisma from "@/lib/prisma";
import { Brand } from "@prisma/client";
import { unstable_noStore as noStore, revalidatePath } from "next/cache";
import { type NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  noStore();
  const params = req.nextUrl.searchParams;
  const per_page = Number(params.get("per_page")) ?? 10;
  const page = Number(params.get("page")) ?? 1;
  const name = params.get("name") ?? "";

  const skip = (page - 1) * per_page;

  const brands: Brand[] = await prisma.brand.findMany({
    orderBy: {
      id: "asc",
    },
    where: {
      name: {
        contains: name,
        mode: "insensitive",
      },
    },
    take: per_page,
    skip: skip,
  });

  const total = await prisma.brand.count();

  const pageCount = Math.ceil(total / per_page);

  return Response.json({ brands, pageCount });
}

export async function POST(req: Request) {
  noStore();
  const { name } = await req.json();

  try {
    await prisma.brand.create({
      data: {
        name: name,
      },
    });
    revalidatePath("/dashboard/phones");
    return Response.json({ msg: "创建成功", status: "success" });
  } catch (error) {
    return Response.json({ msg: "创建失败", status: "error" });
  }
}
