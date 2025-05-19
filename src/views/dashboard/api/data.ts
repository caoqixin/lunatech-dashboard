"use server";

import { unstable_noStore as noStore } from "next/cache";
import { createClient } from "@/lib/supabase/server";

import date from "@/lib/date";

export type RevenueType = {
  month: string;
  revenue?: number;
  quantity?: number;
};

export type DifferentData = {
  current: number;
  last: number;
};

export async function fetchAnnualy() {
  noStore();

  const supabase = await createClient();
  const [current, last] = await Promise.all([
    supabase.rpc("getAnnuallyRepairPrice"),
    supabase.rpc("getAnnuallyRepairPrice", {
      year: date().year() - 1,
    }),
  ]);

  return {
    current: current.data ?? 0,
    last: last.data ?? 0,
  };
}

export async function fetchMonthly() {
  noStore();

  const supabase = await createClient();

  const [current, last] = await Promise.all([
    supabase.rpc("getMonthlyRepairPrice"),
    supabase.rpc("getMonthlyRepairPrice", {
      month: date().subtract(1, "month").startOf("month").toISOString(),
    }),
  ]);

  return {
    current: current.data ?? 0,
    last: date().month() == 0 ? 0 : last.data ?? 0,
  };
}

export async function fetchAnnualyRepair() {
  noStore();
  const supabase = await createClient();

  const [current, last] = await Promise.all([
    supabase.rpc("getAnnuallyRepairs"),
    supabase.rpc("getAnnuallyRepairs", {
      year: date().year() - 1,
    }),
  ]);

  return {
    current: current.data ?? 0,
    last: last.data ?? 0,
  };
}

export async function fetchMonthlyRepair() {
  noStore();
  const supabase = await createClient();

  const [current, last] = await Promise.all([
    supabase.rpc(
      "getMonthlyRepairs",
      {},
      {
        count: "exact",
        head: true,
      }
    ),
    supabase.rpc(
      "getMonthlyRepairs",
      {
        month: date().subtract(1, "month").startOf("month").toISOString(),
      },
      {
        count: "exact",
        head: true,
      }
    ),
  ]);

  return {
    current: current.count ?? 0,
    last: date().month() == 0 ? 0 : last.count ?? 0,
  };
}

export async function fetchAllComponentsStock() {
  noStore();

  const supabase = await createClient();

  const { data } = await supabase.rpc("countStock");

  return data ?? 0;
}

export async function fetchAllComponentsPrice() {
  noStore();

  const supabase = await createClient();
  const { data } = await supabase.rpc("countComponentsTotalPrice");

  return data ?? 0;
}

export async function fetchAllProductsStock() {
  noStore();

  const supabase = await createClient();

  const { data } = await supabase.rpc("countSellProductStock");

  return data ?? 0;
}

export async function fetchAllProductsPrice() {
  noStore();

  const supabase = await createClient();
  const { data } = await supabase.rpc("countSellProductTotalPrice");

  return data ?? 0;
}

export async function fetchRevenue(year: number = date().year()) {
  noStore();

  const supabase = await createClient();

  const [revenue, counts] = await Promise.all([
    supabase.rpc("getRevenueByMonth", { year }),
    supabase.rpc("getRepairsCountByMonth", { year }),
  ]);

  const data: RevenueType[] =
    revenue.data?.map((obj, index) => {
      return {
        month: `${date(obj.month).month() + 1}月`,
        revenue: obj.revenue,
        quantity: counts.data?.[index].repair_count,
      };
    }) ?? [];

  return data;
}

export async function fetchAllTopRepair() {
  noStore();

  const supabase = await createClient();

  const { data } = await supabase.rpc("getTopList");

  return data ?? [];
}

export async function fetchDashboardData() {
  noStore();

  try {
    // 使用Promise.all并行获取所有数据
    const [
      annualyPrice,
      monthlyPrice,
      annualyRepairs,
      monthlyRepairs,
      componentsStock,
      componentsPrice,
      revenue,
      topRepair,
      productsStock,
      productsTotalPrice,
    ] = await Promise.all([
      fetchAnnualy(),
      fetchMonthly(),
      fetchAnnualyRepair(),
      fetchMonthlyRepair(),
      fetchAllComponentsStock(),
      fetchAllComponentsPrice(),
      fetchRevenue(),
      fetchAllTopRepair(),
      fetchAllProductsStock(),
      fetchAllProductsPrice(),
    ]);

    return {
      annualyPrice,
      monthlyPrice,
      annualyRepairs,
      monthlyRepairs,
      componentsStock,
      componentsPrice,
      revenue,
      topRepair,
      productsStock,
      productsTotalPrice,
    };
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    throw new Error("无法获取仪表盘数据");
  }
}
