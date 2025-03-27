"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OrderList } from "@/views/order/components/order-list";
import { OrderSearch } from "@/views/order/schema/order.schema";
import useTabQueryParam from "@/hooks/use-tab-query-param";

interface OrderTabProps {
  params: OrderSearch;
  children: React.ReactNode;
}

export const OrderTab = ({ params, children }: OrderTabProps) => {
  const { tab, setTab } = useTabQueryParam({
    defaultTab: params.tab ?? "order",
  });

  return (
    <Tabs value={tab} onValueChange={setTab} className="w-full">
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
