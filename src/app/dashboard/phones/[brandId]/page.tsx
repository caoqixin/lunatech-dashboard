import { SearchParams } from "@/components/data-table/type";
import { createClient } from "@/lib/supabase/client";
// import {
//   generateBrandIdParams,
//   getBrandById,
// } from "@/lib/actions/server/brands";
import { isLoggedIn } from "@/server/user";
import { PhonePage } from "@/views/phones/components/phone-page";
import { searchPhoneParamsSchema } from "@/views/phones/schema/phone.schema";
import { Metadata, ResolvingMetadata } from "next";
import { redirect } from "next/navigation";

export interface PhonePageProps {
  searchParams: SearchParams;
  params: {
    brandId: string;
  };
}

export default async function Page({ params, searchParams }: PhonePageProps) {
  if (!(await isLoggedIn())) {
    redirect("/login");
  }

  const search = searchPhoneParamsSchema.parse(searchParams);

  return <PhonePage search={search} brandId={params.brandId} />;
}

async function fetchAllBrandId() {
  const supabase = createClient();

  const { data } = await supabase.from("brands").select();

  return data ?? [];
}

async function fetchBrandTitleById(id: number) {
  const supabase = createClient();

  const { data } = await supabase
    .from("brands")
    .select("name")
    .eq("id", id)
    .single();

  return data;
}

// 生成静态参数
export async function generateStaticParams() {
  const brands = await fetchAllBrandId();

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
  const brand = await fetchBrandTitleById(parseInt(id));

  if (brand === null) {
    return {
      title: "机型管理",
    };
  }
  return {
    title: `${brand.name} 的机型`,
  };
}
