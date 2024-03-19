import prisma from "@/lib/prisma";
import { Supplier } from "@prisma/client";
import { unstable_noStore as noStore, revalidatePath } from "next/cache";

export async function GET() {
  noStore();
  const suppliers: Supplier[] = await prisma.supplier.findMany({
    orderBy: {
      id: "asc",
    },
  });

  return Response.json(suppliers);
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
