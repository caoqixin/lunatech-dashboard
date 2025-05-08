"use server";

import { unstable_noStore as noStore } from "next/cache";
import type { DataReturnType } from "@/lib/definitions";
import { createClient } from "@/lib/supabase/server";
import type {
  ComponentSchema,
  SearchComponent,
} from "@/views/component/schema/component.schema";

export async function fetchComponentsByQuery(query: string) {
  noStore();
  const supabase = await createClient();
  const textSearch = query
    .trim()
    .replace(/\s+/g, " ")
    .split(" ")
    .map((item) => `${item}:*`)
    .join(" & ");

  const { data, error } = await supabase.rpc("search_components_name", {
    query: textSearch,
  });

  if (error) {
    return { msg: `查询失败, 请重试, 失败原因: ${error.details}`, data: [] };
  }

  if (!data) {
    return { msg: `查询结果为空`, data: [] };
  }

  return { data };
}

export async function fetchComponentsByPhoneName(phone: string) {
  noStore();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("components")
    .select()
    .contains("model", [phone]);

  if (error) {
    throw new Error("配件获取失败, 请重试");
  }

  return data;
}

export async function fetchComponents(params: SearchComponent) {
  noStore();
  const { page, per_page, name, brand, category } = params;
  const from = (page - 1) * per_page;
  const to = from + per_page - 1;
  const supabase = await createClient();

  const query = supabase.from("components").select("*").range(from, to);
  const categories = category.split(".");
  const brands = brand.split(".");

  // 动态组合条件
  if (name) query.or(`name.ilike.%${name}%, code.ilike.%${name}%`);
  if (brand && brand.length > 0) query.in("brand", brands);
  if (category) query.in("category", categories);

  const { data } = await query.order("name");

  return data ?? [];
}

// count how many page have
export async function countComponents(params: SearchComponent) {
  noStore();
  const { per_page, name, brand, category } = params;
  const categories = category.split(".");
  const brands = brand.split(".");

  const supabase = await createClient();

  const query = supabase
    .from("components")
    .select("*", { count: "exact", head: true });

  // 动态组合条件
  if (name) query.or(`name.ilike.%${name}%, code.ilike.%${name}%`);
  if (brand && brand.length > 0) query.in("brand", brands);
  if (category) query.in("category", categories);

  const { count } = await query;

  return Math.ceil((count ?? 0) / per_page);
}

export async function updateComponentName(
  newName: string,
  id: number
): Promise<DataReturnType> {
  const supabase = await createClient();

  const { error } = await supabase
    .from("components")
    .update({
      name: newName,
    })
    .eq("id", id);

  if (error) {
    return {
      msg: `配件名称更新失败, 失败原因:${error.message}`,
      status: "error",
    };
  }

  return { msg: "配件名称更新成功", status: "success" };
}

export async function updateComponentQuality(
  quality: string,
  id: number
): Promise<DataReturnType> {
  const supabase = await createClient();

  const { error } = await supabase
    .from("components")
    .update({
      quality,
    })
    .eq("id", id);

  if (error) {
    return {
      msg: `配件品质更新失败, 失败原因:${error.message}`,
      status: "error",
    };
  }

  return { msg: "配件品质更新成功", status: "success" };
}

export async function updateComponentStock(
  stock: number,
  id: number
): Promise<DataReturnType> {
  const supabase = await createClient();

  const { error } = await supabase
    .from("components")
    .update({
      stock: Math.max(0, stock),
    })
    .eq("id", id);

  if (error) {
    return {
      msg: `配件库存更新失败, 失败原因:${error.message}`,
      status: "error",
    };
  }

  return { msg: "配件库存更新成功", status: "success" };
}

export async function createNewComponent(
  formData: ComponentSchema
): Promise<DataReturnType> {
  const supabase = await createClient();
  const {
    code,
    name,
    brand,
    category,
    model,
    stock,
    purchase_price,
    public_price,
    quality,
    supplier,
    alias,
  } = formData;

  const { error } = await supabase.from("components").insert({
    code,
    name,
    brand,
    category,
    model,
    stock,
    public_price: public_price ?? purchase_price + 35,
    purchase_price,
    quality,
    supplier,
    alias,
  });

  if (error) {
    return { msg: `配件添加失败, 失败原因:${error.message}`, status: "error" };
  }

  return { msg: `配件 ${name} 添加成功`, status: "success" };
}

export async function updateComponent(
  formData: ComponentSchema,
  id: number
): Promise<DataReturnType> {
  const supabase = await createClient();
  const {
    code,
    name,
    brand,
    category,
    model,
    stock,
    purchase_price,
    public_price,
    quality,
    supplier,
    alias,
  } = formData;

  const { error } = await supabase
    .from("components")
    .update({
      code,
      name,
      brand,
      category,
      model,
      stock,
      public_price: public_price ?? purchase_price + 35,
      purchase_price,
      quality,
      supplier,
      alias,
    })
    .eq("id", id);

  if (error) {
    return { msg: `配件更新失败, 失败原因:${error.message}`, status: "error" };
  }

  return { msg: `配件 ${name} 更新成功`, status: "success" };
}

export async function deleteComponent(id: number): Promise<DataReturnType> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("components")
    .delete()
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return {
      msg: `配件删除失败, 失败原因: ${error.message}`,
      status: "error",
    };
  }

  return {
    msg: `配件 ${data.name} 删除成功`,
    status: "success",
  };
}
