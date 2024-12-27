"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { OrderList } from "@/views/order/components/order-list";
import { OrderSearch } from "@/views/order/schema/order.schema";

interface OrderTabProps {
  params: OrderSearch;
  children: React.ReactNode;
}

export const OrderTab = ({ params, children }: OrderTabProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  // 从查询参数中获取默认值
  const defaultValue = useMemo(() => params.tab ?? "order", [params]);

  // 更新查询参数
  const addQueryParam = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", value);

    // 更新 URL 的查询参数，不触发完整页面刷新
    router.replace(`?${params.toString()}`);
  };

  return (
    <Tabs
      defaultValue={defaultValue}
      onValueChange={addQueryParam}
      className="w-full"
    >
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="order">出库</TabsTrigger>
        <TabsTrigger value="history">历史记录</TabsTrigger>
      </TabsList>
      <TabsContent value="order">
        <OrderList />
      </TabsContent>
      <TabsContent value="history">{children}</TabsContent>
    </Tabs>
  );
};
