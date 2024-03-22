import prisma from "@/lib/prisma";
import { unstable_noStore as noStore, revalidatePath } from "next/cache";

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

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  noStore();

  const { id } = params;
  const {
    code,
    name,
    alias,
    brand,
    model,
    quality,
    category,
    supplier,
    stock,
    purchase_price,
    public_price,
  } = await req.json();

  try {
    await prisma.component.update({
      where: {
        id: parseInt(id),
      },
      data: {
        code: code,
        name: name,
        alias: alias,
        brand: brand,
        model: model,
        quality: quality,
        category: category,
        supplier: supplier,
        stock: parseInt(stock),
        purchase_price: purchase_price,
        public_price: public_price,
      },
    });
    revalidatePath("/dashboard/components");
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
    await prisma.component.delete({
      where: {
        id: parseInt(id),
      },
    });
    revalidatePath("/dashboard/components");
    return Response.json({ msg: "删除成功", status: "success" });
  } catch (error) {
    return Response.json({ msg: "删除失败", status: "error" });
  }
}
