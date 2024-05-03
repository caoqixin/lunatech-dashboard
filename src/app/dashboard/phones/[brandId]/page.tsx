import DashboardDataSkeleton from "@/components/pages/_components/skeleton/dashboard-data-skeleton";
import PhonePage from "@/components/pages/phone/phone-page";
import { SearchParams } from "@/components/tables/v2/types";
import {
  generateBrandIdParams,
  getBrandById,
} from "@/lib/actions/server/brands";
import { auth } from "@/lib/user";
import { searchPhoneParamsSchema } from "@/schemas/search-params-schema";
import { Metadata, ResolvingMetadata } from "next";
import { Suspense } from "react";

export interface PhonePageProps {
  searchParams: SearchParams;
  params: {
    brandId: string;
  };
}

export default async function Page({ params, searchParams }: PhonePageProps) {
  await auth();

  const brandId = parseInt(params.brandId);
  const search = searchPhoneParamsSchema.parse(searchParams);

  return (
    <Suspense fallback={<DashboardDataSkeleton searchaBle />}>
      <PhonePage brandId={brandId} search={search} />
    </Suspense>
  );
}

// 生成静态参数
export async function generateStaticParams() {
  const brands = await generateBrandIdParams();

  return brands.map((brand) => ({
    brandId: brand.id.toString(),
  }));
}

export async function generateMetadata(
  { params, searchParams }: PhonePageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // read route params
  const id = params.brandId;

  // fetch data
  const brand = await getBrandById(parseInt(id));

  if (brand === null) {
    return {
      title: "机型管理",
    };
  }
  return {
    title: `${brand.name} 的机型`,
  };
}
