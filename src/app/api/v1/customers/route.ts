import prisma from "@/lib/prisma";
import { Customer } from "@prisma/client";
import { unstable_noStore as noStore, revalidatePath } from "next/cache";

export async function GET() {
  noStore();
  const customers: Customer[] = await prisma.customer.findMany({
    orderBy: {
      id: "asc",
    },
  });

  return Response.json(customers);
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
