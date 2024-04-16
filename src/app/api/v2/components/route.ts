import { Preventivo } from "@/lib/definitions";
import prisma from "@/lib/prisma";
import { unstable_noStore as noStore } from "next/cache";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  noStore();
  const { model } = await req.json();

  const components = await prisma.component.findMany({
    where: {
      model: {
        has: model,
      },
    },
    select: {
      id: true,
      name: true,
      category: true,
      quality: true,
      supplier: true,
      stock: true,
      public_price: true,
    },
  });

  if (components.length === 0) {
    return Response.json({
      msg: "找不到该手机型号的价格, 过段时间再试",
      status: "error",
    });
  }

  const newComponents: Preventivo[] = [];

  for (const component of components) {
    const supplier = await prisma.supplier.findUnique({
      where: {
        name: component.supplier,
      },
      select: {
        name: true,
        site: true,
      },
    });

    newComponents.push({
      id: component.id,
      name: component.name,
      category: component.category,
      stock: component.stock,
      quality: component.quality,
      public_price: component.public_price,
      supplier: supplier ?? component.supplier,
    });
  }

  return Response.json({ components: newComponents });
}
