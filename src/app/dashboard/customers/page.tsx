import { SearchParams } from "@/components/data-table/type";
import { isLoggedIn } from "@/server/user";
import { CustomerPage } from "@/views/customer/components/customer-page";
import { searchCustomerParams } from "@/views/customer/schema/customer.schema";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "客户中心",
};

export interface CustomerPageProps {
  searchParams: SearchParams;
}

export const runtime = "edge";

export default async function Page({ searchParams }: CustomerPageProps) {
  if (!(await isLoggedIn())) {
    redirect("/login");
  }

  const search = searchCustomerParams.parse(searchParams);

  return <CustomerPage search={search} />;
}
