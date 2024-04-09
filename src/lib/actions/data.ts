"use server";

import { unstable_noStore as noStore, revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { getCurrentMonth } from "@/lib/utils";
import { Repair } from "@prisma/client";
import { RepairMonthData, Result } from "../definitions";
import dayjs from "dayjs";

async function getTotalRepairs() {
  return await prisma.repair.count();
}

async function getMonthlyRepairs() {
  const { start, end } = getCurrentMonth();

  return await prisma.repair.count({
    where: {
      createdAt: {
        gte: start,
        lte: end,
      },
    },
  });
}

async function getAnnualy() {
  return await prisma.repair.aggregate({
    _sum: {
      price: true,
    },
    where: {
      status: {
        in: ["已取件", "返修中", "返修完成"],
      },
    },
  });
}

async function getMonthly() {
  const { start, end } = getCurrentMonth();

  return await prisma.repair.aggregate({
    _sum: {
      price: true,
    },
    where: {
      status: {
        in: ["已取件", "返修中", "返修完成"],
      },
      createdAt: {
        gte: start,
        lte: end,
      },
    },
  });
}

async function getComponentsCountAndAmount() {
  noStore();
  const count = await prisma.component.aggregate({
    _sum: {
      stock: true,
    },
  });

  const amount = await prisma.component.findMany({
    where: {
      stock: {
        not: 0,
      },
    },
  });

  const totalAmount = amount.reduce((prev, value) => {
    return (prev += value.stock * value.purchase_price.toNumber());
  }, 0);

  return {
    totalAmount,
    count,
  };
}

export async function fetchData() {
  noStore();

  const totalRepairs = await getTotalRepairs();
  const monthlyRepairs = await getMonthlyRepairs();

  const annualy = await getAnnualy();
  const monthly = await getMonthly();

  const component = await getComponentsCountAndAmount();

  revalidatePath("/dashboard", "page");
  return {
    totalRepairs,
    monthlyRepairs,
    annualy: annualy._sum.price,
    monthly: monthly._sum.price,
    component,
  };
}

export async function fetchTopRepair(take?: number) {
  noStore();

  if (take) {
    const topValues = await prisma.repair.groupBy({
      by: ["phone"],
      _count: {
        phone: true,
      },
      orderBy: {
        _count: {
          phone: "desc",
        },
      },
      take,
    });

    // refactor data
    const data = topValues.map((value) => {
      return {
        title: value.phone,
        count: value._count.phone,
      };
    });

    revalidatePath("/dashboard", "page");
    return data;
  }

  const topValues = await prisma.repair.groupBy({
    by: ["phone"],
    _count: {
      phone: true,
    },
    orderBy: {
      _count: {
        phone: "desc",
      },
    },
  });

  // refactor data
  const data = topValues.map((value) => {
    return {
      title: value.phone,
      count: value._count.phone,
    };
  });

  revalidatePath("/dashboard", "page");
  return data;
}

function getRepairMonthData(repairs: Repair[]) {
  const data: RepairMonthData = {
    jan: [],
    feb: [],
    mar: [],
    apr: [],
    may: [],
    jul: [],
    jun: [],
    agu: [],
    sep: [],
    oct: [],
    nov: [],
    dic: [],
  };

  repairs.map((repair) => {
    switch (dayjs(repair.createdAt.toLocaleString()).month()) {
      case 0:
        data.jan?.push(repair);
        break;
      case 1:
        data.feb?.push(repair);
        break;
      case 2:
        data.mar?.push(repair);
        break;
      case 3:
        data.apr?.push(repair);
        break;
      case 4:
        data.may?.push(repair);
        break;
      case 5:
        data.jul?.push(repair);
        break;
      case 6:
        data.jun?.push(repair);
        break;
      case 7:
        data.agu?.push(repair);
        break;
      case 8:
        data.sep?.push(repair);
        break;
      case 9:
        data.oct?.push(repair);
        break;
      case 10:
        data.nov?.push(repair);
        break;
      case 11:
        data.dic?.push(repair);
        break;
    }
  });

  return data;
}

async function getRepairsCountOverview() {
  const data = await prisma.repair.findMany();

  const counts = getRepairMonthData(data);

  const result: Result = {};
  for (const [key, value] of Object.entries(counts)) {
    const length = (value as unknown as Repair[]).length;
    result[key] = length;
  }

  return result;
}

async function getRepairsRevenueOverview() {
  const data = await prisma.repair.findMany();

  const counts = getRepairMonthData(data);

  const result: Result = {};
  for (const [key, value] of Object.entries(counts)) {
    const amount = (value as unknown as Repair[]).reduce((prev, value) => {
      return (prev += value.price.toNumber());
    }, 0);
    result[key] = amount;
  }

  return result;
}

// 显示一整年收入和维修次数
export async function fetchOverviewData() {
  noStore();

  const countData = await getRepairsCountOverview();
  const revenueData = await getRepairsRevenueOverview();
  revalidatePath("/dashboard", "page");

  return {
    countData,
    revenueData,
  };
}
