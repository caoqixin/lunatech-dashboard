"use server";

import {
  SellStockData,
  SellStockForm,
  SellStockSearch,
} from "../schema/sell.schema";
import { unstable_noStore as noStore, revalidatePath } from "next/cache";
import type { DataReturnType } from "@/lib/definitions";
import { createClient } from "@/lib/supabase/server";
import type { SellStock } from "@/lib/types";
import date from "@/lib/date";

export type FetchSellStockItemsWithPage = {
  data: SellStock[];
  totalPage: number;
};

export async function fetchSellStockItemsWithPage(
  params: SellStockSearch
): Promise<FetchSellStockItemsWithPage> {
  noStore();
  const { page, per_page, id, name, category } = params;
  const categories = category?.split(".");

  // 分页
  const from = (page - 1) * per_page;
  const to = from + per_page - 1;

  // supabse 客户端
  const supabase = await createClient();

  let query = supabase
    .from("sell_stocks")
    .select("*", { count: "exact" })
    .range(from, to);

  if (name) {
    query = query.or(`name.ilike.%${name}%, id.ilike.%${name}%`); // Search by name
  }
  if (id) {
    query = query.ilike("id", `%${id}%`); // Search by ID (barcode usually)
  }
  if (categories) {
    // Assuming category is a single string filter for now
    // If it's "value1.value2", you need to handle split and 'in' filter
    query = query.in("category", categories);
  }

  query = query.order("created_at", { ascending: false });

  const { data, count, error } = await query;

  if (error) {
    throw new Error(`数据获取失败, 失败原因: ${error.message}`);
  }

  const totalPage = Math.ceil((count ?? 0) / per_page);

  return {
    data: data ?? [],
    totalPage,
  };
}

// --- Create New Sell Product ---
export async function createSellProduct(
  formData: SellStockForm
): Promise<DataReturnType> {
  const supabase = await createClient();
  // Schema validation should happen on client, but can re-validate here too
  const parsedData = SellStockData.safeParse(formData);
  if (!parsedData.success) {
    return { status: "error", msg: "数据格式出错" };
  }

  const dataToInsert = {
    ...parsedData.data,
    image_url: parsedData.data.image_url as string,
    purchase_price: parsedData.data.purchase_price ?? 0,
  };

  try {
    const { error } = await supabase.from("sell_stocks").insert(dataToInsert);

    if (error) throw error;

    revalidatePath("/dashboard/sell-stock"); // Revalidate path after creation
    return { status: "success", msg: "商品添加成功！" };
  } catch (error: any) {
    return {
      status: "error",
      msg: error.message || "添加商品失败。",
    };
  }
}

// --- Update Sell Product ---
export async function updateSellProduct(
  id: string,
  formData: Partial<SellStockForm>
): Promise<DataReturnType> {
  const supabase = await createClient();
  // For partial updates, you might create a partial schema or validate individual fields
  // Here, we assume formData contains valid partial data.
  const dataToUpdate = {
    ...formData,
    image_url: formData.image_url as string,
    updated_at: new Date().toISOString(), // Manually set updated_at
  };
  // Remove 'id' from dataToUpdate if it's present, as it's used in .eq()
  if ("id" in dataToUpdate) delete (dataToUpdate as any).id;

  try {
    const { error } = await supabase
      .from("sell_stocks")
      .update(dataToUpdate)
      .eq("id", id);

    if (error) throw error;

    revalidatePath("/dashboard/sell-stock");
    return { status: "success", msg: "商品更新成功！" };
  } catch (error: any) {
    return {
      status: "error",
      msg: error.message || "更新商品失败。",
    };
  }
}

// --- Delete Sell Product ---
export async function deleteSellProduct(id: string): Promise<DataReturnType> {
  const supabase = await createClient();
  try {
    const { error } = await supabase.from("sell_stocks").delete().eq("id", id);
    if (error) throw error;

    revalidatePath("/dashboard/sell-stock");
    return { status: "success", msg: "商品删除成功！" };
  } catch (error: any) {
    console.error("Delete Sell Product Error:", error);
    return {
      status: "error",
      msg: error.message || "删除商品失败。",
    };
  }
}

// --- Update Sellable Item Stock Only ---
export async function updateProductStock(
  id: string,
  newStock: number
): Promise<DataReturnType> {
  const supabase = await createClient();
  if (newStock < 0 || !Number.isInteger(newStock)) {
    return { status: "error", msg: "库存数量必须为非负整数。" };
  }

  try {
    const { error } = await supabase
      .from("sell_stocks")
      .update({ quantity: newStock, updated_at: date().toISOString() })
      .eq("id", id);

    if (error) throw error;

    revalidatePath("/dashboard/sell-stock"); // Revalidate path
    return { status: "success", msg: "库存更新成功！" };
  } catch (error: any) {
    // console.error("Update Sellable Item Stock Error:", error);
    return { status: "error", msg: error.message || "更新库存失败。" };
  }
}
