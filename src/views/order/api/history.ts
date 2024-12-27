"use server";
import { unstable_noStore as noStore } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { OrderSearch } from "@/views/order/schema/order.schema";

export async function fetchOrderHistories(params: OrderSearch) {
  noStore();
  const { page, per_page } = params;
  const from = (page - 1) * per_page;
  const to = from + per_page - 1;
  const supabase = await createClient();

  const { data } = await supabase
    .from("orders")
    .select("*, order_items!inner(*)")
    .range(from, to)
    .order("createdAt", { ascending: false });

  return data ?? [];
}

export async function countOrders(per_page: number) {
  noStore();
  const supabase = await createClient();

  const { count } = await supabase
    .from("orders")
    .select("*", { count: "exact", head: true });

  return Math.ceil((count ?? 0) / per_page);
}
