import WarrantyPage from "@/components/pages/warranty/warranty-page";
import { SearchParams } from "@/components/tables/v2/types";
import { auth } from "@/lib/user";
import { searchWarrantyParamsSchema } from "@/schemas/search-params-schema";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "保修管理",
};
export interface WarrantyPageProps {
  searchParams: SearchParams;
}
export default async function Page({ searchParams }: WarrantyPageProps) {
  await auth();

  const search = searchWarrantyParamsSchema.parse(searchParams);
  return <WarrantyPage search={search} />;
}
