"use server";

import { unstable_noStore as noStore } from "next/cache";
import { DataReturnType } from "@/lib/definitions";
import {
  CustomerSchema,
  SearchCustomer,
} from "@/views/customer/schema/customer.schema";
import { createClient } from "@/lib/supabase/server";
import { Customer } from "@/lib/types";

export async function fetchCustomers(params: SearchCustomer) {
  noStore();
  const { page, per_page, tel } = params;
  const from = (page - 1) * per_page;
  const to = from + per_page - 1;
  const supabase = await createClient();

  const { data } = await supabase
    .from("customers")
    .select("*")
    .range(from, to)
    .ilike("tel", `%${tel ?? ""}%`)
    .order("id");

  return data ?? [];
}

export async function fetchCustomersForCreateRepair() {
  const supabase = await createClient();

  const { data } = await supabase.from("customers").select("*").order("name");

  return data;
}

// count how many page have
export async function countCustomers(per_page: number, search: string) {
  noStore();
  const supabase = await createClient();

  const { count } = await supabase
    .from("customers")
    .select("*", { count: "exact", head: true })
    .like("tel", `%${search}%`);

  return Math.ceil((count ?? 0) / per_page);
}

// count all customers
export async function countAllCustomers() {
  noStore();
  const supabase = await createClient();

  const { count } = await supabase
    .from("customers")
    .select("*", { count: "exact", head: true });

  return count ?? 0;
}

export async function exportAllCustomers() {
  const supabase = await createClient();
  const { data } = await supabase.from("customers").select("*").csv();

  return data ?? "";
}

export async function fetchRepairInfo(customerId: number) {
  noStore();
  const supabase = await createClient();

  const { data } = await supabase
    .from("repairs")
    .select()
    .eq("customerId", customerId);

  return data;
}

export async function createCustomer(
  data: CustomerSchema
): Promise<DataReturnType> {
  const { name, tel, email } = data;

  const supabase = await createClient();
  const { error } = await supabase.from("customers").insert({
    name,
    tel,
    email,
  });

  if (error) {
    return {
      msg: `客户 [${name}] 添加失败, 请重试! 失败原因: ${error.message}`,
      status: "error",
    };
  }

  return { msg: `客户 [${name}] 添加成功`, status: "success" };
}

export async function createCustomerForCreateRepair(
  formData: CustomerSchema
): Promise<DataReturnType & { data: Customer | null }> {
  const { name, tel, email } = formData;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("customers")
    .insert({
      name,
      tel,
      email,
    })
    .select()
    .single();

  if (error) {
    return {
      msg: `客户 [${name}] 添加失败, 请重试! 失败原因: ${error.message}`,
      status: "error",
      data: null,
    };
  }

  return { msg: `客户 [${name}] 添加成功`, status: "success", data };
}

export async function updateCustomer(
  formData: CustomerSchema,
  id: number
): Promise<DataReturnType> {
  const supabase = await createClient();
  const { name, tel, email } = formData;

  const { error } = await supabase
    .from("customers")
    .update({
      name,
      tel,
      email,
    })
    .eq("id", id);

  if (error) {
    return {
      msg: `客户 [${name}] 更新失败, 请重试! 失败原因: ${error.message}`,
      status: "error",
    };
  }

  return { msg: `客户 [${name}] 更新成功`, status: "success" };
}

export async function deleteCustomer(id: number): Promise<DataReturnType> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("customers")
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

  return { msg: `客户 [${data.name}] 删除成功`, status: "success" };
}
