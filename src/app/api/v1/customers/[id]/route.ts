import prisma from "@/lib/prisma";
import { unstable_noStore as noStore, revalidatePath } from "next/cache";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  noStore();
  const id = params.id;

  const data = await prisma.customer.findUnique({
    where: {
      id: parseInt(id),
    },
    include: {
      repairs: true,
    },
  });

  return Response.json(data);
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  noStore();

  const { id } = params;
  const { name, tel, email } = await req.json();

  try {
    await prisma.customer.update({
      where: {
        id: parseInt(id),
      },
      data: {
        name: name,
        tel: tel,
        email: email,
      },
    });
    revalidatePath("/dashboard/customers");
    return Response.json({ msg: "更新成功", status: "success" });
  } catch (error) {
    return Response.json({ msg: "更新失败", status: "error" });
  }
}
