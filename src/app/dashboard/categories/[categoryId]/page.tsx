import CategoryItemPage from "@/components/pages/categories/category-items-page";
import { SearchParams } from "@/components/tables/v2/types";
import { searchParamsSchema } from "@/schemas/search-params-schema";

export interface CategoryItemPageProps {
  searchParams: SearchParams;
  params: {
    categoryId: string;
  };
}

export default function Page({ params, searchParams }: CategoryItemPageProps) {
  const categoryId = parseInt(params.categoryId);
  const search = searchParamsSchema.parse(searchParams);

  return <CategoryItemPage categoryId={categoryId} search={search} />;
}
