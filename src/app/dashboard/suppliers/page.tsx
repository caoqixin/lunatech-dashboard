import SupplierPage from "@/components/pages/suppliers/supplier-page";
import { SearchParams } from "@/components/tables/v2/types";
import { auth } from "@/lib/user";
import { searchParamsSchema } from "@/schemas/search-params-schema";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "供应商管理",
};

export interface SupplierPageProps {
  searchParams: SearchParams;
}
export default async function Page({ searchParams }: SupplierPageProps) {
  await auth();

  const search = searchParamsSchema.parse(searchParams);

  return <SupplierPage search={search} />;
}
