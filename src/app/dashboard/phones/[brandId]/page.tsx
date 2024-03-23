import PhonePage from "@/components/pages/phone/phone-page";
import { SearchParams } from "@/components/tables/v2/types";
import { searchPhoneParamsSchema } from "@/schemas/search-params-schema";

export interface PhonePageProps {
  searchParams: SearchParams;
  params: {
    brandId: string;
  };
}

export default function Page({ params, searchParams }: PhonePageProps) {
  const brandId = parseInt(params.brandId);
  const search = searchPhoneParamsSchema.parse(searchParams);

  return <PhonePage brandId={brandId} search={search} />;
}
