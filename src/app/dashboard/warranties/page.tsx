import WarrantyPage from "@/components/pages/warranty/warranty-page";
import { SearchParams } from "@/components/tables/v2/types";
import { searchWarrantyParamsSchema } from "@/schemas/search-params-schema";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "保修管理",
};
export interface WarrantyPageProps {
  searchParams: SearchParams;
}
export default function Page({ searchParams }: WarrantyPageProps) {
  const search = searchWarrantyParamsSchema.parse(searchParams);
  return <WarrantyPage search={search} />;
}
