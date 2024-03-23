import prisma from "@/lib/prisma";
import { Supplier } from "@prisma/client";
import { unstable_noStore as noStore, revalidatePath } from "next/cache";
import { type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  noStore();
  const query = request.nextUrl.searchParams;
  const per_page = Number(query.get("per_page")) ?? 10;
  const page = Number(query.get("page")) ?? 1;
  const skip = (page - 1) * per_page;
  const suppliers: Supplier[] = await prisma.supplier.findMany({
    orderBy: {
      id: "asc",
    },
    take: per_page,
    skip: skip,
  });

  const total = await prisma.supplier.count();
  const pageCount = Math.ceil(total / per_page);

  return Response.json({ suppliers, pageCount });
}

export async function POST(req: Request) {
  noStore();
  const { name, description, site, username, password } = await req.json();

  try {
    await prisma.supplier.create({
      data: {
        name: name,
        description: description,
        site: site,
        username: username,
        password: password,
      },
    });
    revalidatePath("/dashboard/suppliers");
    return Response.json({ msg: "创建成功", status: "success" });
  } catch (error) {
    return Response.json({ msg: "创建失败", status: "error" });
  }
}
