"use server";
import { unstable_noStore as noStore, revalidatePath } from "next/cache";
import { DataReturnType } from "@/lib/definitions";
import prisma from "@/lib/prisma";
import { CategorySchemaValue } from "@/schemas/category-schema";
import { searchParamsValue } from "@/schemas/search-params-schema";
import { Category } from "@prisma/client";

export async function getAllCategories(
  searchParams: searchParamsValue
): Promise<{ pageCount: number; categories: Category[] }> {
  noStore();

  const { per_page, page } = searchParams;
  const skip = (page - 1) * per_page;

  const categories: Category[] = await prisma.category.findMany({
    orderBy: {
      id: "asc",
    },
    take: per_page,
    skip,
  });
  const total = await prisma.category.count();
  const pageCount = Math.ceil(total / per_page);

  return { pageCount, categories };
}

export async function getCategoryById(id: number): Promise<Category | null> {
  noStore();

  const category = await prisma.category.findUnique({
    where: {
      id,
    },
  });

  return category;
}

export async function generateCategoryIdParams(): Promise<Category[]> {
  const categories = await prisma.category.findMany();

  return categories;
}

export async function createCategory(
  data: CategorySchemaValue
): Promise<DataReturnType> {
  const { name } = data;

  try {
    await prisma.category.create({
      data: {
        name: name,
      },
    });
    revalidatePath("/dashboard/categories");
    return { msg: `分类 [${name}] 创建成功`, status: "success" };
  } catch (error) {
    return { msg: `分类 [${name}] 创建失败, 请重试`, status: "error" };
  }
}

export async function updateCategory(
  id: number,
  data: CategorySchemaValue,
  oldName: string
): Promise<DataReturnType> {
  const { name } = data;

  try {
    await prisma.category.update({
      where: {
        id,
      },
      data: {
        name,
      },
    });
    revalidatePath("/dashboard/categories");
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
export async function deleteCategory(
  id: number,
  name: string
): Promise<DataReturnType> {
  try {
    await prisma.category.delete({
      where: {
        id,
      },
    });
    revalidatePath("/dashboard/categories");
    return { msg: `分类 [${name}] 删除成功`, status: "success" };
  } catch (error) {
    return { msg: `分类 [${name}] 删除失败`, status: "error" };
  }
}
