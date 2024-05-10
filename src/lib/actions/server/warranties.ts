"use server";
import { unstable_noStore as noStore, revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { searchWarrantyParamsValue } from "@/schemas/search-params-schema";
import { DataReturnType, WarrantyWithRepair } from "@/lib/definitions";

const select = {
  id: true,
  phone: true,
  problem: true,
  createdAt: true,
  customer: {
    select: {
      name: true,
      tel: true,
    },
  },
};

export async function getAllWarranties(
  searchParams: searchWarrantyParamsValue
): Promise<{ pageCount: number; warranties: WarrantyWithRepair[] }> {
  noStore();

  const { contact_tel, per_page, page } = searchParams;
  const skip = (page - 1) * per_page;

  const [warranties, total] = await prisma.$transaction([
    prisma.warranty.findMany({
      orderBy: {
        createdAt: "desc",
      },
      where: {
        isRework: { not: true },
        repair: {
          customer: {
            tel: {
              contains: contact_tel,
            },
          },
        },
      },
      include: {
        repair: {
          select,
        },
      },
      take: per_page,
      skip: skip,
    }),
    prisma.warranty.count({
      where: {
        isRework: { not: true },
        repair: {
          customer: {
            tel: {
              contains: contact_tel,
            },
          },
        },
      },
    }),
  ]);

  const pageCount = Math.ceil(total / per_page);

  return { warranties, pageCount };
}

export async function reworkWarranty(
  id: string,
  customerName: string,
  cutomerPhone: string
): Promise<DataReturnType> {
  try {
    await prisma.warranty.update({
      where: {
        id,
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
    return {
      msg: `${customerName}的${cutomerPhone}正在返修, 前往维修页面查看`,
      status: "success",
    };
  } catch (error) {
    return { msg: "返修失败, 请重试", status: "error" };
  }
}
