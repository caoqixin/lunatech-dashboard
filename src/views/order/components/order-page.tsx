import BreadCrumb, { BreadCrumbType } from "@/components/breadcrumb";
import { Header } from "@/components/custom/header";
import { RefreshButton } from "@/components/custom/refresh-button";
import { Separator } from "@/components/ui/separator";

import { OrderTab } from "@/views/order/components/order-tab";
import { OrderSearch } from "@/views/order/schema/order.schema";
import { HistoryList } from "./history-list";

const breadcrumbItems: BreadCrumbType[] = [
  { title: "出库管理", link: "/dashboard/orders" },
];

interface OrderPageProps {
  params: OrderSearch;
}

export const OrderPage = async ({ params }: OrderPageProps) => {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <BreadCrumb items={breadcrumbItems} />
      <Header title="出库管理">
        <RefreshButton />
      </Header>
      <Separator />
      <OrderTab params={params}>
        <HistoryList params={params} />
      </OrderTab>
    </div>
  );
};
