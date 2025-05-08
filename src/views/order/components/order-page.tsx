"use client";
import BreadCrumb, { BreadCrumbType } from "@/components/breadcrumb";
import { Header } from "@/components/custom/header";
import { RefreshButton } from "@/components/custom/refresh-button";
import { Separator } from "@/components/ui/separator";
import { OrderTab } from "@/views/order/components/order-tab";
import type { OrderSearch } from "@/views/order/schema/order.schema";
import { HistoryListWrapper } from "./history-list-wrapper";

const breadcrumbItems: BreadCrumbType[] = [
  { title: "出库管理", link: "/dashboard/orders" },
];

interface OrderPageProps {
  params: OrderSearch;
}

export const OrderPage = ({ params }: OrderPageProps) => {
  return (
    <div className="flex-1 space-y-4 pt-6 p-4 md:p-8">
      <BreadCrumb items={breadcrumbItems} />
      {/* Pass handleRefresh to Header if RefreshButton uses it */}
      <Header title="出入库管理">
        <RefreshButton />
      </Header>
      <Separator />
      {/* OrderTab now controls which content is shown */}
      <OrderTab params={params}>
        {/* Pass params needed for HistoryList's data fetching */}
        <HistoryListWrapper searchParams={params} />
      </OrderTab>
    </div>
  );
};
