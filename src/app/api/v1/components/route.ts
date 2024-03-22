import prisma from "@/lib/prisma";
import { unstable_noStore as noStore, revalidatePath } from "next/cache";

export async function GET() {
  noStore();
  const components = await prisma.component.findMany({
    orderBy: {
      id: "asc",
    },
  });

  return Response.json(components);
}

export async function POST(req: Request) {
  noStore();

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
    await prisma.component.create({
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
    return Response.json({ msg: "创建成功", status: "success" });
  } catch (error) {
    return Response.json({ msg: "创建失败", status: "error" });
  }
}
