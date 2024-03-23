import prisma from "@/lib/prisma";
import { Category } from "@prisma/client";
import { unstable_noStore as noStore, revalidatePath } from "next/cache";
import { type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  noStore();
  const query = request.nextUrl.searchParams;
  const per_page = Number(query.get("per_page")) ?? 10;
  const page = Number(query.get("page")) ?? 1;
  const skip = (page - 1) * per_page;

  const categories: Category[] = await prisma.category.findMany({
    orderBy: {
      id: "asc",
    },
    take: per_page,
    skip: skip,
  });
  const total = await prisma.category.count();
  const pageCount = Math.ceil(total / per_page);
  return Response.json({ categories, pageCount });
}

export async function POST(req: Request) {
  noStore();
  const { name } = await req.json();

  try {
    await prisma.category.create({
      data: {
        name: name,
      },
    });
    revalidatePath("/dashboard/categories");
    return Response.json({ msg: "创建成功", status: "success" });
  } catch (error) {
    return Response.json({ msg: "创建失败", status: "error" });
  }
}
