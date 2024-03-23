import prisma from "@/lib/prisma";
import { Customer } from "@prisma/client";
import { unstable_noStore as noStore, revalidatePath } from "next/cache";
import { type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  noStore();
  const query = request.nextUrl.searchParams;
  const per_page = Number(query.get("per_page")) ?? 10;
  const page = Number(query.get("page")) ?? 1;
  const skip = (page - 1) * per_page;
  const tel = query.get("tel") ?? "";

  const customers: Customer[] = await prisma.customer.findMany({
    orderBy: {
      id: "asc",
    },
    where: {
      tel: {
        contains: tel,
      },
    },
    take: per_page,
    skip: skip,
  });
  const total = await prisma.customer.count();
  const pageCount = Math.ceil(total / per_page);
  return Response.json({ customers, pageCount });
}

export async function POST(req: Request) {
  noStore();
  const { name, tel, email } = await req.json();

  try {
    await prisma.customer.create({
      data: {
        name: name,
        tel: tel,
        email: email,
      },
    });
    revalidatePath("/dashboard/customers");
    return Response.json({ msg: "创建成功", status: "success" });
  } catch (error) {
    return Response.json({ msg: "创建失败", status: "error" });
  }
}
