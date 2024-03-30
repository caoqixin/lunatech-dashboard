import RepairPage from "@/components/pages/repair/repair-page";
import { SearchParams } from "@/components/tables/v2/types";
import { searchParamsSchema } from "@/schemas/search-params-schema";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "维修管理",
};

export interface RepairPageProps {
  searchParams: SearchParams;
}
export default function Page({ searchParams }: RepairPageProps) {
  const search = searchParamsSchema.parse(searchParams);
  return <RepairPage search={search} />;
}
