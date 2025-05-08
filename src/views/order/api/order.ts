"use server";

import date from "@/lib/date";
import redis from "@/lib/redis";
import { createClient } from "@/lib/supabase/server";
import { Component } from "@/lib/types";

export type OrderComponent = Component & {
  quantity?: number;
};

export async function saveOrderState(orders: string) {
  await redis.set("orders", orders);
}

export async function getOrderList(): Promise<OrderComponent[]> {
  const data = await redis.get<OrderComponent[]>("orders");

  return data ? data : [];
}

async function generateOrderId(): Promise<string> {
  const prefix = "LUNATECH";
  const year = date().year();
  const month = (date().month() + 1).toString().padStart(2, "0");
  const latestId = await redis.incr("orderId");

  return `${prefix}-${year}-${month}-${String(latestId).padStart(4, "0")}`;
}

export async function checkout() {
  const supabase = await createClient();
  // 获取redis 中的 order item
  const orders = await getOrderList();
  // 创建订单ID
  const orderId = await generateOrderId();
  const amount = orders.reduce((prev, item) => {
    return prev + (item.quantity || 1) * item.public_price;
  }, 0);

  const items = orders.map((order) => ({
    componentId: order.id,
    code: order.code,
    name: order.name,
    category: order.category,
    public_price: String(order.public_price),
    count: order.quantity || 1,
    order_id: orderId,
  }));

  // 减库存
  const { data, error: ComponentError } = await supabase.rpc(
    "update_component_stock",
    {
      components: items,
    }
  );

  if (ComponentError) {
    throw new Error(
      JSON.stringify({
        message: "库存不足, 请重试.",
        details: ComponentError.details || "未知错误",
      })
    );
  }

  if (!data) {
    throw new Error(
      JSON.stringify({
        message: "库存不足, 请重试.",
        details: "配件出库失败",
      })
    );
  }

  const { error } = await supabase.from("orders").insert({
    id: orderId,
    amount,
    createdAt: date().toISOString(),
    updatedAt: date().toISOString(),
  });

  if (error) {
    throw new Error(
      JSON.stringify({
        message: "出库过程中出现问题，请稍后重试.",
        details: error.details || "未知错误",
      })
    );
  }

  // 添加订单项
  const { error: ItemError } = await supabase.from("order_items").insert(items);

  if (ItemError) {
    throw new Error(
      JSON.stringify({
        message: "出库过程中出现问题，请稍后重试.",
        details: ItemError.details || "未知错误",
      })
    );
  }

  return {
    msg: `出库操作已完成. 订单ID${orderId}, 共有${items.length} 个配件出库, 价值 ${amount} €`,
    status: "success",
  };
}
