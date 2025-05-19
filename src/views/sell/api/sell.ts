"use server";

import { unstable_noStore as noStore, revalidatePath } from "next/cache";
import type { DataReturnType } from "@/lib/definitions";
import { createClient } from "@/lib/supabase/server";
import type { SaleRecordItem, SaleRecords, SellStock } from "@/lib/types";
import { SaleListItem } from "../components/sell-page";
import redis from "@/lib/redis";
import { MANUEL_PRODUCT_PREFIX, SALES_KEY } from "@/lib/constants";

export interface SaleItemForCheckout {
  itemId: string;
  itemName: string;
  quantitySold: number;
  priceAtSale: number;
}

// --- New Types for Sales History ---
export type SalesRecordWithItems = SaleRecords & {
  sale_record_items: SaleRecordItem[];
};

interface FetchSalesHistoryOptions {
  page?: number;
  perPage?: number;
  date?: string; // DD/MM/YYYY format for specific day
}

// --- Search Sellable Items for the POS ---
export async function searchSellableItemsForSale(
  query: string
): Promise<SellStock[]> {
  noStore();
  const supabase = await createClient();

  if (!query || query.trim().length < 1) {
    // Min 1 char to search
    return [];
  }
  const searchTerm = `%${query.trim()}%`;

  try {
    const { data, error } = await supabase
      .from("sell_stocks")
      .select("id, name, image_url, selling_price, quantity") // Select fields needed for POS
      .or(`id.ilike.${searchTerm},name.ilike.${searchTerm}`) // Search by ID or Name
      .gt("quantity", 0) // Only show items with stock > 0
      .limit(10); // Limit search results

    if (error) throw error;
    return (data as SellStock[]) ?? [];
  } catch (error: any) {
    // console.error("Error searching sellable items:", error);
    // For client-side hook, throwing error is better
    throw new Error(error.message || "搜索配件失败。");
  }
}

export async function fetchSellableItemById(itemId: string) {
  noStore(); // Ensure fresh data for POS lookup
  const supabase = await createClient();
  try {
    const { data, error } = await supabase
      .from("sell_stocks")
      .select("id, name, image_url, selling_price, quantity") // Select fields needed for POS
      .eq("id", itemId)
      .maybeSingle(); // Use maybeSingle() as ID should be unique or null

    if (error) {
      // console.error(`Error fetching sellable item by ID ${itemId}:`, error);
      throw error; // Let caller handle specific errors if needed
    }
    return data as SellStock | null;
  } catch (error: any) {
    // console.error(`API fetchSellableItemById error for ID ${itemId}:`, error);
    // Propagate error or return null based on desired error handling strategy
    // For a hook, throwing can be caught by the hook's try/catch.
    throw new Error(error.message || `获取商品 ${itemId} 失败。`);
  }
}

