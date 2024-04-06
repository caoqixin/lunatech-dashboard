import PhonePage from "@/components/pages/phone/phone-page";
import { SearchParams } from "@/components/tables/v2/types";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/user";
import { searchPhoneParamsSchema } from "@/schemas/search-params-schema";
import { Metadata, ResolvingMetadata } from "next";

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

  return <PhonePage brandId={brandId} search={search} />;
}

export async function generateMetadata(
  { params, searchParams }: PhonePageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // read route params
  const id = params.brandId;

  // fetch data
  const brand = await prisma.brand.findUnique({
    where: {
      id: parseInt(id),
    },
  });

  if (brand === null) {
    return {
      title: "机型管理",
    };
  }
  return {
    title: `${brand.name} 的机型`,
  };
}
