"use server";

import { unstable_noStore as noStore } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type RevenueType = {
  month: string;
  revenue?: number;
  quantity?: number;
};

export async function fetchAnnualy() {
  noStore();

  const supabase = await createClient();
  const { data } = await supabase.rpc("getAnnuallyRepairPrice");

  return data ?? 0;
}

export async function fetchMonthly() {
  noStore();

  const supabase = await createClient();
  const { data } = await supabase.rpc("getMonthlyRepairPrice");

  return data ?? 0;
}

export async function fetchAnnualyRepair() {
  noStore();
  const supabase = await createClient();

  const { data } = await supabase.rpc("getAnnuallyRepairs");

  return data ?? 0;
}

export async function fetchMonthlyRepair() {
  noStore();
  const supabase = await createClient();

  const { count } = await supabase.rpc(
    "getMonthlyRepairs",
    {},
    {
      count: "exact",
      head: true,
    }
  );

  return count ?? 0;
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

export async function fetchRevenue() {
  noStore();

  const supabase = await createClient();

  const revenue = await supabase.rpc("getRevenueByMonth");
  const counts = await supabase.rpc("getRepairsCountByMonth");

  const data: RevenueType[] =
    revenue.data?.map((obj, index) => {
      return {
        month: `${new Date(obj.month).getMonth() + 1}月`,
        revenue: obj.revenue,
        quantity: counts.data?.[index].repair_count,
      };
    }) ?? [];

  return data;
}

export async function fetchTopRepair() {
  noStore();

  const supabase = await createClient();

  const { data } = await supabase.rpc("getTopList").limit(5);

  return data ?? [];
}

export async function fetchAllTopRepair() {
  noStore();

  const supabase = await createClient();

  const { data } = await supabase.rpc("getTopList");

  return data ?? [];
}
