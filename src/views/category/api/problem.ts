"use server";
import { unstable_noStore as noStore } from "next/cache";

import {
  Category,
  CategorySearchParams,
} from "@/views/category/schema/category.schema";
import { DataReturnType } from "@/lib/definitions";
import { createClient } from "@/lib/supabase/server";

export async function fetchProblems(params: CategorySearchParams) {
  noStore();
  const { page, per_page } = params;
  const from = (page - 1) * per_page;
  const to = from + per_page - 1;
  const supabase = await createClient();

  const { data } = await supabase
    .from("repair_problems")
    .select("*")
    .range(from, to)
    .order("name");

  return data ?? [];
}

export async function fetchProblemsForCreateComponent() {
  const supabase = await createClient();

  const { data } = await supabase
    .from("repair_problems")
    .select("*")
    .order("name");

  return (
    data?.map((item) => ({
      id: item.id,
      name: item.name ?? "",
    })) ?? []
  );
}

export async function countProblems(per_page: number) {
  noStore();
  const supabase = await createClient();

  const { count } = await supabase
    .from("repair_problems")
    .select("*", { count: "exact", head: true });

  return Math.ceil((count ?? 0) / per_page);
}

export async function createProblem(
  formData: Category
): Promise<DataReturnType> {
  const { name } = formData;

  const supabase = await createClient();
  const { error } = await supabase.from("repair_problems").insert({
    name,
  });

  if (error) {
    return {
      msg: `维修故障类别 [${name}] 添加失败, 请重试! 失败原因: ${error.message}`,
      status: "error",
    };
  }

  return { msg: `维修故障类别 [${name}] 添加成功`, status: "success" };
}

export async function updateProblem(
  formData: Category,
  id: number
): Promise<DataReturnType> {
  const supabase = await createClient();
  const { name } = formData;

  const { data, error } = await supabase
    .from("repair_problems")
    .update({
      name,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return {
      msg: `维修故障类别 [${name}] 更新失败, 请重试! 失败原因: ${error.message}`,
      status: "error",
    };
  }

  return {
    msg: `维修故障类别更新成功, 重命名为 ${data.name}`,
    status: "success",
  };
}

export async function deleteProblem(id: number): Promise<DataReturnType> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("repair_problems")
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

  return { msg: `维修故障类别 [${data.name}] 删除成功`, status: "success" };
}
