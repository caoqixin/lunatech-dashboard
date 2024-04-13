import OrderPage from "@/components/pages/order/order-page";
import { SearchParams } from "@/components/tables/v2/types";
import { auth } from "@/lib/user";
import { searchOrderParamsSchema } from "@/schemas/search-params-schema";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "出入库管理",
};

export default async function Page({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  await auth();

  const search = searchOrderParamsSchema.parse(searchParams);

  return <OrderPage search={search} />;
}
