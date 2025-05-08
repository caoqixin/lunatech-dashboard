"use server";
import { unstable_noStore as noStore } from "next/cache";

import { Brand as BrandSchema } from "@/views/brand/schema/brand.schema";
import { DataReturnType } from "@/lib/definitions";
import { createClient } from "@/lib/supabase/server";
import { fetchPhonesByBrandId } from "@/views/phones/api/phone";

export async function fetchBrands(key: string) {
  noStore();

  const supabase = await createClient();

  const { data } = await supabase
    .from("brands")
    .select()
    .ilike("name", `%${key}%`)
    .order("name");

  return data ?? [];
}

export async function fetchComponentBrandsFilterOptions() {
  const supabase = await createClient();

  const { data } = await supabase.from("brands").select("name").order("name");

  return data ?? [];
}

export async function fetchBrandsForCreateComponent() {
  const supabase = await createClient();

  const { data } = await supabase.from("brands").select("*").order("name");

  return (
    data?.map((item) => ({
      name: item.name,
      id: item.id,
    })) ?? []
  );
}

export async function createNewBrand(
  formData: BrandSchema
): Promise<DataReturnType> {
  const supabase = await createClient();

  const { name, brand_image } = formData;

  const { error: CreateError } = await supabase.from("brands").insert({
    name: name,
    brand_image: brand_image as string,
  });

  if (CreateError) {
    return {
      msg: `品牌创建失败 失败原因: ${CreateError.message}`,
      status: "error",
    };
  }

  return {
    msg: `品牌 '${name}' 创建成功`,
    status: "success",
  };
}

export async function updateBrand(
  formData: BrandSchema,
  id: number
): Promise<DataReturnType> {
  const supabase = await createClient();

  const { name, brand_image } = formData;

  const { error: CreateError } = await supabase
    .from("brands")
    .update({
      name: name,
      brand_image: brand_image as string,
    })
    .eq("id", id);

  if (CreateError) {
    return {
      msg: `品牌更新 失败原因: ${CreateError.message}`,
      status: "error",
    };
  }

  return {
    msg: `品牌 '${name}' 更新成功`,
    status: "success",
  };
}

export async function deleteBrand(id: number): Promise<DataReturnType> {
  const supabase = await createClient();

  // 确认是否有手机型号存在
  const hasPhones = await fetchPhonesByBrandId(id);

  if (hasPhones?.length > 0) {
    return {
      msg: `品牌删除失败, 失败原因: 该品牌下还有手机型号存在, 请删除手机型号后再试`,
      status: "error",
    };
  }

  const { data, error } = await supabase
    .from("brands")
    .delete()
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return {
      msg: `品牌删除失败, 失败原因: ${error.message}`,
      status: "success",
    };
  }

  return {
    msg: `品牌 '${data.name}' 删除成功`,
    status: "success",
  };
}
