import BrandPage from "@/components/pages/brand/brand-page";
import { SearchParams } from "@/components/tables/v2/types";
import { searchParamsSchema } from "@/schemas/search-params-schema";

export interface BrandPageProps {
  searchParams: SearchParams;
}

export default function Page({ searchParams }: BrandPageProps) {
  const search = searchParamsSchema.parse(searchParams);

  return <BrandPage search={search} />;
}
