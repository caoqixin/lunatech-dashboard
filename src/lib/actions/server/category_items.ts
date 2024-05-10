"use server";

import { unstable_noStore as noStore, revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { searchParamsValue } from "@/schemas/search-params-schema";
import { CategoryItem } from "@prisma/client";
import { categoryItemValue } from "@/schemas/category-item-schema";
import { DataReturnType } from "@/lib/definitions";

export async function getCategoryItemsById(
  categoryId: number,
  searchParams: searchParamsValue
): Promise<{ pageCount: number; items: CategoryItem[] }> {
  noStore();

  const { per_page, page } = searchParams;
  const skip = (page - 1) * per_page;

  const [items, total] = await prisma.$transaction([
    prisma.categoryItem.findMany({
      where: {
        categoryId,
      },
      orderBy: {
        id: "asc",
      },
      take: per_page,
      skip: skip,
    }),
    prisma.categoryItem.count({
      where: {
        categoryId,
      },
    }),
  ]);

  const pageCount = Math.ceil(total / per_page);

  return { items, pageCount };
}

export async function createCategoryItem(
  categoryId: number,
  values: categoryItemValue
): Promise<DataReturnType> {
  const { name } = values;
  try {
    await prisma.category.update({
      where: {
        id: categoryId,
      },
      data: {
        items: {
          create: {
            name,
          },
        },
      },
      include: {
        items: true,
      },
    });
    revalidatePath("/dashboard/categories/[categoryId]", "page");
    return { msg: `分类 [${name}] 创建成功`, status: "success" };
  } catch (error) {
    return { msg: `分类 [${name}] 创建失败, 请重试`, status: "error" };
  }
}

export async function updateCategoryItem(
  id: number,
  data: categoryItemValue,
  oldName: string
): Promise<DataReturnType> {
  const { name } = data;

  try {
    await prisma.categoryItem.update({
      where: {
        id,
      },
      data: {
        name: name,
      },
    });
    revalidatePath("/dashboard/categories/[categoryId]", "page");
    return {
      msg: `分类名 [${oldName}] 成功修改为 [${name}]`,
      status: "success",
    };
  } catch (error) {
    return {
      msg: `分类名 [${oldName}] 修改为 [${name}] 失败, 请重试`,
      status: "error",
    };
  }
}
export async function deleteCategoryItem(
  id: number,
  name: string
): Promise<DataReturnType> {
  try {
    await prisma.categoryItem.delete({
      where: {
        id,
      },
    });
    revalidatePath("/dashboard/categories/[categoryId]", "page");
    return { msg: `分类 [${name}] 删除成功`, status: "success" };
  } catch (error) {
    return { msg: `分类 [${name}] 删除失败`, status: "error" };
  }
}
