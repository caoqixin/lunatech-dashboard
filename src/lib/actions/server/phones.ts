"use server";
import { unstable_noStore as noStore, revalidatePath } from "next/cache";
import { DataReturnType } from "@/lib/definitions";
import prisma from "@/lib/prisma";
import { searchPhoneParamsValue } from "@/schemas/search-params-schema";
import { Phone } from "@prisma/client";
import { phoneSchamaValue } from "@/schemas/brand-schema";

export async function getPhonesById(
  brandId: number,
  searchParams: searchPhoneParamsValue
): Promise<{ pageCount: number; items: Phone[] }> {
  noStore();

  const { per_page, page, name } = searchParams;
  const skip = (page - 1) * per_page;

  const [items, total] = await prisma.$transaction([
    prisma.phone.findMany({
      where: {
        brandId,
        name: {
          contains: name,
          mode: "insensitive",
        },
      },
      orderBy: {
        id: "asc",
      },
      take: per_page,
      skip: skip,
    }),
    prisma.phone.count({
      where: {
        brandId,
        name: {
          contains: name,
          mode: "insensitive",
        },
      },
    }),
  ]);

  const pageCount = Math.ceil(total / per_page);

  return { items, pageCount };
}

export async function createPhone(
  brandId: number,
  values: phoneSchamaValue
): Promise<DataReturnType> {
  const { name, isTablet, code } = values;
  try {
    await prisma.brand.update({
      where: {
        id: brandId,
      },
      data: {
        phones: {
          create: {
            name,
            isTablet,
            code,
          },
        },
      },
      include: {
        phones: true,
      },
    });
    revalidatePath("/dashboard/phones/[brandId]", "page");
    return { msg: `手机型号 [${name}] 添加成功`, status: "success" };
  } catch (error) {
    return { msg: `手机型号 [${name}] 添加失败, 请重试`, status: "error" };
  }
}

export async function updatePhone(
  id: number,
  data: phoneSchamaValue
): Promise<DataReturnType> {
  const { name, isTablet, code } = data;

  try {
    await prisma.phone.update({
      where: {
        id,
      },
      data: {
        name,
        isTablet,
        code,
      },
    });
    revalidatePath("/dashboard/phones/[brandId]", "page");
    return {
      msg: `修改成功`,
      status: "success",
    };
  } catch (error) {
    return {
      msg: `修改失败, 请重试`,
      status: "error",
    };
  }
}
export async function deletePhone(
  id: number,
  name: string
): Promise<DataReturnType> {
  try {
    await prisma.phone.delete({
      where: {
        id,
      },
    });

    revalidatePath("/dashboard/phones/[brandId]", "page");
    return { msg: `手机型号 [${name}] 删除成功`, status: "success" };
  } catch (error) {
    return { msg: `手机型号 [${name}] 删除失败`, status: "error" };
  }
}
