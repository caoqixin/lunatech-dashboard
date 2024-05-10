"use server";
import { unstable_noStore as noStore, revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { searchParamsValue } from "@/schemas/search-params-schema";
import { Supplier } from "@prisma/client";
import { supplierSchemaValue } from "@/schemas/supplier-schema";
import { DataReturnType } from "@/lib/definitions";

export async function getAllSuppliers(
  searchParams: searchParamsValue
): Promise<{ pageCount: number; suppliers: Supplier[] }> {
  noStore();
  const { page, per_page } = searchParams;
  const skip = (page - 1) * per_page;

  const [suppliers, total] = await prisma.$transaction([
    prisma.supplier.findMany({
      orderBy: {
        id: "asc",
      },
      take: per_page,
      skip: skip,
    }),
    prisma.supplier.count(),
  ]);

  const pageCount = Math.ceil(total / per_page);

  return { suppliers, pageCount };
}

export async function createSupplier(
  data: supplierSchemaValue
): Promise<DataReturnType> {
  const { name, description, site, username, password } = data;

  try {
    await prisma.supplier.create({
      data: {
        name,
        description,
        site,
        username,
        password,
      },
    });
    revalidatePath("/dashboard/suppliers");
    return { msg: `供应商 [${name}] 添加成功`, status: "success" };
  } catch (error) {
    return { msg: `供应商 [${name}] 添加失败, 请重试`, status: "error" };
  }
}

export async function updateSupplier(
  id: number,
  data: supplierSchemaValue
): Promise<DataReturnType> {
  const { name, description, username, site, password } = data;

  try {
    await prisma.supplier.update({
      where: {
        id,
      },
      data: {
        name,
        description,
        site,
        username,
        password,
      },
    });
    revalidatePath("/dashboard/suppliers");
    return { msg: `供应商 [${name}] 资料修改成功`, status: "success" };
  } catch (error) {
    return { msg: `供应商 [${name}] 资料修改失败, 请重试`, status: "error" };
  }
}

export async function deleteSupplier(
  id: number,
  name: string
): Promise<DataReturnType> {
  try {
    await prisma.supplier.delete({
      where: {
        id,
      },
    });
    revalidatePath("/dashboard/suppliers");
    return { msg: `供应商 [${name}] 删除成功`, status: "success" };
  } catch (error) {
    return { msg: `供应商 [${name}] 删除失败`, status: "error" };
  }
}
