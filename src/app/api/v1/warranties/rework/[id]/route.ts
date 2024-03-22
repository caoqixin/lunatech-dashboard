import prisma from "@/lib/prisma";
import { unstable_noStore as noStore, revalidatePath } from "next/cache";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  noStore();
  const { id } = params;

  try {
    await prisma.warranty.update({
      where: {
        id: id,
      },
      data: {
        isRework: true,
        repair: {
          update: {
            isRework: true,
            status: "返修中",
          },
        },
      },
    });
    revalidatePath("/dashboard/warranties");
    revalidatePath("/dashboard/repairs");
    return Response.json({ msg: "正在返修", status: "success" });
  } catch (error) {
    return Response.json({ msg: "返修失败, 请重试", status: "error" });
  }
}