// --- Process Checkout ---
export async function processCheckout(
  items: SaleItemForCheckout[]
): Promise<DataReturnType> {
  if (!items || items.length === 0) {
    return { status: "error", msg: "购物车为空。" };
  }
  const supabase = await createClient();
  // Calculate total amount and item count
  const totalAmount = items.reduce(
    (sum, item) => sum + item.quantitySold * item.priceAtSale,
    0
  );
  const itemsCount = items.reduce((sum, item) => sum + item.quantitySold, 0);

  try {
    // Use a Supabase Edge Function (or a transaction block if directly in SQL) for atomicity
    // For simplicity here, we'll do sequential operations.
    // In production, a transaction / Edge Function is STRONGLY recommended.

    // 1. Check stock for all items FIRST (important!)
    for (const item of items) {
      if (item.itemId.startsWith(MANUEL_PRODUCT_PREFIX)) {
        continue;
      }
      const { data: currentStockData, error: stockError } = await supabase
        .from("sell_stocks")
        .select("quantity, name")
        .eq("id", item.itemId)
        .single();

      if (stockError || !currentStockData) {
        throw new Error(
          `无法获取商品 ${item.itemName} (ID: ${item.itemId}) 的库存信息。`
        );
      }
      if (currentStockData.quantity < item.quantitySold) {
        throw new Error(
          `商品 "${currentStockData.name}" 库存不足 (仅剩 ${currentStockData.quantity} 件)。`
        );
      }
    }

    // 2. Create Sales Record
    const { data: salesRecord, error: salesRecordError } = await supabase
      .from("sales_records")
      .insert({
        total_amount: totalAmount,
        items_count: itemsCount,
      })
      .select("id")
      .single();

    if (salesRecordError) throw salesRecordError;
    if (!salesRecord) throw new Error("创建销售总记录失败。");

    const salesRecordId = salesRecord.id;

    // 3. Create Sale Record Items AND Update Stock
    const saleRecordItemsData = items.map((item) => ({
      sales_record_id: salesRecordId,
      sellable_item_id: item.itemId.startsWith(MANUEL_PRODUCT_PREFIX)
        ? null
        : item.itemId,
      item_name: item.itemName, // Store name at time of sale
      quantity_sold: item.quantitySold,
      price_at_sale: item.priceAtSale,
      subtotal: item.quantitySold * item.priceAtSale,
    }));

    const { error: itemsError } = await supabase
      .from("sale_record_items")
      .insert(saleRecordItemsData);

    if (itemsError) {
      // Attempt to delete the created sales_record if items fail (manual rollback step)
      await supabase.from("sales_records").delete().eq("id", salesRecordId);
      throw itemsError;
    }

    // 4. Update stock quantities for each item (in a loop for now, can be batched)
    for (const item of items) {
      if (item.itemId.startsWith(MANUEL_PRODUCT_PREFIX)) {
        continue;
      }
      const { error: stockUpdateError } = await supabase.rpc(
        "decrementProductQuantity",
        {
          item_id_to_update: item.itemId,
          quantity_to_decrement: item.quantitySold,
        }
      );

      if (stockUpdateError) {
        // Complex: How to roll back item inserts and main record if one stock update fails?
        // This is where an Edge Function with a transaction is ideal.
        // For now, log and potentially inform user of partial failure.
        console.error(
          `Stock update failed for ${item.itemId}:`,
          stockUpdateError
        );
        // Throwing here will show generic error.
        throw new Error(
          `更新商品 ${item.itemName} 库存失败。销售可能部分完成。`
        );
      }
    }

    revalidatePath("/dashboard/sell-stock"); // Revalidate admin stock page
    revalidatePath("/sell"); // Revalidate this page if needed
    return { status: "success", msg: "结账成功！" };
  } catch (error: any) {
    // console.error("Process Checkout Error:", error);
    return {
      status: "error",
      msg: error.message || "结账过程中发生错误。",
    };
  }
}

// TODO: SALES HISTORY
export async function fetchRecentSales(
  options: FetchSalesHistoryOptions = {}
): Promise<{ records: SalesRecordWithItems[]; count: number }> {
  const supabase = await createClient();
  const { page = 1, perPage = 10, date: specificDate } = options;

  const from = (page - 1) * perPage;
  const to = from + perPage - 1;

  try {
    // Base query for sales_records
    let query = supabase
      .from("sales_records")
      .select(
        `
        *,
        sale_record_items ( * )
      `,
        { count: "exact" }
      ) // Get total count for pagination
      .order("sold_at", { ascending: false }) // Latest first
      .range(from, to);

    // Apply date filter if provided
    if (specificDate) {
      const startDate = `${specificDate}T00:00:00.000Z`;
      const endDate = `${specificDate}T23:59:59.999Z`;
      query = query.gte("sold_at", startDate).lte("sold_at", endDate);
    }

    const { data, error, count } = await query;

    if (error) throw error;

    return {
      records: (data as SalesRecordWithItems[]) ?? [],
      count: count ?? 0,
    };
  } catch (error: any) {
    // console.error("Error fetching recent sales:", error);
    throw new Error(error.message || "获取销售历史失败。");
  }
}

// Redis Persist Save Sale Record
export async function getSaleList(): Promise<SaleListItem[]> {
  try {
    const data = await redis.get<SaleListItem[]>(SALES_KEY);

    return data || [];
  } catch (error) {
    return [];
  }
}

export async function saveSaleList(
  items: SaleListItem[]
): Promise<DataReturnType> {
  try {
    await redis.set(SALES_KEY, JSON.stringify(items));
    return { status: "success", msg: "" };
  } catch (error) {
    return { status: "error", msg: "保存出库单失败。" };
  }
}

export async function clearSaleList(): Promise<DataReturnType> {
  try {
    await redis.del(SALES_KEY);
    return { status: "success", msg: "" };
  } catch (error) {
    // console.error("Error clearing sale list from Redis:", error);
    return { status: "error", msg: "清空出库单失败。" };
  }
}
