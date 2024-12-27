import { SearchParams } from "@/components/data-table/type";
import { isLoggedIn } from "@/server/user";
import { OrderPage } from "@/views/order/components/order-page";
import { orderSearchParams } from "@/views/order/schema/order.schema";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "出库管理",
};

export interface OrderPageProps {
  searchParams: SearchParams;
}

export default async function Page({ searchParams }: OrderPageProps) {
  if (!(await isLoggedIn())) {
    redirect("/login");
  }

  const params = orderSearchParams.parse(searchParams);

  return <OrderPage params={params} />;
}
