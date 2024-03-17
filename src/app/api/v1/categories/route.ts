import prisma from "@/lib/prisma";
import { Category } from "@prisma/client";
import { unstable_noStore as noStore, revalidatePath } from "next/cache";

export async function GET() {
  noStore();
  const categories: Category[] = await prisma.category.findMany({
    orderBy: {
      id: "asc",
    },
  });

  return Response.json(categories);
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
