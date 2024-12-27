"use server";
import { unstable_noStore as noStore } from "next/cache";

import { DataReturnType } from "@/lib/definitions";
import { createClient } from "@/lib/supabase/server";
import {
  PhoneSchema,
  SearchPhoneParams,
} from "@/views/phones/schema/phone.schema";
import { Phone } from "@/lib/types";

export async function fetchPhoneTitleByBrandId(brandId: number) {
  noStore();
  const supabase = await createClient();

  const { data } = await supabase
    .from("brands")
    .select()
    .eq("id", brandId)
    .single();

  return data;
}

export async function fetchPhonesByBrandId(brandId: number) {
  noStore();
  const supabase = await createClient();

  const { data } = await supabase
    .from("phones")
    .select("*")
    .eq("brandId", brandId);

  return data;
}

export async function fetchPhonesByBrand(
  brandId: number,
  searchParams: SearchPhoneParams
): Promise<[Phone[], number]> {
  noStore();
  const supabase = await createClient();
  const { page, per_page, name } = searchParams;

  const from = (page - 1) * per_page;
  const to = from + per_page - 1;

  const { data, count } = await supabase
    .from("phones")
    .select("*", { count: "exact" })
    .eq("brandId", brandId)
    .ilike("name", `%${name}%`)
    .range(from, to)
    .order("name");

  const totalPage = Math.ceil((count ?? 0) / per_page);

  return [data ?? [], totalPage];
}

export async function fetchPhonesByName(name: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("phones")
    .select()
    .ilike("name", `%${name}%`);

  if (error) {
    return [];
  }

  return data ?? [];
}

export async function fetchPhonesByBrandForCreateComponent(brandName: string) {
  const supabase = await createClient();

  const { data } = await supabase
    .from("brands")
    .select(`name, phones (id, name)`)
    .eq("name", brandName)
    .single();

  return data?.phones ?? [];
}

export async function createNewPhone(formData: PhoneSchema, brandId: number) {
  const { name, isTablet, code } = formData;
  const supabase = await createClient();

  const { error } = await supabase.from("phones").insert({
    brandId,
    name,
    code,
    isTablet,
  });

  if (error) {
    return {
      msg: `手机型号 '${name}' 创建失败, 失败原因: ${error.message}`,
      status: "error",
    };
  }

  return {
    msg: `手机型号 '${name}' 创建成功`,
    status: "success",
  };
}

export async function updatePhone(
  formData: PhoneSchema,
  id: number
): Promise<DataReturnType> {
  const { name, isTablet, code } = formData;
  const supabase = await createClient();

  const { error } = await supabase
    .from("phones")
    .update({
      name,
      code,
      isTablet,
    })
    .eq("id", id);

  if (error) {
    return {
      msg: `手机型号 '${name}' 更新失败, 失败原因: ${error.message}`,
      status: "error",
    };
  }

  return {
    msg: `手机型号 '${name}' 更新成功`,
    status: "success",
  };
}

export async function deletePhone(id: number): Promise<DataReturnType> {
  const supabase = await createClient();

  const { error } = await supabase.from("phones").delete().eq("id", id);

  if (error) {
    return {
      msg: `手机型号删除失败, 失败原因: ${error.message}`,
      status: "error",
    };
  }

  return {
    msg: `手机型号删除成功`,
    status: "success",
  };
}
