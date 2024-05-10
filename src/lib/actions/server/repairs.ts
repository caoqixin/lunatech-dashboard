"use server";
import { unstable_noStore as noStore, revalidatePath } from "next/cache";
import {
  ClientRepiar,
  DataReturnType,
  RepiarWithCustomer,
} from "@/lib/definitions";
import prisma from "@/lib/prisma";
import { searchParamsValue } from "@/schemas/search-params-schema";
import { RepairFormValue } from "@/schemas/repair-schema";

export async function getAllRepairs(
  searchParams: searchParamsValue
): Promise<{ pageCount: number; repairs: ClientRepiar[] }> {
  const { per_page, page } = searchParams;
  const skip = (page - 1) * per_page;

  const [repairs, total] = await prisma.$transaction([
    prisma.repair.findMany({
      orderBy: {
        id: "desc",
      },
      where: {
        status: { not: "已取件" },
      },
      take: per_page,
      skip,
    }),
    prisma.repair.count({
      where: {
        status: { not: "已取件" },
      },
    }),
  ]);

  const pageCount = Math.ceil(total / per_page);

  return {
    repairs: repairs.map((repair) => ({
      ...repair,
      deposit: repair.deposit.toString(),
      price: repair.price.toString(),
    })),
    pageCount,
  };
}

export async function getRepairWithCustomerById(
  id: number
): Promise<RepiarWithCustomer | null> {
  noStore();
  const repair = await prisma.repair.findUnique({
    where: {
      id,
    },
    include: {
      customer: true,
    },
  });

  if (repair) {
    return {
      ...repair,
      deposit: repair.deposit.toString(),
      price: repair.price.toString(),
    };
  }
  return null;
}

export async function getRepairById(id: number): Promise<ClientRepiar | null> {
  const repair = await prisma.repair.findUnique({
    where: {
      id,
    },
  });

  if (repair) {
    return {
      ...repair,
      deposit: repair.deposit.toString(),
      price: repair.price.toString(),
    };
  }

  return null;
}

export async function changeStatus(
  id: number,
  status: string,
  isRework: boolean
): Promise<DataReturnType> {
  try {
    return await prisma.$transaction(async (db) => {
      // 更新状态
      await db.repair.update({
        where: {
          id,
        },
        data: {
          status,
        },
      });

      // 是否是保修
      if (isRework && status == "已取件") {
        await db.repair.update({
          where: {
            id,
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
        return {
          msg: `成功取机, 当前手机已完成保修, 当前的维修状态为${status}`,
          status: "success",
        };
      }

      // 是否是取件
      if (status == "已取件") {
        await prisma.warranty.create({
          data: {
            days: 90,
            repair: {
              connect: {
                id,
              },
            },
          },
        });
        revalidatePath("/dashboard/repairs");
        return {
          msg: `成功取机, 可前往保修页面查看保修状态`,
          status: "success",
        };
      }

      revalidatePath("/dashboard/repairs");
      return { msg: `更新成功, 当前的维修状态为${status}`, status: "success" };
    });
  } catch (error) {
    return { msg: `维修状态修改失败, 请重试`, status: "error" };
  }
}

export async function createRepair(
  data: RepairFormValue
): Promise<DataReturnType> {
  const { phone, problem, status, deposit, price, name, tel, email } = data;

  try {
    await prisma.customer.upsert({
      where: {
        tel: tel,
      },
      update: {
        repairs: {
          create: {
            phone,
            problem,
            status,
            deposit: deposit,
            price,
          },
        },
      },
      create: {
        name,
        tel,
        email,
        repairs: {
          create: {
            phone,
            problem,
            status,
            deposit,
            price,
          },
        },
      },
    });
    revalidatePath("/dashboard/repairs");
    revalidatePath("/dashboard/customers");
    return { msg: "创建成功", status: "success" };
  } catch (error) {
    return { msg: "创建失败", status: "error" };
  }
}

export async function updateRepair(
  id: number,
  data: RepairFormValue & { isRework: boolean }
): Promise<DataReturnType> {
  const { phone, problem, status, deposit, price, name, tel, email, isRework } =
    data;

  try {
    return await prisma.$transaction(async (db) => {
      // 更新 repair 表
      await db.repair.update({
        where: {
          id,
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
      // 是否是保修
      if (isRework && status == "已取件") {
        await db.repair.update({
          where: {
            id,
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
        revalidatePath("/dashboard/warranties");
        return {
          msg: `成功取机, 当前手机已完成保修, 当前的维修状态为${status}`,
          status: "success",
        };
      }
      if (status == "已取件") {
        await prisma.warranty.create({
          data: {
            days: 90,
            repair: {
              connect: {
                id,
              },
            },
          },
        });
        revalidatePath("/dashboard/repairs");
        revalidatePath("/dashboard/warranties");
        return {
          msg: `成功取机, 可前往保修页面查看保修状态`,
          status: "success",
        };
      }

      revalidatePath("/dashboard/repairs");
      revalidatePath("/dashboard/customers");
      return { msg: "更新成功", status: "success" };
    });
  } catch (error) {
    return { msg: "更新失败", status: "error" };
  }
}

export async function deleteRepair(
  id: number,
  phoneName?: string
): Promise<DataReturnType> {
  try {
    await prisma.repair.delete({
      where: {
        id,
      },
    });
    revalidatePath("/dashboard/repairs");
    return { msg: `成功移除 ${phoneName} 的维修`, status: "success" };
  } catch (error) {
    return { msg: `维修移除失败`, status: "error" };
  }
}
