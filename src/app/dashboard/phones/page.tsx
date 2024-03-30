import BrandPage from "@/components/pages/brand/brand-page";
import { SearchParams } from "@/components/tables/v2/types";
import { searchParamsSchema } from "@/schemas/search-params-schema";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "机型管理",
};

export interface BrandPageProps {
  searchParams: SearchParams;
}

export default function Page({ searchParams }: BrandPageProps) {
  const search = searchParamsSchema.parse(searchParams);

  return <BrandPage search={search} />;
}
