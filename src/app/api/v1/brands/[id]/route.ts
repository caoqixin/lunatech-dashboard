import prisma from "@/lib/prisma";
import { unstable_noStore as noStore, revalidatePath } from "next/cache";

// 获取子分类
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  noStore();
  const id = params.id;

  const items = await prisma.phone.findMany({
    where: {
      brandId: parseInt(id),
    },
    orderBy: {
      id: "asc",
    },
  });

  return Response.json(items);
}

//创建子分类
export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  noStore();
  const id = params.id;
  const { name, code, isTablet } = await req.json();

  try {
    await prisma.brand.update({
      where: {
        id: parseInt(id),
      },
      data: {
        phones: {
          create: {
            name: name,
            code: code,
            isTablet: isTablet,
          },
        },
      },
      include: {
        phones: true,
      },
    });
    revalidatePath(`/dashboard/phones/${id}`);
    return Response.json({ msg: "创建成功", status: "success" });
  } catch (error) {
    return Response.json({ msg: "创建失败", status: "error" });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  noStore();

  const { id } = params;
  const { name } = await req.json();

  try {
    await prisma.brand.update({
      where: {
        id: parseInt(id),
      },
      data: {
        name: name,
      },
    });
    revalidatePath("/dashboard/phones");
    return Response.json({ msg: "更新成功", status: "success" });
  } catch (error) {
    return Response.json({ msg: "更新失败", status: "error" });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  noStore();

  const { id } = params;

  try {
    await prisma.brand.delete({
      where: {
        id: parseInt(id),
      },
    });
    revalidatePath("/dashboard/phones");
    return Response.json({ msg: "删除成功", status: "success" });
  } catch (error) {
    return Response.json({ msg: "删除失败", status: "error" });
  }
}
