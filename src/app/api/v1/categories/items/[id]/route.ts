import prisma from "@/lib/prisma";
import { unstable_noStore as noStore, revalidatePath } from "next/cache";
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  noStore();

  const { id } = params;
  const { name } = await req.json();
  console.log(id, name);

  try {
    const updatedData = await prisma.categoryItem.update({
      where: {
        id: parseInt(id),
      },
      data: {
        name: name,
      },
    });
    revalidatePath(`/dashboard/categories/${updatedData.categoryId}`);
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
    const current = await prisma.categoryItem.findFirst({
      where: {
        id: parseInt(id),
      },
    });
    await prisma.categoryItem.delete({
      where: {
        id: parseInt(id),
      },
    });
    revalidatePath(`/dashboard/categories/${current?.categoryId}`);
    return Response.json({ msg: "删除成功", status: "success" });
  } catch (error) {
    return Response.json({ msg: "删除失败", status: "error" });
  }
}
