import prisma from "@/lib/prisma";
import { Repair } from "@prisma/client";
import { unstable_noStore as noStore, revalidatePath } from "next/cache";
import { type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  noStore();
  const query = request.nextUrl.searchParams;
  const per_page = Number(query.get("per_page")) ?? 10;
  const page = Number(query.get("page")) ?? 1;
  const skip = (page - 1) * per_page;

  const repairs: Repair[] = await prisma.repair.findMany({
    orderBy: {
      id: "desc",
    },
    where: {
      status: { not: "已取件" },
    },
    take: per_page,
    skip: skip,
  });

  const total = await prisma.customer.count();
  const pageCount = Math.ceil(total / per_page);
  revalidatePath("/dashboard/repairs");

  return Response.json({ repairs, pageCount });
}

export async function POST(req: Request) {
  const { phone, problem, status, deposit, price, name, tel, email } =
    await req.json();

  try {
    await prisma.customer.upsert({
      where: {
        tel: tel,
      },
      update: {
        repairs: {
          create: {
            phone: phone,
            problem: problem,
            status: status,
            deposit: deposit,
            price: price,
          },
        },
      },
      create: {
        name: name,
        tel: tel,
        email: email,
        repairs: {
          create: {
            phone: phone,
            problem: problem,
            status: status,
            deposit: deposit,
            price: price,
          },
        },
      },
    });
    revalidatePath("/dashboard/repairs");
    revalidatePath("/dashboard/customers");
    return Response.json({ msg: "创建成功", status: "success" });
  } catch (error) {
    return Response.json({ msg: "创建失败", status: "error" });
  }
}
