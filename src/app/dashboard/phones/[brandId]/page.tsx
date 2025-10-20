import { SearchParams } from "@/components/data-table/type";
import { createClient } from "@/lib/supabase/client";
import { isLoggedIn } from "@/server/user";
import { PhonePage } from "@/views/phones/components/phone-page";
import { searchPhoneParamsSchema } from "@/views/phones/schema/phone.schema";
import { Metadata, ResolvingMetadata } from "next";
import { redirect, notFound } from "next/navigation";
import { fetchPhonesByBrand } from "@/views/phones/api/phone";
import type { Phone } from "@/lib/types";

export interface PhonePageProps {
  searchParams: SearchParams;
  params: {
    brandId: string;
  };
}
export const runtime = "edge";

// --- Server-side Data Fetching Functions ---
async function safeFetchBrandTitleById(
  id: number
): Promise<{ name: string } | null> {
  // Ensure ID is a valid number before querying
  if (isNaN(id) || id <= 0) {
    return null;
  }

  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("brands")
      .select("name")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error(`Error fetching brand title for ID ${id}:`, error);
    return null;
  }
}

async function fetchAllBrandIdsForStaticParams(): Promise<{ id: number }[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from("brands").select("id");
    if (error) throw error;
    return data ?? [];
  } catch (error) {
    console.error("Error fetching brand IDs for static params:", error);
    return []; // Return empty array on error
  }
}

// 生成静态参数
export async function generateStaticParams() {
  const brands = await fetchAllBrandIdsForStaticParams();
  return brands.map((brand) => ({
    brandId: brand.id.toString(),
  }));
}

export async function generateMetadata(
  { params }: PhonePageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const id = parseInt(params.brandId, 10);
  const brand = await safeFetchBrandTitleById(id);

  if (!brand) {
    return {
      title: "未知品牌 | 机型管理", // Fallback title
    };
  }

  return {
    title: `${brand.name} | 机型管理`,
    description: `管理 ${brand.name} 品牌下的所有手机型号`,
  };
}

export default async function Page({ params, searchParams }: PhonePageProps) {
  if (!(await isLoggedIn())) {
    redirect("/login");
  }

  const brandIdNumber = parseInt(params.brandId, 10);
  // 1. Validate Brand ID first
  const brandInfo = await safeFetchBrandTitleById(brandIdNumber);
  if (!brandInfo) {
    console.warn(`Brand with ID ${params.brandId} not found.`);
    return notFound(); // Show 404 if brand doesn't exist
  }

  // 2. Validate Search Params
  const searchResult = searchPhoneParamsSchema.safeParse(searchParams);
  if (!searchResult.success) {
    console.error("Invalid phone search params:", searchResult.error);
    // Redirect to the same brand page with default params
    redirect(`/dashboard/phones/${params.brandId}`);
  }
  const searchData = searchResult.data;

  // 3. Fetch Initial Data for the Client Component
  let initialData: Phone[] = [];
  let initialTotalPage = 0;
  let fetchError: string | null = null;

  try {
    [initialData, initialTotalPage] = await fetchPhonesByBrand(
      brandIdNumber,
      searchData
    );
  } catch (error) {
    console.error(
      `Error fetching phones for brand ID ${brandIdNumber}:`,
      error
    );
    fetchError = "无法加载该品牌的手机型号列表。";
  }

  return (
    <PhonePage
      brandId={params.brandId} // Pass string ID
      brandName={brandInfo.name} // Pass brand name
      search={searchData}
      initialData={initialData ?? []}
      initialTotalPage={initialTotalPage ?? 0}
      fetchError={fetchError}
    />
  );
}
