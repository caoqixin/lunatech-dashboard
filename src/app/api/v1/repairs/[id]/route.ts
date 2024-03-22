import prisma from "@/lib/prisma";
import { unstable_noStore as noStore, revalidatePath } from "next/cache";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  const repair = await prisma.repair.findFirst({
    where: {
      id: parseInt(id),
    },
    include: {
      customer: true,
    },
  });

  return Response.json(repair);
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const { phone, problem, status, deposit, price, name, tel, email, isRework } =
    await req.json();

  try {
    await prisma.repair.update({
      where: {
        id: parseInt(id),
      },
      data: {
        phone: phone,
        problem: problem,
        status: status,
        deposit: deposit,
        price: price,
        customer: {
          update: {
            data: {
              name: name,
              tel: tel,
              email: email,
            },
          },
        },
      },
    });

    if (isRework && status == "已取件") {
      try {
        await prisma.repair.update({
          where: {
            id: parseInt(id),
          },
          data: {
            isRework: false,
            warranty: {
              update: {
                data: {
                  isRework: false,
                  reworkCount: {
                    increment: 1,
                  },
                },
              },
            },
          },
        });
        revalidatePath("/dashboard/repairs");
        return Response.json({
          msg: `成功取机, 当前手机已完成保修, 当前的维修状态为${status}`,
          status: "success",
        });
      } catch (error) {
        return Response.json({ msg: "取机失败, 请重试", status: "error" });
      }
    }

    if (status == "已取件") {
      try {
        await prisma.warranty.create({
          data: {
            days: 90,
            repair: {
              connect: {
                id: parseInt(id),
              },
            },
          },
        });
        revalidatePath("/dashboard/repairs");
        return Response.json({
          msg: `成功取机, 可前往保修页面查看保修状态`,
          status: "success",
        });
      } catch (error) {
        return Response.json({ msg: "取机失败, 请重试", status: "error" });
      }
    }
    revalidatePath("/dashboard/repairs");
    revalidatePath("/dashboard/customers");
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
    await prisma.repair.delete({
      where: {
        id: parseInt(id),
      },
    });
    revalidatePath("/dashboard/repairs");
    return Response.json({ msg: "删除成功", status: "success" });
  } catch (error) {
    return Response.json({ msg: "删除失败", status: "error" });
  }
}
