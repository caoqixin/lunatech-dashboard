import prisma from "@/lib/prisma";
import { unstable_noStore as noStore, revalidatePath } from "next/cache";
import { type NextRequest } from "next/server";

// 获取子分类
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  noStore();
  const id = params.id;

  const query = request.nextUrl.searchParams;
  const per_page = Number(query.get("per_page")) ?? 10;
  const page = Number(query.get("page")) ?? 1;
  const name = query.get("name") ?? "";

  const skip = (page - 1) * per_page;

  const items = await prisma.phone.findMany({
    where: {
      brandId: parseInt(id),
      name: {
        contains: name,
        mode: "insensitive",
      },
    },
    orderBy: {
      id: "asc",
    },
    take: per_page,
    skip: skip,
  });

  const total = await prisma.phone.count({
    where: {
      brandId: parseInt(id),
    },
  });
  const pageCount = Math.ceil(total / per_page);

  return Response.json({ items, pageCount });
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
            code: code ?? null,
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
    console.log(error);

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
