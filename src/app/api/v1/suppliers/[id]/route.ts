import prisma from "@/lib/prisma";
import { unstable_noStore as noStore, revalidatePath } from "next/cache";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  noStore();

  const { id } = params;
  const { name, description, username, site, password } = await req.json();

  try {
    await prisma.supplier.update({
      where: {
        id: parseInt(id),
      },
      data: {
        name: name,
        description: description,
        site: site,
        username: username,
        password: password,
      },
    });
    revalidatePath("/dashboard/suppliers");
    return Response.json({ msg: "更新成功", status: "success" });
  } catch (error) {
    return Response.json({ msg: "更新失败", status: "error" });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  noStore();

  const { id } = params;

  try {
    await prisma.supplier.delete({
      where: {
        id: parseInt(id),
      },
    });
    revalidatePath("/dashboard/suppliers");
    return Response.json({ msg: "删除成功", status: "success" });
  } catch (error) {
    return Response.json({ msg: "删除失败", status: "error" });
  }
}
