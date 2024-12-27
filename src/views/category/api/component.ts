"use server";
import { unstable_noStore as noStore } from "next/cache";

import {
  Category,
  CategorySearchParams,
} from "@/views/category/schema/category.schema";
import { DataReturnType } from "@/lib/definitions";
import { createClient } from "@/lib/supabase/server";

export async function fetchComponentCategories(params: CategorySearchParams) {
  noStore();
  const { page, per_page } = params;
  const from = (page - 1) * per_page;
  const to = from + per_page - 1;
  const supabase = await createClient();

  const { data } = await supabase
    .from("component_categories")
    .select("*")
    .range(from, to)
    .order("name");

  return data ?? [];
}

export async function fetchComponentCategoryFilterOptions() {
  const supabase = await createClient();

  const { data } = await supabase
    .from("component_categories")
    .select("name")
    .order("name");

  return data ?? [];
}

export async function fetchCategoryForCreateComponent() {
  const supabase = await createClient();

  const { data } = await supabase
    .from("component_categories")
    .select("*")
    .order("name");

  return (
    data?.map((item) => ({
      name: item.name,
      id: item.id,
    })) ?? []
  );
}

export async function countComponentCategory(per_page: number) {
  noStore();
  const supabase = await createClient();

  const { count } = await supabase
    .from("component_categories")
    .select("*", { count: "exact", head: true });

  return Math.ceil((count ?? 0) / per_page);
}

export async function createComponentCategory(
  formData: Category
): Promise<DataReturnType> {
  const { name } = formData;

  const supabase = await createClient();
  const { error } = await supabase.from("component_categories").insert({
    name,
  });

  if (error) {
    return {
      msg: `配件分类 [${name}] 添加失败, 请重试! 失败原因: ${error.message}`,
      status: "error",
    };
  }

  return { msg: `配件分类 [${name}] 添加成功`, status: "success" };
}

export async function updateComponentCategory(
  formData: Category,
  id: number
): Promise<DataReturnType> {
  const supabase = await createClient();
  const { name } = formData;

  const { data, error } = await supabase
    .from("component_categories")
    .update({
      name,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return {
      msg: `配件分类 [${name}] 更新失败, 请重试! 失败原因: ${error.message}`,
      status: "error",
    };
  }

  return {
    msg: `配件分类更新成功, 重命名为 ${data.name}`,
    status: "success",
  };
}

export async function deleteComponentCategory(
  id: number
): Promise<DataReturnType> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("component_categories")
    .delete()
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return {
      msg: `删除失败, 请重试! 失败原因: ${error.message}`,
      status: "error",
    };
  }

  return { msg: `配件分类 [${data.name}] 删除成功`, status: "success" };
}
