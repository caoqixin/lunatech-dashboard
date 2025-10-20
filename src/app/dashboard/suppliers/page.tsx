import { SearchParams } from "@/components/data-table/type";
import { isLoggedIn } from "@/server/user";
import { SupplierPage } from "@/views/supplier/components/supplier-page";
import { SupplierSearchParamsSchema } from "@/views/supplier/schema/supplier.schema";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "供应商管理",
};

export interface SupplierPageProps {
  searchParams: SearchParams;
}

export default async function Page({ searchParams }: SupplierPageProps) {
  if (!(await isLoggedIn())) {
    redirect("/login");
  }
  const search = SupplierSearchParamsSchema.parse(searchParams);

  return <SupplierPage search={search} />;
}
