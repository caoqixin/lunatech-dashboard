import ComponentPage from "@/components/pages/repair_components/components-page";
import { SearchParams } from "@/components/tables/v2/types";
import { searchComponentParamsSchema } from "@/schemas/search-params-schema";

export interface ComponentPageProps {
  searchParams: SearchParams;
}

export default function Page({ searchParams }: ComponentPageProps) {
  const search = searchComponentParamsSchema.parse(searchParams);
  return <ComponentPage search={search} />;
}
