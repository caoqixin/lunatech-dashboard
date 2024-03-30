import CategoryPage from "@/components/pages/categories/category-page";
import { SearchParams } from "@/components/tables/v2/types";
import { searchParamsSchema } from "@/schemas/search-params-schema";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "分类管理",
};

export interface CategoryPageProps {
  searchParams: SearchParams;
}

export default function Page({ searchParams }: CategoryPageProps) {
  const search = searchParamsSchema.parse(searchParams);
  return <CategoryPage search={search} />;
}
