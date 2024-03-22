import prisma from "@/lib/prisma";
import { Repair } from "@prisma/client";
import { unstable_noStore as noStore, revalidatePath } from "next/cache";

export async function GET() {
  noStore();
  const repairs: Repair[] = await prisma.repair.findMany({
    orderBy: {
      id: "desc",
    },
    where: {
      status: { not: "已取件" },
    },
  });
  revalidatePath("/dashboard/repairs");

  return Response.json(repairs);
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
