"use server";
import redis from "@/lib/redis";
import { OrderComponent, saveOrderState } from "@/views/order/api/order";

export async function gotoRepair(item: string): Promise<void> {
  const data = await redis.get<OrderComponent[]>("orders");

  // 如果 data 为 null，则直接初始化为一个空数组
  const parsedData: OrderComponent[] = data ? data : [];

  // 将新项目解析为对象
  const newItem = JSON.parse(item) as OrderComponent;

  saveOrderState(JSON.stringify([...parsedData, newItem]));
}
