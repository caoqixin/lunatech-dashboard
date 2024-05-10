"use server";
import { unstable_noStore as noStore, revalidatePath } from "next/cache";
import { DataReturnType } from "@/lib/definitions";
import prisma from "@/lib/prisma";
import { searchPhoneParamsValue } from "@/schemas/search-params-schema";
import { Brand } from "@prisma/client";
import { brandSchamaValue } from "@/schemas/brand-schema";

export async function getBrandById(id: number): Promise<Brand | null> {
  noStore();

  const brand = await prisma.brand.findUnique({
    where: {
      id,
    },
  });

  return brand;
}

export async function generateBrandIdParams(): Promise<Brand[]> {
  return await prisma.brand.findMany();
}

export async function getAllBrands(
  searchParams: searchPhoneParamsValue
): Promise<{ pageCount: number; brands: Brand[] }> {
  noStore();
  const { page, per_page, name } = searchParams;
  const skip = (page - 1) * per_page;

  const [brands, total] = await prisma.$transaction([
    prisma.brand.findMany({
      orderBy: {
        id: "asc",
      },
      where: {
        name: {
          contains: name,
          mode: "insensitive",
        },
      },
      take: per_page,
      skip: skip,
    }),
    prisma.brand.count({
      where: {
        name: {
          contains: name,
          mode: "insensitive",
        },
      },
    }),
  ]);

  const pageCount = Math.ceil(total / per_page);

  return { brands, pageCount };
}

export async function createBrand(
  data: brandSchamaValue
): Promise<DataReturnType> {
  try {
    await prisma.brand.create({
      data,
    });
    revalidatePath("/dashboard/phones");
    return { msg: "品牌添加成功", status: "success" };
  } catch (error) {
    return { msg: "品牌添加失败, 请重试", status: "error" };
  }
}
export async function updateBrand(
  id: number,
  data: brandSchamaValue
): Promise<DataReturnType> {
  try {
    await prisma.brand.update({
      where: {
        id,
      },
      data,
    });
    revalidatePath("/dashboard/phones");
    return { msg: "修改成功", status: "success" };
  } catch (error) {
    return { msg: "修改失败, 请重试", status: "error" };
  }
}
export async function deleteBrand(id: number): Promise<DataReturnType> {
  try {
    await prisma.brand.delete({
      where: {
        id,
      },
    });
    revalidatePath("/dashboard/phones");
    return { msg: "删除成功", status: "success" };
  } catch (error) {
    return { msg: "删除失败", status: "error" };
  }
}
