"use server";
import { unstable_noStore as noStore, revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { ClientRepiar, DataReturnType } from "@/lib/definitions";
import { searchCustomerParamsValue } from "@/schemas/search-params-schema";
import { Customer } from "@prisma/client";
import { customerSchemaValue } from "@/schemas/customer-schema";

export async function getAllCustomers(
  searchParams: searchCustomerParamsValue
): Promise<{ pageCount: number; customers: Customer[] }> {
  noStore();
  const { per_page, page, tel } = searchParams;
  const skip = (page - 1) * per_page;

  const [customers, total] = await prisma.$transaction([
    prisma.customer.findMany({
      orderBy: {
        id: "asc",
      },
      where: {
        tel: {
          contains: tel ?? "",
        },
      },
      take: per_page,
      skip: skip,
    }),
    prisma.customer.count({
      where: {
        tel: {
          contains: tel ?? "",
        },
      },
    }),
  ]);

  const pageCount = Math.ceil(total / per_page);

  return { customers, pageCount };
}

export async function getCustomerById(id: number): Promise<Customer | null> {
  noStore();
  return await prisma.customer.findUnique({
    where: {
      id,
    },
  });
}

export async function getRepairsForCustomer(
  id: number
): Promise<ClientRepiar[]> {
  const data = await prisma.repair.findMany({
    where: {
      customerId: id,
    },
  });

  return data.map((item) => ({
    ...item,
    price: item.price.toString(),
    deposit: item.deposit.toString(),
  }));
}

export async function createCustomer(
  data: customerSchemaValue
): Promise<DataReturnType> {
  const { name, tel, email } = data;

  try {
    await prisma.customer.create({
      data: {
        name,
        tel,
        email,
      },
    });
    revalidatePath("/dashboard/customers");
    return { msg: "添加成功", status: "success" };
  } catch (error) {
    return { msg: "添加失败", status: "error" };
  }
}
export async function updateCustomer(
  id: number,
  data: customerSchemaValue
): Promise<DataReturnType> {
  const { name, tel, email } = data;

  try {
    await prisma.customer.update({
      where: {
        id,
      },
      data: {
        name: name,
        tel: tel,
        email: email,
      },
    });
    revalidatePath("/dashboard/customers");
    return { msg: "客户资料更新成功", status: "success" };
  } catch (error) {
    return { msg: "客户资料更新失败", status: "error" };
  }
}
