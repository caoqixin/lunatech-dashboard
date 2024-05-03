import BreadCrumb, { BreadCrumbType } from "@/components/breadcrumb";
import OrderContent from "./order-content";
import SellTab from "./sell-tab";
import RecoverProduct from "./recover-product";
import { TabsContent } from "@/components/ui/tabs";
import { Suspense } from "react";
import { searchOrderParamsValue } from "@/schemas/search-params-schema";
import { getDataList } from "@/lib/actions/orders";
import { getAllProduct } from "@/lib/actions/product";

const breadcrumbItems: BreadCrumbType[] = [
  { title: "出入库管理", link: "/dashboard/orders" },
];

export default async function OrderPage({
  search,
}: {
  search: searchOrderParamsValue;
}) {
  // get data
  const [orders, products] = await Promise.all([
    getDataList(),
    getAllProduct(),
  ]);

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <BreadCrumb items={breadcrumbItems} />
      <OrderContent search={search}>
        <TabsContent value="out" className="space-y-4">
          <Suspense fallback={<div>loading ...</div>}>
            <SellTab orders={orders} />
          </Suspense>
        </TabsContent>
        <TabsContent value="in" className="space-y-4">
          <Suspense fallback={<div>loading ...</div>}>
            <RecoverProduct products={products} />
          </Suspense>
        </TabsContent>
      </OrderContent>
    </div>
  );
}
