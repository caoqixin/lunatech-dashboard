import CustomerPage from "@/components/pages/customer/customer-page";
import { SearchParams } from "@/components/tables/v2/types";
import { searchCustomerParamsSchema } from "@/schemas/search-params-schema";
export interface CustomerPageProps {
  searchParams: SearchParams;
}

export default function Page({ searchParams }: CustomerPageProps) {
  const search = searchCustomerParamsSchema.parse(searchParams);

  return <CustomerPage search={search} />;
}
