import prisma from "@/lib/prisma";
import { unstable_noStore as noStore, revalidatePath } from "next/cache";

// find by name
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  const data = await prisma.brand.findFirst({
    where: {
      name: id,
    },
    include: {
      phones: true,
    },
  });

  return Response.json(data?.phones);
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  noStore();

  const { id } = params;
  const { name, code, isTablet } = await req.json();

  try {
    const updatedData = await prisma.phone.update({
      where: {
        id: parseInt(id),
      },
      data: {
        name: name,
        code: code,
        isTablet: isTablet,
      },
    });
    revalidatePath(`/dashboard/phones/${updatedData.brandId}`);
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
    const current = await prisma.phone.findFirst({
      where: {
        id: parseInt(id),
      },
    });
    await prisma.phone.delete({
      where: {
        id: parseInt(id),
      },
    });
    revalidatePath(`/dashboard/phones/${current?.brandId}`);
    return Response.json({ msg: "删除成功", status: "success" });
  } catch (error) {
    return Response.json({ msg: "删除失败", status: "error" });
  }
}
