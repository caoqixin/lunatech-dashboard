"use server";
import { unstable_noStore as noStore } from "next/cache";

import {
  Supplier,
  SupplierSearchParams,
} from "@/views/supplier/schema/supplier.schema";
import { DataReturnType } from "@/lib/definitions";
import { createClient } from "@/lib/supabase/server";

export async function fetchSuppliers(params: SupplierSearchParams) {
  noStore();
  const { page, per_page } = params;
  const from = (page - 1) * per_page;
  const to = from + per_page - 1;
  const supabase = await createClient();

  const { data } = await supabase
    .from("suppliers")
    .select("*")
    .range(from, to)
    .order("id");

  return data ?? [];
}

export async function fetchSuppliersForCreateComponent() {
  const supabase = await createClient();

  const { data } = await supabase.from("suppliers").select("*").order("name");

  return (
    data?.map((item) => ({
      id: item.id,
      name: item.name,
    })) ?? []
  );
}

// count how many page have
export async function countSuppliers(per_page: number) {
  noStore();
  const supabase = await createClient();

  const { count } = await supabase
    .from("suppliers")
    .select("*", { count: "exact", head: true });

  return Math.ceil((count ?? 0) / per_page);
}

export async function createSupplier(data: Supplier): Promise<DataReturnType> {
  const { name, description, site, username, password } = data;

  const supabase = await createClient();
  const { error } = await supabase.from("suppliers").insert({
    name,
    description,
    site,
    username,
    password,
  });

  if (error) {
    return {
      msg: `供应商 [${name}] 添加失败, 请重试! 失败原因: ${error.message}`,
      status: "error",
    };
  }

  return { msg: `供应商 [${name}] 添加成功`, status: "success" };
}

async function fetchSupplierNameForUpdate(id: number) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("suppliers")
    .select("name")
    .eq("id", id)
    .single();

  return data?.name;
}

export async function updateSupplier(
  formData: Supplier,
  id: number
): Promise<DataReturnType> {
  const supabase = await createClient();
  const { name, description, username, site, password } = formData;

  const oldName = await fetchSupplierNameForUpdate(id);

  const { data, error } = await supabase
    .from("suppliers")
    .update({
      name,
      description,
      site,
      username,
      password,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return {
      msg: `供应商 [${name}] 更新失败, 请重试! 失败原因: ${error.message}`,
      status: "error",
    };
  }

  if (oldName !== data.name) {
    return {
      msg: `供应商 [${name}] 更新成功, 重命名为 ${data.name}`,
      status: "success",
    };
  }

  return { msg: `供应商 [${name}] 更新成功`, status: "success" };
}

export async function deleteSupplier(id: number): Promise<DataReturnType> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("suppliers")
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

  return { msg: `供应商 [${data.name}] 删除成功`, status: "success" };
}
