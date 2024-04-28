import prisma from "@/lib/prisma";
import { unstable_noStore as noStore, revalidatePath } from "next/cache";
import { type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  noStore();
  const query = request.nextUrl.searchParams;
  const per_page = Number(query.get("per_page")) ?? 10;
  const page = Number(query.get("page")) ?? 1;
  const skip = (page - 1) * per_page;
  const name = query.get("name") ?? "";
  const category = query.get("category")?.split(".") ?? [];

  if (category.length !== 0) {
    const components = await prisma.component.findMany({
      orderBy: {
        id: "asc",
      },
      where: {
        category: {
          in: category,
        },
        OR: [
          {
            name: {
              contains: name,
              mode: "insensitive",
            },
          },
          {
            code: {
              contains: name,
              mode: "insensitive",
            },
          },
        ],
      },
      skip,
      take: per_page,
    });

    const total = await prisma.component.count({
      where: {
        category: {
          in: category,
        },
        OR: [
          {
            name: {
              contains: name,
              mode: "insensitive",
            },
          },
          {
            code: {
              contains: name,
              mode: "insensitive",
            },
          },
        ],
      },
    });
    const pageCount = Math.ceil(total / per_page);

    return Response.json({ components, pageCount });
  } else {
    const components = await prisma.component.findMany({
      orderBy: {
        id: "asc",
      },
      where: {
        OR: [
          {
            name: {
              contains: name,
              mode: "insensitive",
            },
          },
          {
            code: {
              contains: name,
              mode: "insensitive",
            },
          },
        ],
      },
      skip,
      take: per_page,
    });

    const total = await prisma.component.count({
      where: {
        OR: [
          {
            name: {
              contains: name,
              mode: "insensitive",
            },
          },
          {
            code: {
              contains: name,
              mode: "insensitive",
            },
          },
        ],
      },
    });
    const pageCount = Math.ceil(total / per_page);

    return Response.json({ components, pageCount });
  }
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
